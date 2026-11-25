/* ==================================================================
 * KALOZEN · Workers 入口（Cloudflare Workers Static Assets）
 * ------------------------------------------------------------------
 * 本项目以 Workers + 静态资源方式部署（wrangler.toml [assets]）。
 * 静态文件由 Assets 直接托管；本 Worker 仅接管 /api/* 动态请求：
 *   POST /api/inquiry   询盘接收（复用 functions/api/inquiry.js 同一套逻辑）
 *   GET  /api/inquiry   健康检查
 *   GET  /api/inquiries 记录查看（需 token）
 * 其余路径一律回落到静态资源，保持原站点行为不变。
 * 密钥只从 env 读取（INQUIRY_TO_EMAIL / MAIL_API_KEY / INQUIRY_DB ...）。
 * ================================================================== */
import { onRequest as inquiryOnRequest } from './functions/api/inquiry.js';
import { onRequest as listOnRequest } from './functions/api/inquiries.js';

export default {
  async fetch(request, env, ctx) {
    var path;
    try { path = new URL(request.url).pathname; }
    catch (e) { path = '/'; }

    if (path.replace(/\/$/, '') === '/api/inquiry') {
      return inquiryOnRequest({ request: request, env: env, ctx: ctx });
    }
    if (path.replace(/\/$/, '') === '/api/inquiries') {
      return listOnRequest({ request: request, env: env, ctx: ctx });
    }

    // 中文联系我们页面已下线：旧链接 301 到英文联系我们页面，避免 404。
    // 仅重定向该页面本身，不影响其他中文页面。
    var contactPath = path.replace(/\/$/, '').replace(/\.html$/, '');
    if (contactPath === '/zh/contact') {
      return new Response(null, {
        status: 301,
        headers: { Location: '/en/contact', 'Cache-Control': 'no-store' }
      });
    }

    // 静态资源：交由 Assets 绑定处理；未绑定则给出明确响应
    if (env && env.ASSETS && typeof env.ASSETS.fetch === 'function') {
      return env.ASSETS.fetch(request);
    }
    return new Response('Not found', { status: 404 });
  }
};
