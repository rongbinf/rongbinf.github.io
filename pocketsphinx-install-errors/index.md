# 在 Big Sur 安装 PocketSphinx 时出现的问题


## 确认安装了`swig`

首先确认是否安装了`swig`，否则运行`setup.py`报错：

```
error: command 'swig' failed: No such file or directory
```

## 修改 OpenAL 的位置

似乎对于 Catalina 以及后续版本，都需要在`setup.py`中修改`OpenAL`的位置：

修改第 235 行：`sb_include_dirs.append('/System/Library/Frameworks/OpenAL.framework/Versions/A/Headers')`为：

```
sb_include_dirs.append('/Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX.sdk/System/Library/Frameworks/OpenAL.framework/Versions/A/Headers')
```

修改第 242 行：`extra_objects=['/System/Library/Frameworks/OpenAL.framework/Versions/A/OpenAL'],`为：

```
extra_objects=['/Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX.sdk/System/Library/Frameworks/OpenAL.framework/Versions/A/OpenAL.tbd'],
```

## 修改调用头文件的名字

对于报错：

```
fatal error: 'al.h' file not found
      #include <al.h>
               ^~~~~~
      1 error generated.
error: command '/usr/bin/gcc' failed with exit code 1
```

需要对`/pocketsphinx-python/deps/sphinxbase/src/libsphinxad/ad_openal.c`中的

```
#include <al.h>
#include <alc.h>
```

修改为：

```
#include <OpenAL/al.h>
#include <OpenAL/alc.h>
```

## 参考

- [Trouble installing on osx "fatal error: 'al.h' file not found" #28](https://github.com/bambocher/pocketsphinx-python/issues/28)
- [Trouble installing on Mac OS Big Sur 11.0.1 "fatal error: 'al.h' file not found" #67](https://github.com/bambocher/pocketsphinx-python/issues/67)

