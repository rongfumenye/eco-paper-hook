# PAPERHOOK 英文版改造 · 检查报告

检查时间：2026-11-19
检查范围：`/workspace/eco-paper-hook-site`
Git 状态：**未提交、未推送**，远程仍为 `fa2f94d`（中文版）

---

## 一、8 个修改文件清单

| 文件 | 改动性质 | 增/删行 | 是否动结构 |
|---|---|---|---|
| `index.html` | 全文案改写为英文 | +104 / -132 | 少 1 个板块（见第三节） |
| `eco.html` | 全文案改写为英文 | +83 / -119 | 少 1 个 CTA，表格改列表 |
| `products.html` | 全文案改写为英文，新增 5 张卡片配图 | +113 / -91 | 板块数一致 |
| `custom.html` | 全文案改写为英文，新增 2 个板块 | +83 / -82 | 板块 +2 |
| `cases.html` | 全文案改写为英文 | +86 / -86 | 板块数一致 |
| `about.html` | 全文案改写为英文，新增 2 个板块 | +85 / -76 | 板块 +2 |
| `contact.html` | 全文案改写为英文 + 表单字段重做 | +77 / -93 | 板块数一致 |
| `assets/style.css` | **仅字体栈 2 行** | +2 / -2 | 无 |

### style.css 的实际改动（完整）

```diff
- font-family:... "PingFang SC","Hiragino Sans GB","Microsoft YaHei","Noto Sans SC",sans-serif;
+ font-family:... "Segoe UI",Inter,Roboto,"Helvetica Neue",Arial,sans-serif;

- h1,h2,h3,h4,.serif{font-family:"Songti SC","Noto Serif CJK SC","Source Han Serif SC",Georgia,serif;...}
+ h1,h2,h3,h4,.serif{font-family:Georgia,"Times New Roman","Iowan Old Style",serif;...}
```

**版式、配色、间距、断点、组件样式：一行未动。**

---

## 二、翻译完整性

| 检查项 | 结果 |
|---|---|
| 中文残留字符 | **0**（7 个页面全文扫描 `[一-龥]`） |
| 模板占位符残留（`{WA}` `{MAIL}` 等） | **0** |
| `<html lang>` | 全部 `en` |
| `<title>` / `meta description` | 全部英文，且按页面独立撰写 |
| 导航项 | 全部英文（Home / Sustainability / Products / Custom & OEM / Applications / Factory / Contact） |
| 侧边栏、页脚、浮动按钮 | 全部英文 |

---

## 三、原中文内容是否有丢失 ⚠️

**中文被替换成英文是预期行为，但有 3 处内容在改写中丢失或弱化，需要你决定是否补回。**

### 3.1 首页少了「CIRCULAR STORY · 一棵树」板块（整块丢失）

旧版内容：

> 森林 → 原纸 → 模切 → 货架 → 回收 → 再生纸浆。这条链上，我们只做中间那两步，但把两头都交代清楚：纸从哪来，用完去哪。
> · 边角料 100% 回炉，不产生额外废料
> · 外箱使用再生瓦楞纸，无塑料胶带缠绕
> · 大豆油墨印刷，VOC 排放更低
> → 看完整环保说明

这是环保叙事最有说服力的一块，配图 `forest.jpg`。新版把这张图挪到了环保页，首页不再有这个板块。

### 3.2 环保页少了结尾 CTA「需要环保材质说明文件？」

旧版：把你的包装审核清单发给我，我们按项目提供对应的证书与说明材料（按钮：邮件索取 / 填写需求）。

对 B2B 客户来说这是个高效转化入口——采购方拿着审核清单来找你。新版没有对应区块。

### 3.3 环保页的对比表格被降级为定性列表

旧版是 5 行**带数值**的表格：

| 指标 | 纸质钩 | 塑料钩 |
|---|---|---|
| 单只重量 | 约 2.5–3.5 g | 约 3–5 g |
| 原料来源 | 可再生林木 | 石油基 |
| 自然降解 | 数月（工业堆肥） | 数百年 |
| 回收兼容 | 与纸卡同投 | 需单独分拣 |
| 印刷适配 | 胶印 / 烫金 / 压凹 | 移印为主 |

新版改成两个各 5 条的定性列表（mono-material / no tooling / printable…），**「单只重量」这组具体数字丢失**，也不再有并排对照。

> 其余页面（products / cases / contact）板块数量一致；custom 和 about 新版反而各多出 2 个板块（artwork specs、honest limits、三项承诺、walkthrough）。

---

## 四、图片 / CSS / JS / 导航 / 链接

| 检查项 | 结果 |
|---|---|
| 内部链接 | 7 页 × 7 条导航链接，**0 失效** |
| 图片引用 | 磁盘 12 张，站内引用 13 处，**0 失效，0 张闲置** |
| 导航一致性 | 7 页均为 1 个导航块、7 个导航项、1 个当前页高亮 ✅ |
| CSS | 加载正常，仅字体栈变化 |
| JS 数字动画 | 正常（`data-count` 触发滚动计数） |
| JS 滚动 reveal | 正常 |

---

## 五、移动端适配

| 页面 | 390px 横向溢出 | 结果 |
|---|---|---|
| index | 0px | ✅ |
| eco | 0px | ✅ |
| products | 0px | ✅ |
| custom | 0px | ✅ |
| cases | 0px | ✅ |
| about | 0px | ✅ |
| contact | 0px | ✅ |

抽屉菜单展开正常，WhatsApp / 邮箱 / Send inquiry 按钮完整可见，右下角浮动按钮不遮挡内容。

---

## 六、检查中发现并已修复的 2 个 Bug

### Bug 1：询价表单提交会报错（严重）

- **现象**：`contact.html` 的 `<form onsubmit="return sendInquiry(event)">`，但 `assets/main.js` 里**没有 `sendInquiry` 函数**（旧版靠 `id="quoteForm"` 绑定）。点击提交会抛 `sendInquiry is not defined`，表单完全不可用。
- **修复**：在 `main.js` **末尾追加** `sendInquiry()` 函数（23 行）。已验证原有 83 行**逐字节未变**。
- **验证**：`typeof window.sendInquiry === 'function'`，调用返回 `false` 正常阻止默认提交，mailto 正确拼装。

### Bug 2：提交按钮被 grid 拉成畸形椭圆

- **现象**：按钮在 `.form` 的 grid 中 `width:100%` 且 `align-self:stretch`，高度被 Notes 行撑满，`border-radius:999px` 变成巨大椭圆。
- **修复**：改为 `grid-column:1/-1; justify-self:start; padding:14px 38px`；Notes 字段加 `field full` 占满整行。

> 两处修复都属于功能缺陷修正，未改变视觉设计语言。

---

## 七、当前 Git 状态

```
 M about.html        M assets/main.js    M assets/style.css
 M cases.html        M contact.html      M custom.html
 M eco.html          M index.html        M products.html
```

- 本地 HEAD = `origin/main` = `fa2f94d`，**无远程冲突，可快进推送**
- **未执行** `git restore`、**未 commit**、**未 push**
- 线上 https://swcx0101.github.io/eco-paper-hook/ 仍是中文版，未受影响

---

## 八、需要你决定的 3 件事

1. **是否补回首页「CIRCULAR STORY 一棵树」板块？**（建议补，环保叙事核心）
2. **是否补回环保页「需要环保材质说明文件？」CTA？**（建议补，B2B 转化入口）
3. **环保页对比区是否恢复为带数值的表格？**（建议恢复，采购方要看数字）

确认后我再改，改完你验收，最后一步才是 commit + push。
