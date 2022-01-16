"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var v2 = require("./versions/2.js");
function selectRanges(ranges) {
    var _a;
    var selection = document.getSelection();
    selection.removeAllRanges();
    for (var _i = 0, ranges_1 = ranges; _i < ranges_1.length; _i++) {
        var range = ranges_1[_i];
        selection.addRange(range);
    }
    (_a = ranges[0].startContainer.parentElement) === null || _a === void 0 ? void 0 : _a.scrollIntoView();
    if (selection.rangeCount != ranges.length) {
        void Promise.resolve().then(function () { return require('./e'); }).then(function (error) { return error.m(ranges); });
    }
}
void (function () { return __awaiter(void 0, void 0, void 0, function () {
    var fragment, v1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                fragment = location.hash.slice(1);
                if (!(fragment && !document.getElementById(fragment))) return [3 /*break*/, 3];
                if (!(fragment[0] == '1')) return [3 /*break*/, 2];
                return [4 /*yield*/, Promise.resolve().then(function () { return require('./versions/1.js'); })];
            case 1:
                v1 = _a.sent();
                selectRanges(v1.fragmentToRangeList(fragment));
                return [3 /*break*/, 3];
            case 2:
                if (fragment[0] == '2') {
                    selectRanges(v2.fragmentToRangeList(fragment));
                }
                _a.label = 3;
            case 3:
                // This is in a setTimeout to ensure that the code above does all of its
                // selection-changing before this executes. This ensures that we don't
                // clobber changes that we just made (for instance, in the case of a user
                // on Chrome attempting to open a multiselect url).
                //
                // This also allows us to make more careful decisions about rewriting urls
                // in general — we can explicitly decide when and how to do version bumps,
                // for instance.
                setTimeout(function () {
                    document.addEventListener('selectionchange', function () {
                        var fragment = v2.selectionToFragment(document.getSelection());
                        // replaceState is used instead of setting location.hash to avoid scrolling.
                        history.replaceState(null, '', location.pathname + fragment);
                    });
                }, 0);
                return [2 /*return*/];
        }
    });
}); })();
