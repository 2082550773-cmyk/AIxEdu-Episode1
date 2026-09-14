# Shot05 + Shot06 制作 Workflow 总结

## 1. 项目概览

本项目按照批准的 `references/shot05-shot06-storyboard.png`，制作了一个独立、无依赖、可通过 `file://` 直接打开的 25 秒 SVG animatic。

核心表达是一次问题表征转移：

> 从“如何把单个 tip 做得更细”，转向“如何利用两根锥形毛之间的结构控制液体”。

最终交付由以下文件组成：

| 文件 | 职责 |
| --- | --- |
| `index.html` | 16:9 SVG 舞台、科学图形、字幕层和播放控件 |
| `styles.css` | 纸张/手绘风格、颜色、字体和响应式样式 |
| `timeline.js` | 动画时间、字幕、布局、字体和视觉强调参数 |
| `main.js` | 确定性渲染循环、SVG 绘制、播放及键盘控制 |
| `README.md` | 本地预览方法和项目结构说明 |

## 2. 模型与执行方式

- **模型：** GPT-5.6 Sol，由 OpenAI 创建。
- **工作目录：** `/workspace/AIxEdu-Episode1`
- **实现方式：** 原生 HTML、CSS、SVG 和 JavaScript。
- **依赖：** 无运行时依赖，无 npm、构建工具或本地服务器要求。
- **协作方式：** 读取 storyboard 和用户时间轴要求，直接修改仓库，通过终端进行静态检查和确定性时间点验证，每次完成修改后提交 Git 并生成 PR 描述。

## 3. 从头到尾的实施流程

### 3.1 检查环境与视觉参考

首先检查工作目录、仓库内容、Git 状态、`AGENTS.md` 和参考图片。随后查看批准的 storyboard，以它作为构图、视觉层级和科学表达的来源。

主要检查命令：

```bash
pwd
find .. -name AGENTS.md -print
find . -maxdepth 3 -type f -print | sort
git status --short
git log --oneline -3
```

### 3.2 建立独立项目

从空白仓库建立 `index.html`、`styles.css`、`timeline.js`、`main.js` 和 `README.md`，使用 1600×900 SVG `viewBox` 构建响应式 16:9 舞台。

视觉基调包括：

- 暖白纸张背景；
- 轻微纸纤维纹理；
- 深灰手绘线条；
- 淡蓝液体；
- 红橙色认知强调；
- 轻微 SVG displacement，避免机械直线感；
- 无 3D、粒子、glow、HUD 或装饰性转场。

### 3.3 构建 Shot05 科学图形

在一个可复用的 `#hair-structure` 内建立：

- `#hair-left` 与 `#hair-right`：两根锥形毛；
- `#confined-liquid`：两根毛之间已有的液体；
- `#liquid-contour`：液体轮廓强调；
- `#substrate`：底部基底；
- `#written-line`：液体转移后留下的短线。

认知标注包括：

- `#old-tip-circle`、`#tip-size-label`、`#tip-size-cross`；
- `#new-gap-circle`、`#gap-label`；
- `#liquid-bridge-label`、`#liquid-pointer`。

实现保持以下科学边界：

- GAP 表示两根毛之间的区域，而不是尺子测量；
- LIQUID BRIDGE 只标记已存在的 confined liquid；
- X 否定的是 TIP SIZE 问题框架，而不是物理毛尖；
- 不表达“gap 越小，线越细”。

### 3.4 构建 Shot06 表征对照

左侧 OLD panel 包含：

```text
OLD REPRESENTATION
原来的问题表征
怎样做一个更细的 tip？
single tip → thinner tip
```

右侧 NEW panel 包含：

```text
NEW REPRESENTATION
新的问题表征
怎样利用两根毛之间的结构去控制液体？
```

Shot06 没有创建第二份双毛图。渲染器移动和缩放 Shot05 已有的 `#hair-structure`，保证镜头连续性。

经过布局修订后，OLD 和 NEW：

- frame 宽高相同；
- 顶边与底边对齐；
- 标题、中文标题、问题、diagram 使用相同的纵向层级；
- diagram 位于问题文字下方并水平居中；
- OLD 的大 X 覆盖问题框架，而不是只否定 tip。

### 3.5 建立确定性动画系统

项目不使用散落的 `setTimeout()`。每帧都由 `render(time)` 根据当前本地时间重新计算。

核心辅助函数：

- `progressBetween()`：把一个时间段映射到 0–1；
- `ease()`：提供平滑插值；
- `draw()`：通过 `strokeDasharray` 和 `strokeDashoffset` 绘制 SVG path；
- `visible()`：控制 opacity。

因此自动播放、暂停、Replay 和 scrub 到同一时间点时，会得到相同画面。

### 3.6 集中时间和调节参数

`timeline.js` 暴露两个只读全局配置：

#### `window.SHOT_TIMELINE`

集中管理：

- Shot05/Shot06 所有主要事件的开始和结束时间；
- 过渡和 pause；
- subtitle 的开始、结束和文本；
- 25 秒总时长。

#### `window.SHOT_TUNING`

集中管理：

- 主要 group 的 x/y/scale；
- OLD/NEW frame 尺寸；
- diagram scale；
- label、question、subtitle 位置；
- concept/title/question/subtitle font size；
- OLD opacity、secondary opacity；
- circle/frame/cross-out stroke width。

后续小型修改通常只需调整 `timeline.js` 中少量参数。

### 3.7 支持直接双击预览

最初的 ES module 入口在部分浏览器的 `file://` 环境中会受到本地模块/CORS 限制，因此改为按顺序加载普通脚本：

```html
<script src="timeline.js"></script>
<script src="main.js"></script>
```

项目不使用 `import`、`fetch()` 或远程资源。Windows、macOS 和 Linux 用户均可直接双击 `index.html`。

### 3.8 逐轮 targeted revisions

实施过程中按反馈进行了以下定向修改，没有改变整体视觉概念：

1. 修复 `file://` 直接播放；
2. 让视觉动作与字幕/旁白时间严格对应；
3. 缩紧 NEW panel 并消除文字与 diagram 的重叠；
4. 将 OLD/NEW panel 调整为等尺寸、同层级的 matched pair；
5. 在新 GAP circle 出现前完全清除旧 tip circle；
6. 确保“真正重要的东西开始变了”期间 TIP SIZE 尚未被否定；
7. 在“不再只是”开始时才绘制 TIP SIZE cross-out；
8. 在“而是——”开始新 region circle；
9. 在“gap”和“liquid bridge”旁白处同步显示对应标签；
10. 在 22.5 秒后停止全部动画并保持最终对照。

## 4. 当前时间轴

### Shot05

| 本地时间 | 画面与字幕关系 |
| --- | --- |
| 0.0–1.5s | 液体进入/占据两根毛之间的区域 |
| 1.5–5.0s | 建立 TIP SIZE 旧关注点，不画 X |
| 5.0–6.8s | “不再只是”触发 cross-out，旧小圆消失 |
| 6.8–7.7s | “而是——”触发新 region circle |
| 7.7–9.7s | 显示 GAP / 间隙 |
| 9.7–10.5s | 注意力从区域转向其中的液体 |
| 10.5–13.5s | 显示 LIQUID BRIDGE，并完成 substrate/written line |

### Shot06

| 本地时间 | 画面与字幕关系 |
| --- | --- |
| 13.5–13.9s | 保持 Shot05 最终状态 |
| 13.9–15.5s | 移动既有双毛结构并开始建立 OLD |
| 15.5–17.3s | 完成 OLD representation |
| 17.3–20.3s | 否定 OLD 并开始建立 NEW |
| 20.3–22.5s | 完成 NEW，轻微 replay liquid transfer |
| 22.5–25.0s | 停止全部运动，保持最终对照 |

## 5. 播放与交互

支持：

- 自动播放；
- Play/Pause；
- Replay；
- progress scrubber；
- timecode；
- `Space`：播放/暂停；
- `Home`：回到开头；
- `ArrowLeft` / `ArrowRight`：以 0.5 秒为单位检查画面；
- `prefers-reduced-motion`：系统要求减少运动时默认暂停。

## 6. 验证方法

### JavaScript 语法

```bash
node --check main.js
node --check timeline.js
```

### Git patch 和仓库状态

```bash
git diff --check
git status --short
```

### Timeline 连续性

使用 Node 脚本检查：

- 总时长为 25 秒；
- subtitle cue 之间无空档；
- Shot 边界正确；
- final hold 边界正确。

### Windows `file://` 模拟

使用 Node `vm` 以类似下面的文件名顺序执行 classic scripts：

```text
file:///C:/Users/Reviewer/Shot05-06/timeline.js
file:///C:/Users/Reviewer/Shot05-06/main.js
```

检查全局配置、初始 render、播放按钮和 Replay handler。该方法验证本地文件加载模型和代码路径，但不等同于真实 Windows GUI 的端到端浏览器自动化。

### 关键时间点断言

程序化检查过的典型状态包括：

- 4.9s：TIP SIZE 仍未被 cross-out；
- 5.9s：cross-out 正在进行；
- 6.8s：old tip circle 完全消失；
- 8.0s：GAP 与旁白同步；
- 10.6s：LIQUID BRIDGE 与旁白同步；
- 13.7s：Shot06 opening hold；
- 22.5s 和 24.0s：关键动画属性一致，确认最终静止。

### Layout 数值检查

程序化验证过：

- OLD/NEW frame 宽高相同；
- top/bottom 对齐；
- diagram 在 panel 中水平居中；
- 两个 diagram 视觉高度接近；
- question 与 diagram 之间有明确间隔。

## 7. Git 记录

查看提交历史使用：

```bash
git log --reverse --format='%h|%ad|%s' --date=iso-strict
```

由于中间修改可能在最终分支上被 squash，Git 历史不一定逐条保留对话中每一次 targeted revision；当前主要实现提交代表多轮修改合并后的状态。

## 8. Token 消耗说明

当前执行环境没有向模型暴露完整会话的 API usage metadata，因此无法准确读取：

- input tokens；
- output tokens；
- cached tokens；
- reasoning tokens；
- 每轮或全程 total tokens。

不能从代码行数、Git diff 或对话长度准确反推 token，因此本文不提供虚构估算。

若通过 OpenAI API 调用，应由调用方累计每次响应返回的 usage 字段；如果通过 Agent UI 运行，应从该平台的 session trace、usage 或 billing 页面获取。

## 9. 耗时说明

当前环境没有提供完整的 session start/end、每轮推理时间、工具调用累计时间和用户反馈等待时间，因此无法恢复准确的“模型主动工作时长”。

Git commit 时间只能说明仓库事件的日历时间，不能代表实际工作时间，因为其中可能包含：

- 用户反馈等待；
- 非活动时间；
- 分支切换；
- commit squash；
- 仓库创建与任务正式开始之间的间隔。

因此，精确 token 和主动耗时应以调用平台的 usage/trace 数据为准。

## 10. 最终状态

当前成果具备：

- 独立 25 秒 SVG animatic；
- Shot05 → Shot06 无切镜连续性；
- 同一个双毛结构跨镜头复用；
- TIP SIZE → GAP → LIQUID BRIDGE 的认知转移；
- OLD × 与 NEW matched comparison；
- narration-aligned timing；
- 最终静止；
- Play/Pause、Replay、scrubbing 和键盘控制；
- `file://` 直接打开；
- 集中的 timing、layout、typography 和 emphasis 配置。
