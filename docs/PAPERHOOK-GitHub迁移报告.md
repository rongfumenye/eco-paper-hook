# PAPERHOOK 项目 · GitHub 账号迁移报告

迁移日期：2026-11-20　|　状态：**迁移完成，新站点已上线验证** ✅

---

## 一、迁移背景

原项目位于 `SWCX0101/eco-paper-hook`。按要求重新绑定 GitHub 账号为新账号 `rongfumenye` 后，新账号对原仓库仅有 pull 权限（push: false），导致无法推送。因此将项目完整迁移到新账号。

## 二、执行结果

| 步骤 | 结果 |
|---|---|
| 新账号登录 | ✅ `rongfumenye`（浏览器设备码授权） |
| 新仓库创建 | ✅ `rongfumenye/eco-paper-hook`（公开、空仓库、main 分支） |
| 代码推送 | ✅ `4e0e588` 完整历史推送，**普通推送，未 force push** |
| 域名修正 | ✅ 693 处旧域名替换为新域名（`59cbde5`） |
| GitHub Pages | ✅ 已在 main 根目录启用，status: built |
| 线上验收 | ✅ 28 页面 + 浏览器端 34 项全部通过 |

## 三、提交记录

- `4e0e588 feat: launch PAPERHOOK multilingual website`（首次推送到新仓库）
- `59cbde5 fix: update canonical and hreflang URLs to new GitHub Pages domain`（SEO 域名修正，693 处）

## 四、域名修正说明

迁移后发现 sitemap.xml、robots.txt 及全部 28 个页面的 canonical/hreflang 中仍含旧域名 `swcx0101.github.io`，会导致搜索引擎互指到旧站。已全部替换为 `rongfumenye.github.io`，SEO 一致性复核通过（28 条 sitemap，0 不一致）。

## 五、远程配置

```
old-origin  https://github.com/SWCX0101/eco-paper-hook.git   （保留追溯，未删除、未推送）
origin      https://github.com/rongfumenye/eco-paper-hook.git （当前主远程）
```

- 旧仓库 `SWCX0101/eco-paper-hook` **未删除、未改动**，其 Pages 仍在运行，作为回滚备份。
- 本地工作区干净，本地与 origin/main 一致（59cbde5）。

## 六、新访问地址

**语言门首页**：https://rongfumenye.github.io/eco-paper-hook/

| 语言 | 地址 |
|---|---|
| English | https://rongfumenye.github.io/eco-paper-hook/en/index.html |
| 简体中文 | https://rongfumenye.github.io/eco-paper-hook/zh/index.html |
| Русский | https://rongfumenye.github.io/eco-paper-hook/ru/index.html |
| العربية | https://rongfumenye.github.io/eco-paper-hook/ar/index.html |

SEO：
- https://rongfumenye.github.io/eco-paper-hook/sitemap.xml
- https://rongfumenye.github.io/eco-paper-hook/robots.txt

## 七、后续建议（供你决定）

1. **旧站处理**：旧仓库 Pages 仍在运行，新旧两站并存。确认新站稳定后，可考虑关闭旧仓库 Pages 或归档旧仓库，避免搜索引擎收录重复内容。
2. **自定义域名**：如需绑定自有域名，可在新仓库 Settings → Pages 中配置 CNAME。
3. **DNS 缓存**：如旧链接仍指向旧站，属于 CDN/DNS 缓存，强制刷新或等待传播即可。
