# 芯片制作工序 & 半导体常见自动化软件模块梳理


[这篇图文](https://blog.robertelder.org/how-to-make-a-cpu/)能更好帮助理解。

## 芯片制作工序
{{< mermaid >}}
flowchart TD
	subgraph 1.晶圆加工
	aa1["铸锭<br>分离提纯硅，熔化再凝固铸成硅锭（硅柱）"]-->aa2[锭切割<br>将硅锭切为薄片]-->aa3[裸片表面抛光<br>打磨上一步切成的薄片以绘制电路]
	end
	subgraph 2.氧化
	去除杂质-->bb2[高温形成氧化层]-->氧化层厚度测试
	end
	subgraph 3.光刻
	涂覆光刻胶-->cc2["曝光<br>光线穿过刻好电路图案的光罩（reticle）照射在光刻胶薄膜上"]-->cc3[显影<br>喷涂显影剂去除未覆盖区域的光刻胶<br>使电路图案显现]
	end
	subgraph 4.刻蚀
	dd1["去除多余的氧化膜，只留下电路图部分"]
	end
	subgraph 5.薄膜沉积
	ee1["通过 CVD/PVD 等技术形成多层半导体结构<br>将导体和绝缘体沉积到晶圆上"]
	end
	subgraph 6.互连
	用铝或铜等导电金属连接晶体管
	end
	subgraph 7.测试
		subgraph EDS
			EPM-->老化测试-->针测-->修补-->75[点墨<br>标记缺陷]
		end
	end
	subgraph 8.封装
		subgraph hh5[封装]
			subgraph 传统封装技术
				811["- DIP<br>- SOP<br>- TSOP<br>- QFP<br>..."]
			end
			subgraph 先进封装技术
				821["- 倒装（flip chip）<br>- 凸块（bumping）<br>- 晶圆级封装（WLP）<br>- 2.5D<br>- 3D<br>..."]
			end
		end
	hh1[晶圆锯切成 die]-->单个晶片附着至引线框架-->gg3[屏蔽焊接<br>连接晶片与基地的接触点实现电信号转换]-->模具塑封成型-->hh5
	end
	mm("（IC 设计）")-->1.晶圆加工-->2.氧化-->3.光刻-->4.刻蚀-->5.薄膜沉积-->6.互连-->7.测试-->8.封装
{{< /mermaid >}}

参考自泛林集团科普文章：[上篇](https://mp.weixin.qq.com/s?__biz=MzAwMjc5MzEyMA==&mid=2653071344&idx=1&sn=5afa34f0343fe651c352fb1db90e4078&chksm=81130c3fb66485295c95b0ebc4e5809c476ec251c6744f70ab90a44ca5a541c49441ccf3ba7b)、[中篇](https://mp.weixin.qq.com/s?src=11&timestamp=1643333829&ver=3585&signature=6IlC6FZHoNgcGlFXYQmK00U0kkordqNzxXlGsuIi0sDeMcxJTa97kEv4PTwKJHS8sKsbm7TCcVpKdw5j-GkNlI6B8zB3SOQudBhCx*Q*bikIKvrrxLbecGT*jbEQgSM1&new=1)、[下篇](https://mp.weixin.qq.com/s?src=11&timestamp=1643333829&ver=3585&signature=6IlC6FZHoNgcGlFXYQmK00U0kkordqNzxXlGsuIi0sBk7gTvrMy2efEIgPI-nvRVI4eGDu1UKmkBgwpES6RWt2*uv5-F6UX4qWh*0OTkISc77QkceIHU7l0o6yuay4gx&new=1)。英文对照请见[文末](#半导体制作工序英文不完全对照)。你也可以[按此访问](https://www.tel.com/museum/exhibition/process/)东京威力科创制作的工序介绍。

制作工序可分为前、后两道。前道包括 `1.晶圆加工` ->` 7.测试`，后道包括`8.封装`及后期测试、其他组装、成品入库等。

常用英文名词：

- wafer：晶圆，硅晶片。分有 6、8、12 吋。
- die：裸晶。wafer 上的小单位颗粒。合格的 die 在第八步封装时被切走为成品颗粒。
- cell：比 die 更小的单位，如 IO 单元、电源管理单元。
- cassette：晶盒。用来装 wafer。
  - FOUP（Front Opening Unified Pod）：前开晶片（统一）传送盒。一般用于厂内运输 wafer。
  - FOSB（Front Opening Shipping Box）：前开晶片运输盒。一般用于厂间成品或半成品运输。
- lot：批次。
- recipe：制程配方。
- equipment：机台，加工线上的所有设备。
- fab（Semiconductor Fabrication Plant）：半导体制造厂。
- WAT（Wafer Acceptance Test）：晶圆允收测试
- UAT（User Acceptance Test）：用户允收测试
- CP Yield（Circuit Probe Yield）：晶圆测试良率
- RFP/RP（Request for Proposal）：需求建议书

半导体行业有几种常见商业模式：

- Foundry：晶圆代工，负责晶圆制造、封装或测试中的一个或多个环节。如台积电。
- IDM：包括 IC 设计、晶圆制造、封装测试等多个环节。如三星。
- Fabless：只负责 IC 设计和销售，其他环节外包。如联发科。

## 半导体行业常用工业软件

对于半导体厂内*自动化系统*常用工业软件，一般可分为四个层级：

### 计划管理/决策层
- [ERP]^(企业资源计划)（Enterprise Resource Planning）
- [SCM]^(供应链管理)（Supply Chain Management）
- [PLM]^(产品生命周期管理)（Product Lifecycle Management）
- [WMS]^(仓储管理系统)（Warehouse Management System）
- [OA]^(办公自动化)、[CRM]^(消费者关系管理)、[APS]^(先进计划和排程)（Advanced Planning and Scheduling）等

### 计算机集成制造层
[CIM]^(计算机集成制造)（Computer Integrated Manufacturing）
- 制造管理和监测
- 制造执行
  - [MES]^(制造执行系统)（Manufacturing Execution System）
  - [RTD]^(实时派工系统)（Real-time Dispatch）
  - [SPC]^(统计制程控制)（Statistical Process Control）

### 一般控制层
- 自动化系统
  - [EAP]^(设备自动化程序)（Equipment Automatic Programme)
- [EES]^(设备工程系统)（Equipment Engineer System）
  - [APC]^(先进过程控制)（Advanced Process Control）
    - 一般会认定其包含 [R2R]^(批次控制)（Run-to-Run）、FDC、[OEE]^(整体设备效率)（Overall Equipment Efficiency），但包含关系和范围没有明显界定
  - [FDC]^(故障侦测与分类)（Fault Detection and Classification）
  - [PMS]^(预防保养系统)（Preventive Maintenance System）
  - [YMS]^(良率管理系统)（Yield Management System）
  - [TMS]^(运输管理系统)（Transportation Management System）
  - [RMS]^(Recipe/配方管理系统)（Recipe Management System）
  - 与 [AMHS]^(自动物料搬送系统/天车)（Automatic Material Handling System）的配合

### 现场设备层：机台
  - [PLC]^(可编程逻辑控制器)（Programmable Logic Controller）
  - 其他 censor 等

---

CIM 主体包括 **MES** 和 **EAP**。MES 负责车间生产管理和调度执行，实时监控生产过程并响应状态变化。EAP 对接 MES 和机台设备，负责信息传输、数据搜集、流程控制和异常捕捉。因而 APC、FDC、 PMS 等系统通常都围绕 EAP 运作。

EAP 与 MES 等其他系统间通讯采用 Tibco RV 协议、与机台设备间通讯采用 SECS/GEM 等等协议。

{{< mermaid >}}
classDiagram
	class 计划层{
		 ERP/SCM/PLM
		 OA/CRM/APS/...
	}
	class CIM{
		MES/RTD/SPC...
	}
	class 一般控制层{
		EAP
		EES/APC/FDC...
	}
	计划层 <--> CIM
	CIM <--> 一般控制层 : SECS/GEM
{{< /mermaid >}}

### 市场主要厂商

前道 CIM：

- IBM（SiView）
- 应用材料（Applied Materials）（FAB300）

MES：

- 西门子（Siemens）
- 霍尼韦尔（Honeywell Forge）
- 艾默生（Emerson）
- 罗克韦尔（Rockwell Automation）
- 达索（Dassault）
- ABB Ability

YMS 多独立厂家，如 Synopsys（Synopsys Odyssey）。

后道封装：

- 西门子（CAMSTAR、SIMATIC IT）

## MES：「车间的头子」

MES 上接计划层（如 ERP），下接一般控制层（如 EAP 或 [SCADA]^(监控与资料收集系统)），主要面向在现场一线操作的车间管理人员。实际上是多个模块集中呈现的平台，针对整个工厂，对稳定性要求较高。实际解决方案包括：

- 计划排程管理
- [PRP]^(生产工艺流程)（Process Plan）：对生产的流程进行四层抽象（从单个 [operation]^(操作) 到连接成 [stage]^(步骤)，再连接为一个大的 [layer]^(层)，最后成为一条完整的 [route]^(路径)）
- [WIP]^(制品管理模块)（Wafer in Process）：创建批次、查询批次、报废批次等批次相关的处理
- 设备管理
- 数据管理
- 报表管理
- [GUI]^(图形界面设计)：包括面向生产线操作员和面向工艺工程师等不同界面

## EAP：搜集信息、传达指令

EAP 上接 MES，下接机台设备。MES 所管理的各项数据都来自 EAP。EAP 先搜集所有生产数据和机台状态数据，再经由特定通讯协议传送到 MES 数据库，MES 再借由数据分析监控设备和生产流程。其同时也是整个 CIM 中其他模块的数据源。

例如生产状态的变化：由 EAP **告知** MES 一批货物状态的变化，MES **改变**这批货物的状态。

{{< mermaid >}}
stateDiagram
	s1: 计划(planned)
	s2: 激活(activated)
	s3: 等待处理(waiting)
	s4: 结束(completed)
	s5: 派工(dispatch)
	s6: 正在加工(processing)
	s7: 加工完成(finish)
	[*]-->s1
	s1-->s2:分配输送盒
	s2-->s3
	s3-->s2:解除等待
	s2-->s5
	s5-->s2:解除派工
	s5-->s6:移入加工
	s6-->s5:取消移入
	s6-->s7
	s7-->s3
	s3-->s7
	s7-->s4
	s2-->s4
	s3-->s5
{{< /mermaid >}}

对比单纯进行数据采集和一定图形界面化呈现的 SCADA，EAP 能配合其他模块达到生产自动化的要求、作为管理平台、融合 [BI]^(商业智能)（business intelligence）分析。 

## APC：管控过程、提升良率

半导体量产中，由于投资规模庞大，良率哪怕能做到 1% 的提升，都能带来非常可观的收益增加。APC 就是一种提升良率或产能的综合解决方案。一般包括 R2R、FDC、OEE。在制程执行时，期间存在各种影响因素导致量产出的晶圆存在差异，需要通过实时监控影响因素变化的参数来提升良率或产能，而这依赖于 APC 对数据的搜集，包括 [DCU]^(数据收集单元)（Data Collection Unit）主动收集的资料以及对其他系统（如 MES、PMS 等）资料的运用。

有关 APC 的更多信息，可[按此访问](http://franktsao.blogspot.com/2009/10/apc.html)鼎捷软件曹永诚所撰导论（2005 年 6 月，Blogspot 链接）。

## 关于 AMHS

12 吋厂线的 RTD 多与 AMHS 搭配使用以达到更高程度的自动化，通常还与 [MCS]^(物料控制系统)（Material Control System） 一起运作。RTD 针对制程情况给出派货建议，未配备 AMHS 的工厂一般通过人工运输，配备 AMHS 则可以相互通讯以自动运输。AMHS 中各种器械有序灵活的运作，能让人直观感受到工业制造具备的魅力。一般包括：

- [OHT]^(空中行走式/高架搬运系统)（Overhead Hoist Transfer），多用在加工区间内（Intra-bay），也可用于不同区间之间（Inter-bay）或覆盖全厂（factory wide）的运输。
- [OHS]^(空中行走式/高架搬运车)（Overhead Shuttle），常用于不同仓储设备间（也称 Inter-bay Transport System）。
- [AGV]^(自动导引车)（Automated Guided Vehicle），常用在复杂路径。
- [RGV]^(有轨导引车)（Rail Guided Vehicle），轨道运输，带机械臂。

## 芯片制作工序：英文不完全对照

{{< mermaid >}}
flowchart TD
	subgraph a[1.Wafer Processing]
	a1[Cast]-->a2[Slice]-->a3[Polish the surface]
	end
	subgraph b[2.Exposed to oxygen]
	b1[Clean]-->b2[Exposed to oxygen<br>at high temperatures<br>to create a layer of silicon oxide]-->b3[Layer Thickness Test]
	end
	subgraph c[3.Lithography]
	c1[Apply a UV-sensitive photoresist on the surface]-->c2[Irradiate the UV light to transfer the pattern onto the photoresist]-->c3[Remove unexposed area]
	end
	subgraph d[4.Etching and Removing]
	d1[To etch films of unmasked area and remove the photoresist]
	end
	subgraph e[5.Film Depositing]
	e1[using CVD or PVD]
	end
	subgraph f[6.Interconnect Formation]
	f1[To form wiring layers]
	end
	subgraph g[7.Wafer Testing]
	g1[EDS]
	end
	subgraph h[8.Assembly and Testing]
	h1[Cut into die]-->h2[Attached to the package substrate]-->h3[Connected to inner leads]-->h4[Sealed in an epoxy resin envelope]-->h5[Test]
	end
	mm("(IC Design)")-->a-->b-->c-->d-->e-->f-->g-->h
{{< /mermaid >}}
