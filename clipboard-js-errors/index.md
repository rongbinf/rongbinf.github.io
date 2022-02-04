# 在使用 Clipboard.js 中学一点 JavaScript


在更新个人页面时，为方便快速复制邮箱地址，使用 Clipboard.js 一插件。之前未接触过 JavaScript，所以从零开始。
我的组合是：Bootstrap（CSS 框架）+ Clipboard.js

## 第一次报错：Uncaught TypeError: Illegal constructor
```
new Clipboard('.btn');
```
一开始初始化调用 Clipboard.js 就出错？回到官方文档中比对：
```
new ClipboardJS('.btn');
```
问题解决。一开始所参照的中文教程比较久远，语句更新为 `ClipboardJS`。

## 第二次报错：Uncaught TypeError: Cannot read property ‘addEventListener’ of null
```
var clipboard = new ClipboardJS('.btn');
```
该语句是为了使用 DOM 选择器。

### 为什么在这里要使用 DOM 选择器(DOM SELECTOR)
为了在页面上快速找到引号内（在此为`.btn`）元素，然后进行下一步。报错原因：调用 JavaScript 时，DOM 选择器还没有渲染完。反映为在使用 DOM 选择器时，没找到或没找完该元素。在我的页面中，因为一开始把`<script></script>`都放在`<head>`标签之内，所以在`<body>`没渲染之前就加载了 DOM 选择器，当然什么都找不到了。

问题解决：把该段 JS 放到到本来调用 Clipboard.js 那一段之后。

## 第三次报错：.tooltip() is not a function
在正常调用 Clipboard.js 后，希望在点击复制后弹出复制成功或失败的提示语，而且 Bootstrap 集成了类似的 Tooltip.js 插件。在官方文档中找到相关代码：
```javascript
var clipboard = new ClipboardJS('.btn');
 
clipboard.on('success', function(e) {
    console.info('Action:', e.action);
    console.info('Text:', e.text);
    console.info('Trigger:', e.trigger);
 
    e.clearSelection();
});
 
clipboard.on('error', function(e) {
    console.error('Action:', e.action);
    console.error('Trigger:', e.trigger);
});
```
为了监听是否触发自定义事件，也就是获得用户是否成功复制内容的反馈，加载了这一段代码进行监听。如果成功，则回复 success，失败回复 error。结合 Tooltip.js 的教程，可以直接改为：
```javascript
// Tooltip
 
$('button').tooltip({
  trigger: 'click',
  placement: 'bottom'
});
 
function setTooltip(message) {
  $('button').tooltip('hide')
    .attr('data-original-title', message)
    .tooltip('show');
}
 
function hideTooltip() {
  setTimeout(function() {
    $('button').tooltip('hide');
  }, 1000);
}
 
// Clipboard
 
var clipboard = new Clipboard('button');
 
clipboard.on('success', function(e) {
  setTooltip('Copied!');
  hideTooltip();
});
 
clipboard.on('error', function(e) {
  setTooltip('Failed!');
  hideTooltip();
});
```
在对应的按钮加入标签即可。但报错找不到 tooltip 的函数。应该还是加载问题。
问题解决：Tooltip.js 依赖 jQuery，需要先调用 jQuery 再调用 tooltip.js（也就是 bootstrap.min.js），在`<head>`内将调用 jquery.js 一行置于 bootstrap.min.js 之前。

## 到底学了什么？
1. 注意渲染顺序。
2. 注意版本更新。

## 参考

- [选择器 – 廖雪峰的官方网站](https://www.liaoxuefeng.com/wiki/1022910821149312/1023023555539648)
- [Stack Overflow 上关于 tooltip is not a function 的讨论](https://stackoverflow.com/questions/9394390/tooltip-is-not-a-function)
