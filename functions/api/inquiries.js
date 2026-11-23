/* ==================================================================
 * KALOZEN · 询盘记录查看接口（受保护）
 * GET /api/inquiries?token=<ADMIN_TOKEN>
 * ------------------------------------------------------------------
 * 仅当服务端配置了 INQUIRY_ADMIN_TOKEN 且请求 token 匹配时，
 * 才从 KV(INQUIRY_DB) 列出最近 N 条询盘记录，便于人工查看与跟进。
 * 无 token / token 错误 → 401，绝不泄露客户数据。
 * 敏感字段（客户邮箱）默认返回，供跟进使用；接口不入前端链接。
 * ================================================================== */

function json(body, status) {
  return new Response(JSON.stringify(body), {
    status: status || 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff'
    }
  });
}

function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  var diff = 0;
  for (var i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function onRequest(context) {
  var env = context.env || {};
  var method = (context.request && context.request.method) || 'GET';
  if (method !== 'GET') return json({ success: false, code: 'METHOD_NOT_ALLOWED' }, 405);

  var adminToken = (env.INQUIRY_ADMIN_TOKEN || '').trim();
  if (!adminToken) {
    return json({ success: false, code: 'NOT_CONFIGURED', message: 'Admin token not configured.' }, 503);
  }
  var url = new URL(context.request.url);
  var token = url.searchParams.get('token') || '';
  if (!safeEqual(token, adminToken)) {
    return json({ success: false, code: 'UNAUTHORIZED' }, 401);
  }

  var kv = env.INQUIRY_DB;
  if (!kv || typeof kv.list !== 'function') {
    return json({ success: false, code: 'NOT_CONFIGURED', message: 'KV store not bound.' }, 503);
  }

  var limit = parseInt(url.searchParams.get('limit') || '50', 10) || 50;
  if (limit > 200) limit = 200;
  try {
    var listed = await kv.list({ prefix: 'inquiry:' });
    var keys = (listed.keys || []).slice(-limit).reverse();
    var items = [];
    for (var i = 0; i < keys.length; i++) {
      var raw = await kv.get(keys[i].name);
      if (raw) { try { items.push(JSON.parse(raw)); } catch (e) {} }
    }
    return json({ success: true, count: items.length, items: items }, 200);
  } catch (e) {
    return json({ success: false, code: 'STORE_ERROR', message: String(e && e.message || e) }, 500);
  }
}
