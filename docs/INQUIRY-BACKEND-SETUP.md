# KALOZEN 询盘后端 · 配置说明（第一阶段）

> 目的：让询盘表单真正提交到服务端、保存记录、发送邮件。密钥只存服务端，前端与代码仓库不含任何真实密钥。

## 一、架构

```
浏览器表单  →  POST /api/inquiry  →  Cloudflare Function (functions/api/inquiry.js)
                                        ├─ 服务端校验 / honeypot / 限流 / 去重
                                        ├─ KV(INQUIRY_DB) 存储询盘记录
                                        └─ 邮件服务 API（服务端密钥）发送到收件邮箱
查看记录    →  GET  /api/inquiries?token=<ADMIN_TOKEN>  →  列出 KV 中的询盘（需 token）
```

- 前端脚本：`assets/inquiry.js`（POST 到后端，仅按后端 `success` 字段显示成功/失败）
- 中央配置：`assets/config.js`（`inquiryEndpoint`，已移除前端密钥字段）
- 后端函数：`functions/api/inquiry.js`、`functions/api/inquiries.js`

## 二、上线前必须配置的三项（缺一不可，否则接口以 503 NOT_CONFIGURED 明确拒绝，绝不谎报成功）

在 Cloudflare 控制台 → 你的项目 → **Settings → Environment variables**，添加。

**方案 A（推荐，最简单）：Web3Forms** —— 只需一个 Access Key，无需 SMTP / 发信域名：

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `WEB3FORMS_ACCESS_KEY` | 在 https://web3forms.com 用你的收件邮箱注册后获得的 Access Key（绑定该邮箱收信） | `xxxxxxxx-xxxx-xxxx` |

获取步骤：打开 https://web3forms.com → 输入你要收信的邮箱（应为所有者确认的 `www.777910@gmail.com`）→ 查收 Web3Forms 发来的邮件，复制其中的 Access Key → 填入上方环境变量。
> 该 Key 只存服务端，**绝不写入前端或仓库**。

**方案 B：Resend / 自建转发**（不用 Web3Forms 时）

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `INQUIRY_TO_EMAIL` | **你确认的真实收件邮箱**（询盘发到这里） | `sales@你的域名.com` |
| `MAIL_API_KEY` | 邮件服务 API Key（推荐 Resend） | `re_xxxxxxxx` |
| `MAIL_FROM` | 发件人（需在邮件服务中验证的域名/邮箱） | `KALOZEN Website <inquiry@你的域名.com>` |
| `MAIL_API_ENDPOINT` | 可选，兼容 API 端点；默认 `https://api.resend.com/emails` | — |
| `INQUIRY_ADMIN_TOKEN` | 查看询盘记录的访问令牌（自定义一串随机字符串） | `aB3dE7...` |

或改用自建转发（无需邮件服务厂商）：设置 `INQUIRY_WEBHOOK_URL`（https），后端会把 `{to, subject, text, reply_to}` POST 到该地址，由你的服务发信。

然后绑定 **KV 命名空间**（存询盘记录）：

1. Cloudflare 控制台 → **Workers & Pages → KV** → 新建命名空间，例如 `kalozen-inquiries`
2. 项目 → **Settings → Functions → KV namespace bindings** → 添加绑定：
   - Variable name：`INQUIRY_DB`
   - KV namespace：选刚建的 `kalozen-inquiries`

> 配置完成后，访问 `https://kalozen.com/api/inquiry`（GET）应返回
> `"deliveryEnabled": true`（用 Web3Forms 时还会显示 `"web3formsConfigured": true`）。
> 在此之前接口返回 `false` 并以 503 拒绝提交，前端走邮件客户端兜底，**绝不谎报成功**。

> **邮箱说明**：`www.777910@gmail.com` 已由所有者确认作为业务联系邮箱并公开发布；
> 它同时也是 Web3Forms 应绑定的收件邮箱。邮箱格式含 `www.` 前缀较特殊，
> 请以你实际能收信的 Gmail 为准注册 Web3Forms；如需改用其它收信邮箱请告知。

## 三、查看询盘记录

浏览器打开（把 token 换成你设置的 `INQUIRY_ADMIN_TOKEN`）：

```
https://kalozen.com/api/inquiries?token=<你的ADMIN_TOKEN>&limit=50
```

返回 JSON，含每条询盘的 ID、时间、全部字段、来源页面、语言、IP。建议收藏此地址（含 token，勿外泄）。

## 四、邮件发送说明

- 客户邮箱自动设为 **Reply-To**，点击回复即回客户。
- 主题格式：`KALOZEN Website Inquiry — 客户名 — 产品SKU/类别`。
- 正文含：公司、联系人、国家、产品、材质、厚度、孔径、数量、印刷、需求说明、来源页面、语言、时间、IP。
- 附件（设计稿/照片）：当前版本记录文件名于需求中说明；如需真实附件上传，可在邮件服务侧启用附件转发（后续阶段可加）。

## 五、安全设计

- 前端 `config.js` / `inquiry.js` **不含任何密钥**；密钥仅在 Cloudflare 服务端环境变量。
- 密钥不会出现在 GET 健康检查的返回中（只返回布尔状态）。
- honeypot（隐藏字段 `website`）拦截机器人；按 IP 每小时限流 12 条；同邮箱+数量+SKU 20 秒内去重。
- 查看记录接口需 token，且用常量时间比较，防时序攻击。
- 字段白名单 + 长度上限，防注入与超长内容。

## 六、启用前验收清单

- [ ] 提供并核实真实收件邮箱（当前配置中的 `www.777910@gmail.com` **未经核实且疑似错误，未使用**）
- [ ] 配置 `INQUIRY_TO_EMAIL` / `MAIL_API_KEY` / `MAIL_FROM`
- [ ] 绑定 KV `INQUIRY_DB`
- [ ] GET `/api/inquiry` 返回 `deliveryEnabled: true`
- [ ] 真实提交一条测试询盘 → 收件邮箱收到邮件（含 Reply-To=客户邮箱）
- [ ] GET `/api/inquiries?token=...` 能看到该条记录
- [ ] 全部通过后，收件人确认，第一阶段才算"邮件真实送达"通过

> 附件上传、GA4/GTM/Meta Pixel 追踪属于第二/三阶段，本阶段不启用、不谎报。
