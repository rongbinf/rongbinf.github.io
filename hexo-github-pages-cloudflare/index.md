# Hexo + GitHub Pages + Cloudflare


# 系统环境配置
## 安装 Node.js
Node.js 是一种 JavaScript 的运行环境，[点击此处](https://nodejs.org/download/)以下载。

如何安装 Node.js 详见[此文章](https://www.runoob.com/nodejs/nodejs-install-setup.html/)。注意：Linux 上安装 Node.js 需要安装 Python 2.6 或 2.7 ，不建议安装 Python 3.0 以上版本。

## 安装 Git
Git 是一个开源的分布式版本控制系统，帮助你合并多次改动并记录下来。[点击此处](http://git-scm.com/downloads/)以下载。

如何安装 Git 详见[此文章](https://www.runoob.com/git/git-install-setup.html/)。

# 安装 Hexo
Hexo 是一个使用 Markdown 引擎解析文章的快速、简洁且高效的博客框架。当你已经安装好 Node.js 和 Git 后，直接使用 npm 安装 Hexo。
```shell
    $ cd <folder> # 将 <folder> 改为你希望安装 Hexo 的路径
    $ npm install hexo-cli -g # 使用 npm 安装
    $ hexo init <folder> # 将 <folder> 改为你希望搭建博客的路径
    $ cd <folder>
    $ hexo generate # 或 hexo g
    $ hexo server # 或 hexo s
```
此时你可以访问 http://localhost:4000/ 查看预览。
```shell
    $ hexo -v # 查看本地环境版本号。
```
目前我安装所用的本地环境如下：
```shell
    hexo: 3.5.0
    hexo-cli: 1.0.4
    os: Darwin 17.4.0 darwin x64
    http_parser: 2.7.0
    node: 8.9.4
    v8: 6.1.534.50
    uv: 1.15.0
    zlib: 1.2.11
    ares: 1.10.1-DEV
    modules: 57
    nghttp2: 1.25.0
    openssl: 1.0.2n
    icu: 59.1
    unicode: 9.0
    cldr: 31.0.1
    tz: 2017b
```
## Hexo 的基本命令
```shell
    $ hexo init <folder>
```
新建一个博客。将 <folder> 改为你希望搭建博客的路径。
```shell
    $ hexo new [layout] <title>
```
新建一篇 title.md 文章。如果没有设置 layout，将使用默认的 layout。可能的参数有：post, page。如果标题包含空格，请使用引号括起来。
```shell
    $ hexo generate
    # 或简写为
    $ hexo g
```
生成静态文件，此时你可以在目录中看到一个叫 public 的文件夹。可选的选项有：-d(--deploy)表示文件生成后立刻部署网站， -w(--watch)表示监视文件变动。
```shell
    $ hexo server
    # 或简写为
    $ hexo s
```
启动服务器。默认情况下访问地址为：http://localhost:4000/ 。可选的选项有 -p(--port)重设端口，-s(--static)只使用静态文件，-l(--log)启动日记记录，使用覆盖记录格式。
```shell
    $ hexo deploy
    # 或简写为
    $ hexo d
```
部署网站到远端。可选的选项有：-g(--generate)部署之前先生成静态文件。

## Hexo 的文件结构
博客新建完成后，指定文件夹的目录如下：
```shell
    .
    ├── _config.yml # 网站的配置信息。
    ├── package.json # 应用程序的信息。
    ├── scaffolds # 固定模板。
    ├── source # 资源文件夹。
    |    ├── _drafts
    |    └── _posts # 将文章存放于此。
    └── themes # 主题文件夹。
```
## 安装和设置 Hexo 主题。
此处以本博客使用的 typing 为例。
```shell
    $ hexo clean # 清除缓存文件（db.json）和已经生成的静态文件（/public）。
```
### 安装主题
```shell
    $ cd <folder> # 将 <folder> 改为你安装博客的路径
    $ git clone https://github.com/geekplux/hexo-theme-typing themes/typing 
```
### 设置、更新主题
```shell
    theme: typing
```
修改 Hexo 目录下 _config.yml 配置文件中的 theme 属性，将其设置为 typing 以启用主题。
```shell
    $ cd themes/typing
    $ git pull
    $ hexo g
    $ hexo s
```
此时访问 http://localhost:4000/ 可以预览你更换的主题。

## 配置博客
使用文本编辑工具打开 _config.xml，按需求修改文件内容。
```shell
    # Site
        title: Undercurrent # 博客名称，网站标题
        subtitle: Another blog. # 副标题
        description: # 网站描述
        author: Fan Rongbin # 作者姓名
        language: zh-CN # 网站语言
        timezone: Asia/Shanghai # 网站所用时区

    # URL
    ## If your site is put in a subdirectory, set url as 'http://yoursite.com/child' and root as '/child/'
		url: https://fanrongbin.com/ # 网站网址
        root: /
        permalink: :year/:month/:day/:title/
        permalink_defaults:
```
注意：如果使用独立域名，请记得修改 url 的值为独立域名的网址。

# 配置 GitHub Pages
GitHub Pages 是一个免费的静态网站托管平台，既可以用于展示你在 GitHub 上的项目，也可以用来做个人博客。（国内有类似的服务 Coding Pages）

每个帐号只能有一个用于存放个人主页的仓库，命名必须为 username/username.github.io，创建后的主页将通过 http://username.github.io/ 来访问。

## 连接 GitHub
### 创建 SSH Key
检查电脑上现有的 SSH key。
```shell
    $ cd ~/.ssh
```
如果已经存在 key 文件，备份旧的文件并删除它。
```shell
    $ ls config id_rsa id_rsa.pub  known_hosts
    $ mkdir key_backup
    $ cp id_rsa* key_backup
    $ rm id_rsa*
```
生成新的 SSH Key
```shell
    $ ssh-keygen -t -rsa -C “youremail@youremail.com” # 将引号内内容改为你的电子邮件。
    Generating public/private rsa key pair.
    Enter file in which to save the key (/Users/your_user_directory/.ssh/id_rsa): # 如果你需要将 key 文件放在不同路径请键入，无特殊情况请直接回车。
    Enter passphrase (empty for no passphrase): # 输入加密串。
    Enter same passphrase agian: # 再次输入。
```
最后可以看到
```shell
    Your identification has been saved in
    /Users/your_user_directory/.ssh/id_rsa.
    Your public key has been saved in
    /Users/your_user_directory/.ssh/id_rsa.pub.
    The key fingerprint is:
    The key’s randomart image is:
```
表示成功设置 SSH Key。

### 添加 SSH Key 到 GitHub
用文本编辑工具打开 id_rsa.pub 文件，如果找不到该文件，注意本机是否已经设置显示隐藏文件。复制这个文件中所有的文本内容。

打开 GitHub 主页，点击头像，点击 Settings 进入设置。选择左侧的 SSH and GPG keys，点击 New SSH key。将复制的内容粘贴在 Key 一栏中，设置一个 Title（可以为本机名称）后点击 Add SSH key 即成功添加。

如果需要配置多个 GitHub 帐号，请参考此文章：[多个 github 帐号的 SSH key 切换](https://www.cnblogs.com/mackxu/p/ssh-keygen.html/)。

测试设置是否成功：
```shell
    $ ssh -T git@github.com
```
如果出现：
```shell
    The authenticity of host 'github.com (207.97.227.239)' can't be established.
    RSA key fingerprint is …
    Are you sure you want to continue connecting (yes/no)?
```
此时输入 yes 即可：
```shell
    Hi <username>! You've successfully authenticated, but GitHub does not provide shell access.
```
### 在 Git 中配置帐号
```shell
    $ git config --global user.name "你的名字"
    $ git config --global user.email "your_email@youremail.com"
```
注意：使用的名字不是你在 GitHub 中的昵称。

## 创建 GitHub Pages
点击右上角的加号选择 New repository，进入页面填写 Repository name 为 username.github.io，注意不要填写错误。选择 Public，点击 Create repository 即完成创建。

![](https://img.fanrongbin.com/h-1.webp)

# 部署 Hexo 到 GitHub Pages
## 使用 hexo deploy
安装拓展：
```shell
    $ npm install hexo-deployer-git --save
```
将配置文件修改为如下形式：
```shell
    deploy:
        type: git
        repo: git@github.com:username/username.github.io.git
        branch: master
```
然后在命令行中执行
```shell
    $ hexo d
```
完成部署。
## 使用 git
将之前创建的 repository 克隆到本地并新建用于存放克隆的文件夹 .deploy：
```shell
    $ cd <folder> # 博客所在路径
    $ git clone https://github.com/username/username.github.io .deploy/username.github.io
```
创建 deploy 脚本文件：
```shell
    hexo g # 生成新的静态文件
    cp -R public/* .deploy/username.github.io # 将新文件拷贝到 git 目录下
    cd .deploy/username.github.io
    git add .
    git commit -m “update”
    git push origin master # 提交代码到主分支
```
在以后需要部署时只需执行这段脚本（可以将脚本保存为 deploy.sh）。执行过程中可能需要输入 GitHub 帐号密码，按提示一步一步来即可。

# 绑定独立域名
首先你需要有一个独立域名，可以通过 [Godaddy](https://godaddy.com/) 或[阿里云-万网](https://www.net.cn/)来购买。这里以万网为例。

![](https://img.fanrongbin.com.github.io/blog-img/h-2.webp)

进入 repository 的 Settings，向下滚动找到 Custom domain，输入你的域名，点击 Save 保存。

登录阿里云，进入控制台，依次点击域名与网站（万网）→域名，找到你的域名，点击右侧的「解析」。添加一条 CNAME 指向 username.github.io。如果想要设置 apex domain（即无 www 前缀的网址）请添加两条 A 记录：

    将主机记录设置为 @
    将记录值分别设置为：
    192.30.252.153
    192.30.252.154

![](https://img.fanrongbin.com/h-3.webp)

等候约三到五分钟即可应用本次更改。

# 使用 Github 与 Let’s Encrypt 提供的 SSL 服务
虽然 Github 早在 2016 年为 GitHub Pages 添加了 HTTPS 支持，但自定义域名开启 HTTPS 却是一件令人头疼的事情。 直接用 https 链接访问自定义域名会出现证书错误（这是因为 Github 提供的 SSL 证书指向的域名是 *.github.com 和 *.github.io，而不是我们绑定的域名），只能使用 Cloudflare 之类的支持 Universal SSL 的 CDN 曲线支持 HTTPS 。

如果你之前使用了 Cloudflare 提供的 SSL 服务，请登录 Cloudflare 用户中心暂停或停止服务。

![](https://img.fanrongbin.com/h-4.webp)

如果未使用其他 CDN，请回到域名注册商域名解析设置处，将原有 A 记录及 www 前缀的 CNAME 记录中的 IP 地址修改为：
```
		A 185.199.108.153
		A 185.199.109.153
		A 185.199.110.153
		A 185.199.111.153
		CNAME www 185.199.108.153
		CNAME www 185.199.109.153
		CNAME www 185.199.110.153
		CNAME www 185.199.111.153
```
请进入 *.github.io repository 的 Settings 中，清空原有自定域名点击 Save，待页面刷新后再次输入自定域名保存。待解析成功即自动带上 https 啦。

![](https://img.fanrongbin.com/h-5.webp)


# 使用 Cloudflare 提供的 SSL 服务
由于 GitHub Pages 本身不支持上传 SSL 证书（截至 2018.2），我们可以使用 Cloudflare 提供的免费 CDN，利用反向代理实现全站 https。

注册并登录 Cloudflare，点击 Add Site 以添加自己的网站。输入网址后点击 Begin Scan 便会开始扫描网站的解析记录。点击 Continue Setup 以继续。

![](https://img.fanrongbin.com/h-6.webp)

Cloudflare 会默认把需要使用 CDN 服务的记录勾选，确认 A 记录和 CNAME 记录右侧的云朵图案均点亮为橙色后点击 Continue 继续下一步操作。

![](https://img.fanrongbin.com/h-7.webp)

选择 Free Plan。

![](https://img.fanrongbin.com/h-8.webp)

回到阿里云-万网，进入控制台，依次点击域名与网站（万网）→域名，点击域名右侧的「管理」进入域名控制台。点击右侧的「DNS 修改」，将默认 DNS 替换为：

```
	arnold.ns.cloudflare.com
	ruth.ns.cloudflare.com
```

![](https://img.fanrongbin.com/h-9.webp)

等候约三到五分钟即可应用本次更改，你可以在 Cloudflare 查看应用情况。

# 参考文章
- [使用 Github Pages 建独立博客](http://beiyuu.com/github-pages/)
- [手把手教你使用 Hexo + Github Pages 搭建个人独立博客](http://jiji262.github.io/2016/04/15/2016-04-15-hexo-github-pages-blog/)
- [Github Pages 开始为自定义域名提供 HTTPS 支持（附启用方法）](https://poplite.xyz/post/2018/05/03/how-to-enable-https-for-custom-domain-on-github-pages.html)
