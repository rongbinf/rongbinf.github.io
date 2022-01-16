"use strict";
exports.__esModule = true;
exports.fragmentToRangeList = exports.selectionToFragment = void 0;
var cyrb53_1 = require("../util/cyrb53");
var base64_1 = require("../util/base64");
// See docs/spec/v1.md for what this code implements.
// It must also be compatible with docs/spec/v0.md.
// See https://dom.spec.whatwg.org/#interface-node
// The minifier isn't smart enough to know this, so do it ourselves and save
// the, uh 26 bytes...
var TEXT_NODE = 3;
// Same as above, see https://dom.spec.whatwg.org/#interface-nodefilter
var NODEFILTER_SHOW_TEXT = 0x04;
function hashNode(n) {
    return (0, base64_1.fromNumber)((0, cyrb53_1.cyrb53)(n.wholeText));
}
// Take a range, and return a new range containing the same text, but ensuring
// that the start and end are both non-whitespace-only text nodes.
function normalizeRange(range) {
    // We start off by picking start and end nodes. If the start node is a text
    // node, we can just use it as is. If it's a element node, though, we need to
    // use the offset to figure out which child node is the one that's actually
    // selected.
    //
    // There's a additional hiccup that the offsets used by Range represent the
    // spaces in between child nodes, while the TreeWalker API operates on the
    // nodes directly. Because of this, we need to keep track of whether the
    // selected text starts/ends before or after the start/end node. The
    // startOffset/endOffset variables do double duty in this regard — if the
    // startNode/endNode is a text node, the startOffset/endOffset is a text
    // offset, but if the startNode/endNode is a element node, they represent
    // whether the selection starts/ends before the node (0) or after the node
    // (1).
    var makeNodeAndOffset = function (initNode, initOffset) {
        var node, offset;
        if (initNode.nodeType == TEXT_NODE || initNode.childNodes.length == 0) {
            node = initNode;
            offset = initOffset;
        }
        else {
            node = initNode.childNodes[Math.min(initOffset, initNode.childNodes.length - 1)];
            if (node.nodeType == TEXT_NODE) {
                offset = (initOffset == initNode.childNodes.length) ? node.wholeText.length : 0;
            }
            else {
                offset = (initOffset == initNode.childNodes.length) ? 1 : 0;
            }
        }
        return [node, offset];
    };
    var _a = makeNodeAndOffset(range.startContainer, range.startOffset), startNode = _a[0], startOffset = _a[1];
    var _b = makeNodeAndOffset(range.endContainer, range.endOffset), endNode = _b[0], endOffset = _b[1];
    var newRange = new Range();
    var treeWalker = document.createTreeWalker(range.commonAncestorContainer);
    // stages:
    // 0 = Looking for startNode.
    // 1 = startNode found, but it wasn't a non-empty text node — looking for a
    //     non-empty text node.
    // 2 = Looking for endNode.
    var stage = 0;
    var node = treeWalker.currentNode;
    var prevEndNode = endNode;
    while (node) {
        if (stage == 0 && node == startNode) {
            if (node.nodeType != TEXT_NODE && startOffset != 0) {
                node = treeWalker.nextNode();
                if (!node) {
                    return null;
                }
            }
            stage = 1;
        }
        if (node.nodeType == TEXT_NODE && node.wholeText.trim() != '') {
            if (stage == 1) {
                newRange.setStart(node, (node == startNode) ? startOffset : 0);
                stage = 2;
            }
            if (stage == 2) {
                prevEndNode = newRange.endContainer;
                newRange.setEnd(node, node.wholeText.length);
            }
        }
        if (stage == 2 && node == endNode) {
            if (node.nodeType == TEXT_NODE && node.wholeText.trim() != '') {
                newRange.setEnd(node, endOffset);
                return newRange;
            }
            if (node == newRange.endContainer && endOffset == 0) {
                newRange.setEnd(prevEndNode, prevEndNode.wholeText.length);
            }
            return newRange;
        }
        node = treeWalker.nextNode();
    }
    return null;
}
function selectionToFragment(selection) {
    var ranges = [];
    for (var i = 0; i < selection.rangeCount; i++) {
        var range = normalizeRange(selection.getRangeAt(i));
        if (range && !range.collapsed) {
            var _a = [range.startContainer, range.endContainer], startNode = _a[0], endNode = _a[1];
            if (startNode.nodeType == TEXT_NODE && endNode.nodeType == TEXT_NODE) {
                ranges.push([
                    [hashNode(startNode), startNode, range.startOffset],
                    [hashNode(endNode), endNode, range.endOffset],
                    [[], 0, 0],
                ]);
            }
        }
    }
    if (ranges.length == 0) {
        return '';
    }
    var walk = document.createTreeWalker(document.body, NODEFILTER_SHOW_TEXT);
    var node;
    while (node = walk.nextNode()) { // eslint-disable-line no-cond-assign
        var hash = hashNode(node);
        for (var _i = 0, ranges_1 = ranges; _i < ranges_1.length; _i++) {
            var _b = ranges_1[_i], _c = _b[0], startHash = _c[0], startNode = _c[1], _d = _b[1], endHash = _d[0], endNode = _d[1], dupes = _b[2];
            if (startNode == node) {
                dupes[1] = dupes[0].length;
            }
            if (endNode == node) {
                dupes[2] = dupes[0].length;
            }
            if (startHash == hash) {
                dupes[0].push(true);
            }
            else if (endHash == hash) {
                dupes[0].push(false);
            }
        }
    }
    var fragmentParts = ranges.map(function (_a) {
        var _b = _a[0], startHash = _b[0], startOffset = _b[2], _c = _a[1], endHash = _c[0], endOffset = _c[2], _d = _a[2], dupes = _d[0], startDupeOffset = _d[1], endDupeOffset = _d[2];
        var fragmentPart;
        if (startHash == endHash) {
            fragmentPart = "".concat(startHash, ":").concat(startOffset, ":").concat(endOffset);
        }
        else {
            fragmentPart = "".concat(startHash, ":").concat(startOffset, ".").concat(endHash, ":").concat(endOffset);
        }
        if (new Set(dupes).size != dupes.length) {
            var dupesString = dupes.map(function (x) { return x ? 's' : 'e'; }).join('');
            fragmentPart += "~".concat(dupesString, "~").concat(startDupeOffset, "~").concat(endDupeOffset);
        }
        return fragmentPart;
    });
    return "#1".concat(fragmentParts.join());
}
exports.selectionToFragment = selectionToFragment;
function getRangeFromFragmentPart(fragmentPart) {
    var _a, _b, _c, _d;
    var _e = fragmentPart.split('~'), hashOffsetFragmentPart = _e[0], dupeString = _e[1], dupeStartOffset = _e[2], dupeEndOffset = _e[3];
    var split = hashOffsetFragmentPart.split('.').map(function (x) { return x.split(':'); });
    var startHash, startOffset, endHash, endOffset;
    if (split.length == 1) {
        _a = split[0], startHash = _a[0], startOffset = _a[1], endOffset = _a[2];
        endHash = startHash;
    }
    else {
        _b = split[0], startHash = _b[0], startOffset = _b[1], _c = split[1], endHash = _c[0], endOffset = _c[1];
    }
    _d = [startOffset, endOffset].map(parseFloat), startOffset = _d[0], endOffset = _d[1];
    // the boolean represents whether it's a start node (true) or end node (false)
    var nodes = [];
    var walk = document.createTreeWalker(document.body, NODEFILTER_SHOW_TEXT, null);
    var node, numEndNodes = 0;
    while (node = walk.nextNode()) { // eslint-disable-line no-cond-assign
        var hash = hashNode(node);
        if (hash == startHash) {
            nodes.push([node, true]);
        }
        else if (hash == endHash) {
            nodes.push([node, false]);
            numEndNodes++;
        }
    }
    var startNode, endNode;
    if (dupeString && nodes.map(function (n) { return n[1] ? 's' : 'e'; }).join('') == dupeString) {
        startNode = nodes[parseInt(dupeStartOffset)];
        endNode = nodes[parseInt(dupeEndOffset)];
    }
    if (!startNode || !endNode) {
        if (startHash == endHash) {
            startNode = nodes[0];
            endNode = startNode;
        }
        else {
            // If there's more than one end node, start with the start node.  This
            // ensures that in cases where both nodes are ambiguous, the first pair is
            // selected.
            var anchorNodeType_1 = numEndNodes > 1;
            var anchorNodeIndex = nodes.findIndex(function (e) { return e[1] == anchorNodeType_1; });
            startNode = nodes[anchorNodeType_1 ? anchorNodeIndex : anchorNodeIndex - 1];
            endNode = nodes[anchorNodeType_1 ? anchorNodeIndex + 1 : anchorNodeIndex];
        }
    }
    var range = new Range();
    if (startNode && endNode) {
        range.setStart(startNode[0], startOffset);
        range.setEnd(endNode[0], endOffset);
    }
    return range;
}
function fragmentToRangeList(fragment) {
    return fragment.replace(/^1\.?/gm, '').split(',').map(getRangeFromFragmentPart);
}
exports.fragmentToRangeList = fragmentToRangeList;
