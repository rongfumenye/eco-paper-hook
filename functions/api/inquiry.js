/* ==================================================================
 * KALOZEN · 询盘后端接收接口 (Cloudflare Pages Function)
 * POST /api/inquiry  —  接收全站中/英/俄/阿询盘表单
 * GET  /api/inquiry  —  健康检查（仅返回配置状态，不暴露任何密钥）
 * ------------------------------------------------------------------
 * 设计原则（对应网站体检整改要求）：
 *  1. 真实后端：服务端接收、校验、存储、发信，前端不再直接接触任何密钥。
 *  2. 密钥只在服务端环境变量(context.env)：WEB3FORMS_ACCESS_KEY（推荐）/
 *     MAIL_API_KEY / INQUIRY_WEBHOOK_URL / INQUIRY_TO_EMAIL。
 *     前端代码与仓库中不存在任何真实密钥。
 *  2b. Web3Forms 通道：设置 WEB3FORMS_ACCESS_KEY 后，服务端 POST
 *     https://api.web3forms.com/submit，由该 Key 绑定的邮箱收信；无需 SMTP。
 *  3. 记录留存：写入 Cloudflare KV 绑定 INQUIRY_DB（键 inquiry:<id>），
 *     便于后续查看跟进；KV 未绑定时明确报错，绝不谎报成功。
 *  4. 校验：必填字段 + 邮箱格式 + honeypot + 长度上限。
 *  5. 防重复/限流：基于 IP 的 KV 计数（TTL 窗口）。
 *  6. 成功/失败明确：仅当"存储成功 且 发信成功"才回 success=true；
 *     任一环节失败回 success=false 并带 code，前端据此显示真实错误。
 *
 * 【配置状态 / 门控】
 *  必须同时满足才真正投递：
 *    - env.INQUIRY_TO_EMAIL   已配置（你确认的收件邮箱）
 *    - env.MAIL_API_KEY       已配置（邮件服务 API Key）
 *      或 env.INQUIRY_WEBHOOK_URL 已配置（自建转发服务）
 *    - env.INQUIRY_DB         KV 命名空间已绑定
 *  任意一项缺失 → 接口以 HTTP 503 + code=NOT_CONFIGURED 明确拒绝，
 *  不写入、不声称成功。前端引导用户用 WhatsApp / 邮件兜底。
 * ================================================================== */

const COLLECTIONS = {
  // 字段白名单（与前端表单 name 对齐），只接收这些字段，忽略其它
  FIELDS: [
    'name', 'company', 'email', 'country', 'category', 'material',
    'thickness', 'hole', 'qty', 'printing', 'notes', 'productSku',
    'sku', 'productName', 'sourceUrl', 'scene_name', 'scene', 'page_url',
    'page_language', 'inquiry_time', 'phone', 'whatsapp'
  ],
  MAX: { notes: 4000 }
};
const DEFAULT_MAX = 300;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(body, status) {
  return new Response(JSON.stringify(body), {
    status: status || 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'access-control-allow-origin': 'same-origin',
      'x-content-type-options': 'nosniff'
    }
  });
}

function clean(v, max) {
  if (v == null) return '';
  return String(v).trim().slice(0, max || DEFAULT_MAX);
}

function clientIp(request) {
  return (request.headers.get('CF-Connecting-IP') ||
    request.headers.get('X-Forwarded-For') || '').split(',')[0].trim() || 'unknown';
}

// 服务端配置状态（只读，不返回任何密钥值）
function configState(env) {
  var toEmail = clean(env.INQUIRY_TO_EMAIL, 200);
  var apiKey = clean(env.MAIL_API_KEY, 200);
  var w3fKey = clean(env.WEB3FORMS_ACCESS_KEY, 200);
  var webhook = clean(env.INQUIRY_WEBHOOK_URL, 500);
  var hasKv = !!(env.INQUIRY_DB && typeof env.INQUIRY_DB.put === 'function');
  // Web3Forms 的 Key 已绑定收件邮箱，故有 Key 即视为“收件邮箱已配置”；
  // 否则要求显式 INQUIRY_TO_EMAIL。任一发信通道齐备即视为“邮件服务已配置”。
  var hasRecipient = !!(w3fKey || EMAIL_RE.test(toEmail));
  var hasSender = !!(w3fKey || apiKey || /^https:\/\//i.test(webhook));
  return {
    web3formsConfigured: !!w3fKey,
    recipientConfigured: hasRecipient,
    mailServiceConfigured: hasSender,
    storageConfigured: hasKv,
    deliveryEnabled: hasRecipient && hasSender && hasKv
  };
}

async function parsePayload(request) {
  var type = (request.headers.get('content-type') || '').toLowerCase();
  if (type.indexOf('application/json') >= 0) {
    var data = await request.json();
    if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('bad json');
    return data;
  }
  if (type.indexOf('multipart/form-data') >= 0 || type.indexOf('application/x-www-form-urlencoded') >= 0) {
    var fd = await request.formData();
    var out = {};
    fd.forEach(function (v, k) {
      if (typeof v === 'string') out[k] = v;
    });
    return out;
  }
  throw new Error('unsupported content-type');
}

function validate(data) {
  var errors = [];
  var name = clean(data.name, DEFAULT_MAX);
  var email = clean(data.email, 200);
  var qty = clean(data.qty, DEFAULT_MAX);
  // honeypot：隐藏字段 website/company_website 被填写即视为机器人
  if (clean(data.website, 200) || clean(data.company_website, 200)) {
    return { spam: true };
  }
  if (!name) errors.push('name');
  if (!EMAIL_RE.test(email)) errors.push('email');
  if (!qty) errors.push('qty');
  var consent = data.privacy === true || data.privacy === 'on' || data.privacy === '1' || data.privacy === 'true';
  if (!consent) errors.push('privacy');
  return { errors: errors, name: name, email: email, qty: qty };
}

function collectFields(data) {
  var fields = {};
  COLLECTIONS.FIELDS.forEach(function (k) {
    var v = data[k];
    if (v == null) return;
    fields[k] = clean(v, COLLECTIONS.MAX[k] || DEFAULT_MAX);
  });
  return fields;
}

// 基于 KV 的限流 + 去重（TTL 窗口，失败时 fail-open 但记录日志）
async function guardRate(env, ip, email) {
  var kv = env.INQUIRY_DB;
  if (!kv || typeof kv.put !== 'function') return { ok: true, skipped: true };
  var bucket = new Date().toISOString().slice(0, 13); // 按小时窗口
  var key = 'ratelimit:' + bucket + ':' + encodeURIComponent(ip);
  try {
    var current = await kv.get(key);
    var count = parseInt(current || '0', 10) || 0;
    if (count >= 12) return { ok: false, code: 'RATE_LIMITED' };
    await kv.put(key, String(count + 1), { expirationTtl: 3600 });
    return { ok: true };
  } catch (e) {
    return { ok: true, skipped: true }; // KV 写入异常不阻断投递
  }
}

async function dedupe(env, email, qty, productSku) {
  var kv = env.INQUIRY_DB;
  if (!kv || typeof kv.get !== 'function') return { ok: true, skipped: true };
  var fingerprint = [email, qty, productSku || ''].join('|').toLowerCase();
  var key = 'dedupe:' + fingerprint.replace(/[^a-z0-9|@._-]/g, '').slice(0, 120);
  try {
    var last = await kv.get(key);
    var now = Date.now();
    if (last && now - parseInt(last, 10) < 20 * 1000) return { ok: false, code: 'DUPLICATE' };
    await kv.put(key, String(now), { expirationTtl: 60 });
    return { ok: true };
  } catch (e) {
    return { ok: true, skipped: true };
  }
}

function newId() {
  try { return crypto.randomUUID(); }
  catch (e) { return 'q_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
}

function buildText(fields, meta) {
  var labelMap = {
    name: 'Name / 姓名', company: 'Company / 公司', email: 'Email / 邮箱',
    phone: 'Phone / WhatsApp / 电话', whatsapp: 'WhatsApp / 电话',
    country: 'Country / 国家', category: 'Category / 产品类别', material: 'Material / 材质',
    thickness: 'Thickness / 厚度', hole: 'Hole / 孔径', qty: 'Quantity / 数量',
    printing: 'Printing / 印刷', productSku: 'Product SKU / 型号',
    productName: 'Product / 产品', sourceUrl: 'Product link / 产品链接',
    scene_name: 'Scenario / 场景', notes: 'Notes / 需求说明',
    page_url: 'Page / 来源页面', page_language: 'Language / 语言', inquiry_time: 'Time / 时间'
  };
  var lines = ['KALOZEN Website Inquiry / 官网询盘', '------------------------------------'];
  Object.keys(labelMap).forEach(function (k) {
    if (fields[k]) lines.push(labelMap[k] + ': ' + fields[k]);
  });
  if (meta && meta.ip) lines.push('IP: ' + meta.ip);
  return lines.join('\n');
}

async function sendEmail(env, subject, text, replyTo) {
  // 路径 W：Web3Forms（推荐）——密钥仅存服务端，POST 官方 submit 接口，
  // 由该 Access Key 绑定的邮箱（应为所有者确认的 www.777910@gmail.com）收信。
  var w3fKey = clean(env.WEB3FORMS_ACCESS_KEY, 200);
  if (w3fKey) {
    var wEndpoint = clean(env.WEB3FORMS_ENDPOINT, 300) || 'https://api.web3forms.com/submit';
    var wBody = {
      access_key: w3fKey,
      subject: subject,
      message: text,
      from_name: 'KALOZEN Website Inquiry',
      botcheck: ''
    };
    // 把客户邮箱作为 reply_to / email，方便直接回复
    if (EMAIL_RE.test(replyTo || '')) {
      wBody.replyto = replyTo;
      wBody.email = replyTo;
    }
    var wr = await fetch(wEndpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify(wBody)
    });
    var wResult = null;
    try { wResult = await wr.json(); } catch (e) {}
    if (!wr.ok || !wResult || wResult.success !== true) {
      var wDetail = (wResult && (wResult.message || wResult.detail)) || ('HTTP ' + wr.status);
      throw new Error('web3forms ' + wDetail);
    }
    return 'web3forms';
  }
  // 路径 A：自建转发 webhook（可对接任意邮件服务，密钥留在服务端）
  var webhook = clean(env.INQUIRY_WEBHOOK_URL, 500);
  if (/^https:\/\//i.test(webhook)) {
    var r = await fetch(webhook, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ to: clean(env.INQUIRY_TO_EMAIL, 200), subject: subject, text: text, reply_to: replyTo })
    });
    if (!r.ok) throw new Error('webhook HTTP ' + r.status);
    return 'webhook';
  }
  // 路径 B：Resend / 兼容 API（Bearer API Key 只存服务端）
  var key = clean(env.MAIL_API_KEY, 200);
  if (key) {
    var endpoint = clean(env.MAIL_API_ENDPOINT, 300) || 'https://api.resend.com/emails';
    var from = clean(env.MAIL_FROM, 200) || 'KALOZEN Website <onboarding@resend.dev>';
    var r2 = await fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: 'Bearer ' + key },
      body: JSON.stringify({
        from: from,
        to: [clean(env.INQUIRY_TO_EMAIL, 200)],
        reply_to: replyTo,
        subject: subject,
        text: text
      })
    });
    if (!r2.ok) {
      var detail = '';
      try { detail = (await r2.json()).message || ''; } catch (e) {}
      throw new Error('mail HTTP ' + r2.status + (detail ? ' ' + detail : ''));
    }
    return 'resend';
  }
  throw new Error('no mail service configured');
}

/* -------------------- 主处理：POST /api/inquiry -------------------- */
async function handlePost(request, env) {
  var state = configState(env);

  // 门控：未配置齐全则明确拒绝，不谎报成功
  if (!state.deliveryEnabled) {
    return json({
      success: false,
      code: 'NOT_CONFIGURED',
      message: 'Inquiry delivery is not configured on the server yet. ' +
        'Required: a verified recipient email, a mail service credential, and the KV record store.',
      missing: Object.keys(state).filter(function (k) { return state[k] === false && k !== 'deliveryEnabled'; })
    }, 503);
  }

  var data;
  try { data = await parsePayload(request); }
  catch (e) { return json({ success: false, code: 'BAD_REQUEST', message: 'Invalid request body.' }, 400); }

  var v = validate(data);
  if (v.spam) {
    // 对机器人返回看似成功，但不写入、不发信
    return json({ success: true, id: 'suppressed', message: 'Thank you.' }, 200);
  }
  if (v.errors.length) {
    return json({ success: false, code: 'VALIDATION', message: 'Please check required fields.', fields: v.errors }, 422);
  }

  var ip = clientIp(request);
  var rate = await guardRate(env, ip, v.email);
  if (!rate.ok) {
    return json({ success: false, code: 'RATE_LIMITED', message: 'Too many submissions. Please try again later.' }, 429);
  }
  var dup = await dedupe(env, v.email, v.qty, clean(data.productSku || data.sku, DEFAULT_MAX));
  if (!dup.ok) {
    return json({ success: false, code: 'DUPLICATE', message: 'This inquiry was already submitted. Please do not submit twice.' }, 429);
  }

  var fields = collectFields(data);
  var id = 'INQ-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + newId().slice(0, 8).toUpperCase();
  var record = {
    id: id,
    receivedAt: new Date().toISOString(),
    status: 'received',
    fields: fields,
    meta: { ip: ip, userAgent: (request.headers.get('User-Agent') || '').slice(0, 300) }
  };

  // 1) 存储记录（KV）
  try {
    await env.INQUIRY_DB.put('inquiry:' + id, JSON.stringify(record));
  } catch (e) {
    return json({ success: false, code: 'STORE_FAILED', message: 'Could not save the inquiry record. Please try again or contact us via WhatsApp.' }, 500);
  }

  // 2) 发信（服务端，密钥不出服务端）
  var subject = 'New Inquiry - KALOZEN Website - ' + v.name + ' - ' + (fields.productSku || fields.category || 'General');
  var text = buildText(fields, record.meta);
  try {
    await sendEmail(env, subject, text, v.email);
  } catch (e) {
    // 记录已保存但发信失败：如实告知，可后续从 KV 补发
    record.status = 'stored_mail_failed';
    try { await env.INQUIRY_DB.put('inquiry:' + id, JSON.stringify(record)); } catch (e2) {}
    return json({
      success: false,
      code: 'MAIL_FAILED',
      message: 'Your inquiry was saved but the notification email could not be sent. We will follow up. Please also contact us via WhatsApp.',
      id: id
    }, 502);
  }

  return json({ success: true, id: id, message: 'Thank you! Your inquiry has been received. We will reply by email shortly.' }, 200);
}

/* -------------------- GET /api/inquiry（健康检查） -------------------- */
function handleGet(env) {
  return json({ ok: true, service: 'kalozen-inquiry-api', version: '1.0.0', config: configState(env) }, 200);
}

export async function onRequest(context) {
  var env = context.env || {};
  var method = (context.request && context.request.method) || 'GET';
  try {
    if (method === 'GET') return handleGet(env);
    if (method === 'POST') return await handlePost(context.request, env);
    return json({ success: false, code: 'METHOD_NOT_ALLOWED' }, 405);
  } catch (e) {
    return json({ success: false, code: 'SERVER_ERROR', message: 'Server error: ' + (e && e.message ? e.message : 'unknown') }, 500);
  }
}
