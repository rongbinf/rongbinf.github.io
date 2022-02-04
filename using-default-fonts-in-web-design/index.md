# 在 Web 设计中使用系统 UI 默认字体

内容高于设计，但也源自设计。现如今我们可以发现一种趋势：Web 设计逐渐靠近底层加载平台，从而做到更佳协调和统一地给用户呈现内容。非常重要的一点是在提供文字内容时，采用和底层平台相同的字体。在各种网页排版所用的字体中，使用默认 UI 字体是一种保险而不保守的做法。而且这意味着无需再使用如 Google Web fonts 一类的在线字体服务（web-font delivery service）或使用事先存在服务器上的字体文件。

使用默认 UI 字体可以通过两种方式实现：

## 非常用方法
```css
.caption {
    font: caption;
}
```
不是很常见，即使 [CSS 文档](https://developer.mozilla.org/en-US/docs/Web/CSS/font)里面有。意思就是使用底层平台，也就是所用操作系统中对应控件的字体、字体大小、风格粗细等等，达到完全一致。

使用这种方法会导致几个常见问题：

*   在 iOS 设备和众多 Android 浏览器上无法返回正确的字体。
*   截止至 2015 年 12 月，仍无法在 Mac OS X 上的 Firefox 上支持 “smart” properties of San Francisco。（指能在 San Francisco Text 和 San Francisco Display 中根据实际情况（大于 20px）切换，并更改字间距。）
*   完全和系统相关控件一致，无法再自定义变更字体大小、粗细等。

## 常用方法
```css
html[lang^="en-"] body {
    font-family:
    /* 1 */ -apple-system, BlinkMacSystemFont,
    /* 2 */ "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
    /* 3 */ "Helvetica Neue", sans-serif;
}
```
以上提供的代码仅适用于内容语言为英文。使用这种方法同样会造成一些问题：

*   即使这几年不会有多大改变，但每次厂商换字体时都要重新修一遍。
*   仅列出适用于大多数用户的字体。
*   若用户所用系统有比默认 UI 字体排序更前的字体（例如一个 Android 开发者在 Windows 上安装了 Roboto），则声明的是排序更前的字体（显示 Segoe UI 而并非 Roboto）。
*   命名冲突（例如 Oxygen）

### 细节

#### /* 1 */ macOS

* -apple-system 在最新版本的 macOS 上使用 San Francisco，旧版本则使用 Helvetica Neue 或 Lucida Grande。支持 “smart” properties of San Francisco。
* BlinkMacSystemFont 用于 macOS 上的 Chrome。
（San Francisco 在 macOS 上 Firefox 浏览器中的字间距比 Safari 和 Chrome 都更小。）

#### /* 2 */ 其他系统

* Segoe UI 面向 Windows 及 Windows Phone/Windows 10 Mobile。
* Roboto 面向 Android 和较新版本的 Chrome OS。
* Oxygen 面向 KDE。
* Ubuntu 还需要说吗...
* Cantarell 面向 GNOME。
* Fira Sans 面向 Firefox OS。
* Droid Sans 面向较旧版本的 Android。

#### /* 3 */ 备用字体

* Helvetica Neue 因为这很经典（雾）。
* sans-serif 因为这很默认（大雾）。

### 包括中文字体的解决方法
```css
html[lang^="zh-"] body {
    font-family: system, -apple-system, BlinkMacSystemFont,"PingFang SC", 
"Segoe UI", "Microsoft YaHei UI", 
"Source Han Sans", "wenquanyi micro hei", 
"Hiragino Sans GB", "Hiragino Sans GB W3", 
"Roboto", "Oxygen", "Ubuntu", 
"Cantarell", "Fira Sans", "Droid Sans", 
"Helvetica Neue", Helvetica, Arial, sans-serif;
}
```
#### 细节

* PingFang SC 即「苹方」，面向最新 macOS。
* Microsoft YaHei UI 即「微软雅黑」，面向较新版本 Windows。
* Source Han Sans 即「思源黑体」，面向较新版本 Android 和 Chrome OS。
* wenquanyi micro hei 即「文泉驛微米黑」，面向较旧版本 Android 和多数 Linux。
* Hiragino Sans GB (W3) 即「冬青黑体」，能够给网页浏览带来较好体验。


## 关于「苹方」

「苹方」有不同的字重可供选择，可以直接使用。（没有 Bold 我很服气）
```css
.some-element {
    font-family: "PingFang SC ExtraLight"; /* 或者 "PingFang SC Thin" */
    font-family: "PingFang SC Light";
    font-family: "PingFang SC"; /* 或者 "PingFang SC Regular" */
    font-family: "PingFang SC Medium";
    font-family: "PingFang SC Semibold";
    font-family: "PingFang SC Heavy";
}
```
或者预先定义好，使用 `"PingFang-SC"` 引用，浏览器根据 `font-weight` 去选择不同的变体。
```css
@font-face {
    font-family: "PingFang-SC";
    font-weight: 100;
    src: local("PingFang SC Thin");
}

@font-face {
    font-family: "PingFang-SC";
    font-weight: 300;
    src: local("PingFang SC Light");
}

@font-face {
    font-family: "PingFang-SC";
    font-weight: 400;
    src: local("PingFang SC Regular");
}

@font-face {
    font-family: "PingFang-SC";
    font-weight: 500;
    src: local("PingFang SC Medium");
}

@font-face {
    font-family: "PingFang-SC";
    font-weight: 700;
    src: local("PingFang SC Semibold");
}

@font-face {
    font-family: "PingFang-SC";
    font-weight: 800;
    src: local("PingFang SC Heavy");
}

body {
    font-family: "PingFang-SC", sans-serif;
}
```
## 参考文章

1.  <cite lang="en">[Using System UI Fonts In Web Design: A Quick Practical Guide](https://www.smashingmagazine.com/2015/11/using-system-ui-fonts-practical-guide/)</cite>, Marcin Wichary, 2015
2.  [在 Web 内容中使用系统字体](https://csspod.com/using-the-system-font-in-web-content/)，minwe，2016
