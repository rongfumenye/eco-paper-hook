# PAPERHOOK 四语言外贸独立站 · 升级报告

生成时间：2026-11-19
站点根目录：`/workspace/eco-paper-hook-site`
Git 状态：**未 commit、未 push**，远程仍为 `fa2f94d`

---

## 一、备份（动手前已完成）

| 备份位置 | 内容 | 校验 |
|---|---|---|
| `/workspace/_backup/2026-11-19-english-wip/` | 升级前 8 个未提交文件的完整副本 | 9 个关键文件 MD5 逐一比对，全部一致 |
| `/workspace/_backup/legacy-root-html/` | 原根目录 6 个英文页（about/cases/contact/custom/eco/products） | 已归档，未删除内容 |
| Git 历史 `fa2f94d` | 中文版全站快照 | 可随时 `git show` 取回 |

**未执行 `git restore`。** 所有原有内容均可追溯。

---

## 二、站点结构

```
eco-paper-hook-site/
├── index.html          ← 语言入口（浏览器语言自动跳转 + 手动选择）
├── en/  zh/  ru/  ar/  ← 各 7 页，共 28 页
│   ├── index.html      首页
│   ├── eco.html        环保主张
│   ├── products.html   产品中心
│   ├── custom.html     定制服务
│   ├── cases.html      应用场景
│   ├── about.html      工厂实力
│   └── contact.html    联系我们
├── assets/style.css    ← 共享（新增语言切换器 + RTL 规则，共 +146 行）
├── assets/main.js      ← 共享（新增语言记忆 + sendInquiry，原 83 行未改）
├── assets/img/         ← 12 张图共享，未复制、未镜像
├── sitemap.xml         ← 28 URL × 5 组 hreflang
└── robots.txt
```

**路径策略**：全部相对路径（`../assets/`、`../zh/eco.html`），不依赖站点根，完全兼容 GitHub Pages 的 `/eco-paper-hook/` 子路径部署。

---

## 三、四语言覆盖

| 页面 | EN | ZH | RU | AR |
|---|---|---|---|---|
| 首页 | ✅ | ✅ | ✅ | ✅ |
| 环保主张 | ✅ | ✅ | ✅ | ✅ |
| 产品中心 | ✅ | ✅ | ✅ | ✅ |
| 定制服务 | ✅ | ✅ | ✅ | ✅ |
| 应用场景 | ✅ | ✅ | ✅ | ✅ |
| 工厂实力 | ✅ | ✅ | ✅ | ✅ |
| 联系我们 | ✅ | ✅ | ✅ | ✅ |

翻译范围包含：**导航、侧边栏、页脚、浮动按钮、表单标签与占位符、FAQ、表格表头、按钮文案、图片 alt、页面标题与描述**——不是只翻正文。

### 翻译处理原则

| 语言 | 处理方式 |
|---|---|
| **English** | 天然 B2B 采购语言：`MOQ`、`lead time`、`chain of custody`、`die line`、`Incoterms` 等术语按行业惯例使用，不用 "cheap / best quality" 这类中式外贸套话 |
| **简体中文** | 保留原站文案，未做二次改写 |
| **Русский** | 按俄语商务习惯调整：数量用空格分位（10 000）、小数用逗号（22,9%）、`минимальный заказ`、`оснастка`、`цепочка поставок` 等术语；句式避免直译的冗长定语 |
| **العربية** | 正式商务阿拉伯语：`الحد الأدنى للطلب`、`سلسلة الحفظ`、`مدة التنفيذ`；避免口语化表达 |

### 未虚构内容

- 产品参数（1.5/1.8/2.0 mm、300–600 g、4/5/6 mm 孔径）沿用原站数据
- 认证仅保留 FSC®（原站已有），未新增 CE / ISO / SGS 等未验证资质
- 产能表标注 `indicative`（示意），未编造具体数字
- **全站无价格**，延续上一版要求

---

## 四、阿拉伯语 RTL 适配

`<html lang="ar" dir="rtl">` + 21 条 CSS 镜像规则：

| 元素 | RTL 处理 |
|---|---|
| 侧边栏 | `left:0` → `right:0`，主内容 `margin-left` → `margin-right` |
| 移动端抽屉 | 从右侧滑入（`translateX(100%)` → `0`） |
| 统计条 | 分隔线 `border-left` → `border-right` |
| 时间线 | 竖线与节点整体镜像到右侧 |
| 列表圆点 | `padding-left` → `padding-right` |
| 浮动按钮 | 右下 → 左下 |
| 面包屑分隔符 | `scaleX(-1)` 翻转 |
| 按钮箭头 | `scaleX(-1)` 翻转 |
| 表单 | `text-align:right` + `direction:rtl` |
| 字体 | `Noto Naskh Arabic` / `Traditional Arabic` 优先 |
| **图片** | **未做任何翻转**（产品、Logo、照片保持原方向） |
| 电话 / 邮箱 | 加 `dir="ltr"`，避免数字串被重排 |

---

## 五、SEO

每页均包含：

```html
<link rel="canonical" href="https://swcx0101.github.io/eco-paper-hook/{lang}/{page}.html">
<link rel="alternate" hreflang="en" href=".../en/{page}.html">
<link rel="alternate" hreflang="zh-Hans" href=".../zh/{page}.html">
<link rel="alternate" hreflang="ru" href=".../ru/{page}.html">
<link rel="alternate" hreflang="ar" href=".../ar/{page}.html">
<link rel="alternate" hreflang="x-default" href=".../en/{page}.html">
```

- **Title / Description**：28 组独立撰写，非同一句翻译
- **Open Graph + Twitter Card**：含 `og:locale`、`og:image`
- **sitemap.xml**：28 个 URL，每个含 5 条 `xhtml:link`（共 140 条）
- **robots.txt**：指向 sitemap
- **根 index.html**：canonical 指向 `/en/`，`x-default` 指向 `/en/`，避免入口页被当作重复内容

---

## 六、检查结果

### 6.1 链接与资源（928 个引用）

| 类型 | 数量 | 失效 |
|---|---|---|
| 同语言页面链接 | 196 | **0** |
| 跨语言切换链接 | 196 | **0** |
| CSS / JS / 图片 | 536 | **0** |

### 6.2 图片

12 张图全部被引用，全部正常显示，**无复制、无镜像**。

### 6.3 移动端（390 × 844）

| 语言 | index | eco | products | custom | cases | about | contact |
|---|---|---|---|---|---|---|---|
| en | 0px | 0px | 0px | 0px | 0px | 0px | 0px |
| zh | 0px | 0px | 0px | 0px | 0px | 0px | 0px |
| ru | 0px | 0px | 0px | 0px | 0px | 0px | 0px |
| ar | 0px | 0px | 0px | 0px | 0px | 0px | 0px |

横向溢出全部为 0，抽屉菜单四语言均正常。

### 6.4 功能测试

| 测试 | 结果 |
|---|---|
| `en/cases.html` 点「РУ」 | → `/ru/cases.html` ✅ 保留当前页 |
| `ru/cases.html` 点「ع」 | → `/ar/cases.html` ✅ |
| 阿语页面 `dir` 属性 | `rtl` ✅ |
| 阿语内页导航 | → `/ar/products.html` ✅ |
| 表单 `sendInquiry` | `function` ✅ |
| 中文浏览器访问根路径 | 自动跳 `/zh/index.html` ✅ |
| 语言偏好记忆 | `localStorage['ph-lang']` ✅ |

---

## 七、已知限制

1. **根目录 6 个旧页在 git 中显示为 `D`（删除）**
   原因：内容已迁移至 `en/`（英文）与 `zh/`（中文），根目录不再保留重复页面。文件实体备份在 `/workspace/_backup/legacy-root-html/`，**没有内容丢失**。若你希望保留根目录旧 URL，我可以加 301 风格的跳转页。

2. **俄语 / 阿语为专业翻译，非母语审校**
   术语与句式按商务惯例处理，但建议上线前请俄语、阿语母语者通读一遍，特别是产品技术段落。我可以生成一份「待审校术语表」便于对方快速过目。

3. **阿语字体依赖系统字体**
   使用 `Noto Naskh Arabic` → `Traditional Arabic` → `Georgia` 回退链。Android / Windows / macOS 均有覆盖，极老设备可能回退到默认字体。

4. **未绑定自定义域名**
   所有 canonical / hreflang 使用 `https://swcx0101.github.io/eco-paper-hook/`。若后续绑定域名，需要批量替换 `site_core.py` 里的 `SITE` 常量并重新生成。

---

## 八、预览方式

### 本地预览（推荐）

```bash
cd /workspace/eco-paper-hook-site
python3 -m http.server 8899
```

然后访问：

| 地址 | 内容 |
|---|---|
| http://localhost:8899/ | 语言入口（会按浏览器语言跳转） |
| http://localhost:8899/en/ | 英文站 |
| http://localhost:8899/zh/ | 中文站 |
| http://localhost:8899/ru/ | 俄语站 |
| http://localhost:8899/ar/ | 阿语站（RTL） |

### 直接打开文件

双击 `index.html` 也可以，但 `file://` 协议下语言自动跳转与 `localStorage` 可能受浏览器限制，建议用上面的本地服务器。

---

## 九、发布前的最后一步（等你确认）

```bash
cd /workspace/eco-paper-hook-site
git add -A
git commit -m "feat: 四语言站点 (en/zh/ru/ar) + RTL + hreflang + sitemap"
git push
```

推送后 GitHub Pages 约 1 分钟自动重新部署，地址不变：
`https://swcx0101.github.io/eco-paper-hook/`

**目前未执行上述任何命令。**
