# 树莓派实现开机自动播放 RTSP 流视频

家里电视柜空间有限。为了能够显示监控实时画面，电工直接把海康威视巨大的 NVR 装在柜内，通过巨大的 VGA 线外接巨大的显示器。为了将这些巨大的设备移到机柜去，考虑使用树莓派直接播放摄像头提供的 RTSP 流。

## 获取摄像头 RTSP 流

- 对于海康威视和萤石摄像头，其 RTSP 流地址格式如下：

```
rtsp://[username]:[password]@[ip]:[port]/[codec]/[channel]/[subtype]/av_stream
```

具体参数（如视频编码）自行调整。

- 对于 TP-LINK 摄像头，其 RTSP 流地址格式如下：

主码流为：`rtsp://[username]:[password]@[ip]:[port]/stream1`

子码流将 `stream1` 替换为 `stream2` 即可。

RTSP 端口 `port` 默认为 `554`，若为默认可不填写。

## 使用 VLC 播放

有两种方法：

### 1. 使用命令

- Run on the server:

```shell
vlc -vvv input_stream --sout '#rtp{dst=192.168.0.12,port=1234,sdp=rtsp://server.example.org:8080/test.sdp}'
```

- Run on the client(s):

```shell
vlc rtsp://server.example.org:8080/test.sdp
```

### 2. 创建 playlist 文件

新建一个播放列表，或直接使用播放 URL 打开 RTSP 流视频，确认能够正常播放。

将播放列表另存为文件。这里建议另存为 `.m3u` 格式，因为打开 `.xspf` 格式文件会弹窗提示你选择 execute 或 open。 

运行该 playlist 文件即可播放。

## 使用其他方式播放

你也可以使用 omxplayer 或 mplayer 进行播放。

## 实现开机自启动

在 Linux 上有多种实现开机自启动的方法。我尝试向 `rc.local` 添加启动代码但未起作用。目前使用通过桌面启动的方法。

在 `/home/pi/.config/` 下创建名为 `autostart` 的新文件夹。

```shell
cd /home/pi/.config
mkdir autostart
```

在 `autostart` 目录下创建一个后缀为 `.desktop` 的文件。文件名任意。

```shell
cd autostart
nano test.desktop
```

更改文件内容：

1. 若采用命令打开：

```
[Desktop Entry]
Type=Application
Exec=vlc rtsp://server.example.org:8080/test.sdp
```

2. 若采用 playlist 文件，则更改为文件路径：

```
[Desktop Entry]
Type=Application
Exec=vlc /home/pi/test.m3u
```

运行 `sudo reboot` 重启测试。

3. 也可以在一个新的 shell 脚本中添加 vlc 命令，将 `Exec=` 后内容直接修改为 .sh 文件路径。如：

```
[Desktop Entry]
Type=Application
Exec=/home/pi/test.sh
```

## 使 VLC 默认全屏打开

### 1. 修改命令

在 RTSP 流地址或 playlist 路径前添加选项 `-f` 或 `--fullscreen`，如：

```shell
vlc -f /home/pi/test.m3u
```

其他支持的选项：

```
# 全屏幕视频输出 (默认关闭)
-f, --fullscreen, --no-fullscreen 
# 总在最前 (默认关闭) 
--video-on-top, --no-video-on-top 
# 开启壁纸模式 (默认关闭)
--video-wallpaper, --no-video-wallpaper 
# 在视频上显示媒体标题 (默认开启)
--video-title-show, --no-video-title-show 
# 显示视频标题 x 毫秒
--video-title-timeout <整数 [-2147483648 .. 2147483647]> 
# 视频标题的位置
--video-title-position {0 (居中), 1 (左), 2 (右), 4 (上), 8 (下), 5 (左上), 6 (右上), 9 (左下), 10 (右下)}
# 在 x 毫秒后隐藏光标和全屏控制器
--mouse-hide-timeout <整数 [-2147483648 .. 2147483647]>
```

更多详见 [VLC 帮助文档](https://wiki.videolan.org/Documentation:Documentation/)。

### 2. 在 GUI 修改 Preference

在 VLC Menu Bar >> Tools >> Preferences，进入 Video 栏，勾选 Fullscreen 即可。

## 使命令在后台加载

在直接执行 `vlc rtsp://...` 命令时，遇到 Timestamp conversion failed。转而使用：

```shell
xdg-open /home/pi/test.m3u
```

直接打开播放列表文件。

或者改用 mplayer，在 `mplayer rtsp://...` 后加入 `< /dev/null &` 或完整的 `< /dev/null > /dev/null 2>1 &`。

## 设置显示器常亮

进入 `/etc/lightdm` 目录修改 `lightdm.conf` 文件：

```shell
sudo vi /etc/lightdm/lightdm.conf
```

找到 `[Seat:*]` 或 `[SeatDefaults]` 段下的 `xserver-command`，默认为 `-#xserver-command=X`，修改为：

```shell
xserver-command=X -s 0 -dpms
```

## 使用 unclutter 设置鼠标指针自动隐藏

```shell
sudo apt-get install unclutter
echo “@unclutter -idle 1 -root” >> /etc/xdg/lxsession/LXDE/autostart
```

## 使用 [xdotool](www.semicomplete.com/projects/xdotool/) 改变窗口大小和位置

首先安装 xdotool：

```shell
sudo apt-get install xdotool
```

同时实现改变窗口大小和位置，如：

```shell
xdotool search --name "VLC" windowsize 800 600 windowmove 0 0
```

解释：

- `search --name [keyword]` ：将搜索名称中带有关键词的窗口
- `windowsize 800 600`：改变窗口大小，`$WIDTH $HEIGHT`
- `windowmove 0 0`：改变窗口位置，`$X $Y`，具体视屏幕分辨率而定
