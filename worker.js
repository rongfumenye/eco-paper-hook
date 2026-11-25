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
    var url, path;
    try { url = new URL(request.url); path = url.pathname; }
    catch (e) { url = null; path = '/'; }

    // 统一协议：正式域名上的 http 请求 301 跳转到 https，避免 http/https 两套重复网址。
    // 边缘可能改写 request.url 的 scheme，因此同时检查 X-Forwarded-Proto。
    // 仅对正式域名生效，不影响本地 wrangler dev（localhost）。
    if (url) {
      var host = (url.hostname || '').toLowerCase();
      var fwdProto = (request.headers.get('X-Forwarded-Proto') || '').split(',')[0].trim().toLowerCase();
      var isHttp = url.protocol === 'http:' || fwdProto === 'http';
      if (isHttp && host === 'kalozen.com') {
        var target = 'https://kalozen.com' + url.pathname + (url.search || '');
        return new Response(null, { status: 301, headers: { Location: target, 'Cache-Control': 'no-store' } });
      }
    }

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
