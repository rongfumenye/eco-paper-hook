/* ==================================================================
 * PAPERHOOK · B2B 询价表单增强
 * ------------------------------------------------------------------
 * 双轨提交：
 *   1) inquiryDeliveryEnabled=true 且 WEB3FORMS_ACCESS_KEY 已配置
 *                          → 走 Web3Forms 官方 API（网站直接提交 + 邮件通知，无需服务器）
 *   2) 否则                 → 自动降级为 mailto（打开邮件客户端，兜底可用）
 * 统一：前端验证 / 成功提示 / WhatsApp 备用 / 隐私同意 / 文件上传 / 元数据附加
 *
 * 【Access Key】只在 assets/config.js 的 WEB3FORMS_ACCESS_KEY 中维护，严禁伪造或硬编码。
 * 【启用条件】key 已填 + 邮箱已核实 + 真实提交测试成功，才可将 inquiryDeliveryEnabled 置 true。
 * ================================================================== */
(function () {
  'use strict';

  var CFG = window.PH_CONFIG || {};
  // Access Key 只从中央配置读取，代码内绝不伪造或写死。
  var WEB3FORMS_KEY = CFG.WEB3FORMS_ACCESS_KEY || '';
  // 真后端门控：开关开启“且”key 存在才走在线提交；否则一律 mailto 兜底。
  var DELIVERY_ON = (CFG.inquiryDeliveryEnabled === true) && !!WEB3FORMS_KEY;
  var RECV_EMAIL = CFG.email || '';
  var WHATSAPP = (CFG.whatsapp && CFG.whatsapp.url ? CFG.whatsapp.url : '') + '?text=';
  var submitting = false;   // 防重复提交锁

  var L = (document.documentElement.lang || 'en').toLowerCase();
  var LANG = L.indexOf('zh') === 0 ? 'zh' : L.indexOf('ru') === 0 ? 'ru'
    : L.indexOf('ar') === 0 ? 'ar' : 'en';

  var T = {
    en: {
      subject: 'Website inquiry', scene_name: 'Scene name', sku: 'Product SKU', name: 'Name', company: 'Company', email: 'Email',
      country: 'Country / Market', category: 'Product category', material: 'Material',
      thickness: 'Thickness (mm)', hole: 'Hole diameter (mm)', qty: 'Quantity (pcs)',
      printing: 'Printing / finishing', artwork: 'Artwork upload', photo: 'Product / shelf photo',
      notes: 'Notes', privacy: 'I agree to the Privacy Policy and consent to being contacted about this inquiry.',
      submit: 'Send inquiry', sending: 'Sending…', need: 'Please fill in: name, email and quantity.',
      okBackend: 'Thank you! Your inquiry has been sent — we will reply by email shortly.',
      fileType: 'Only AI, PDF, EPS, PNG, JPG files are allowed.', fileSize: 'Each file must be under 5 MB.', bot: 'Submission blocked.',
      okMailto: 'Online delivery is not yet enabled. We have prepared your inquiry in your email client — please press SEND there. If it does not open, email {MAIL} or WhatsApp {WA}. Your inquiry is only received once the email is actually sent.',
      err: 'Sending failed. Please contact us via WhatsApp {WA} or email {MAIL}.', errReal: 'Server message:',
      wa: 'WhatsApp:', email: 'Email:', file: 'File attached:'
    },
    zh: {
      subject: '官网询价', scene_name: '场景名称', sku: '产品型号 (SKU)', name: '姓名', company: '公司', email: '邮箱',
      country: '国家 / 市场', category: '需求产品', material: '纸张材质',
      thickness: '纸板厚度 (mm)', hole: '挂钩孔径 (mm)', qty: '预计数量（只）',
      printing: '印刷 / 后道工艺', artwork: '设计稿上传', photo: '产品或货架照片',
      notes: '需求说明', privacy: '我已阅读并同意隐私政策，同意就本次询价与我联系。',
      submit: '发送询价', sending: '发送中…', need: '请填写：姓名、邮箱和数量。',
      okBackend: '提交成功！我们已收到你的询价，将尽快通过邮件回复。',
      fileType: '仅支持 AI / PDF / EPS / PNG / JPG 文件。', fileSize: '单个文件不得超过 5 MB。', bot: '提交被拦截。',
      okMailto: '在线投递尚未启用。我们已在你的邮件客户端填好询价内容，请在邮件中点击发送；若未自动打开，请发送至 {MAIL} 或通过 WhatsApp {WA} 联系。只有邮件真正发出后，询价才算送达。',
      err: '提交失败，请改用 WhatsApp {WA} 或邮件 {MAIL} 联系我们。', errReal: '服务器返回：',
      wa: 'WhatsApp：', email: '邮箱：', file: '附件：'
    },
    ru: {
      subject: 'Запрос с сайта', scene_name: 'Название сценария', sku: 'Артикул (SKU)', name: 'Имя', company: 'Компания', email: 'E-mail',
      country: 'Страна / рынок', category: 'Категория продукта', material: 'Материал',
      thickness: 'Толщина (мм)', hole: 'Диаметр отверстия (мм)', qty: 'Количество, шт.',
      printing: 'Печать / отделка', artwork: 'Загрузка макета', photo: 'Фото товара / полки',
      notes: 'Комментарий', privacy: 'Я согласен с политикой конфиденциальности и на связь по этому запросу.',
      submit: 'Отправить запрос', sending: 'Отправка…', need: 'Заполните: имя, e-mail и количество.',
      okBackend: 'Спасибо! Ваш запрос отправлен — мы ответим по e-mail в ближайшее время.',
      fileType: 'Разрешены только AI, PDF, EPS, PNG, JPG.', fileSize: 'Размер файла — до 5 МБ.', bot: 'Отправка заблокирована.',
      okMailto: 'Онлайн-отправка пока не включена. Мы подготовили письмо в почтовом клиенте — нажмите ОТПРАВИТЬ. Если клиент не открылся, напишите на {MAIL} или в WhatsApp {WA}. Запрос считается полученным только после фактической отправки.',
      err: 'Не удалось отправить. Свяжитесь через WhatsApp {WA} или e-mail {MAIL}.', errReal: 'Сообщение сервера:',
      wa: 'WhatsApp:', email: 'E-mail:', file: 'Файл:'
    },
    ar: {
      subject: 'استفسار من الموقع', scene_name: 'اسم السيناريو', sku: 'رقم المنتج (SKU)', name: 'الاسم', company: 'الشركة', email: 'البريد الإلكتروني',
      country: 'البلد / السوق', category: 'فئة المنتج', material: 'الخامة',
      thickness: 'السماكة (مم)', hole: 'قطر الفتحة (مم)', qty: 'الكمية (قطعة)',
      printing: 'الطباعة / التشطيب', artwork: 'رفع التصميم', photo: 'صورة المنتج / الرف',
      notes: 'ملاحظات', privacy: 'أوافق على سياسة الخصوصية وأوافق على التواصل معي بخصوص هذا الاستفسار.',
      submit: 'إرسال الطلب', sending: 'جارٍ الإرسال…', need: 'يرجى تعبئة: الاسم والبريد والكمية.',
      okBackend: 'شكرًا! تم إرسال طلبك — سنرد عبر البريد قريبًا.',
      fileType: 'يُسمح بملفات AI وPDF وEPS وPNG وJPG فقط.', fileSize: 'حجم الملف أقل من 5 ميجابايت.', bot: 'تم حظر الإرسال.',
      okMailto: 'الإرسال الأونلاين غير مفعّل بعد. جهّزنا رسالتك في برنامج البريد — اضغط إرسال. إن لم يفتح، راسلنا على {MAIL} أو واتساب {WA}. يُعد الطلب مستلمًا فقط بعد إرسال البريد فعليًا.',
      err: 'فشل الإرسال. تواصل عبر واتساب {WA} أو البريد {MAIL}.', errReal: 'رسالة الخادم:',
      wa: 'واتساب:', email: 'البريد:', file: 'مرفق:'
    }
  };

  // 来源应用场景提示（由应用场景页询价入口 ?scene=... 带入）
  var SCENE_LABEL = {
    zh: '来源应用场景：', en: 'From application scenario: ',
    ru: 'Сценарий применения: ', ar: 'من سيناريو التطبيق: '
  };
  var SCENE_RELATED = {
    zh: '（关联型号：', en: ' (related SKUs: ',
    ru: ' (связанные модели: ', ar: ' (الطرازات ذات الصلة: '
  };
  var SCENE_CLOSE = { zh: '）', en: ')', ru: ')', ar: ')' };

  function getSceneFromUrl() {
    var m = location.search.match(/[?&]scene(?:_name)?=([^&]+)/);
    return m ? decodeURIComponent(m[1]) : '';
  }

  function q(sel, root) { return (root || document).querySelector(sel); }
  function formById(name) { return document.getElementById(name) || q('[name="' + name + '"]'); }
  function val(form, name) { var e = form.elements[name]; return e ? String(e.value || '').trim() : ''; }
  function showTip(msg, isErr) {
    var tip = document.getElementById('formTip');
    if (!tip) return;
    // 占位符替换为中央配置中的真实联系方式（不硬编码）
    var wa = (CFG.whatsapp && CFG.whatsapp.number) ? CFG.whatsapp.number : '';
    msg = String(msg).replace(/\{WA\}/g, wa).replace(/\{MAIL\}/g, RECV_EMAIL);
    if (isErr && arguments[2]) msg += '\n' + arguments[2];
    tip.style.whiteSpace = 'pre-line';
    tip.style.display = 'block';
    tip.textContent = msg;
    tip.style.color = isErr ? '#b3261e' : 'var(--green)';
  }

  window.sendInquiry = function (ev) {
    if (ev && ev.preventDefault) ev.preventDefault();
    var form = (ev && ev.target) ? ev.target : q('.form');
    if (!form) return false;
    if (submitting) return false;   // 提交中，忽略重复点击
    var t = T[LANG] || T.en;

    // 前端验证
    var name = val(form, 'name'), email = val(form, 'email'), qty = val(form, 'qty');
    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    var consent = form.elements['privacy'];
    if (!name || !emailOk || !qty || (consent && !consent.checked)) {
      showTip(t.need, true);
      return false;
    }
    // honeypot 防垃圾：隐藏字段若被填写，视为机器人 submits
    if (val(form, 'website')) {
      showTip(t.bot || 'Submission blocked.', true);
      return false;
    }
    // 文件类型与大小校验（每个 ≤5MB，白名单扩展名）
    var allowExt = /\.(ai|pdf|eps|png|jpe?g)$/i;
    var filesOk = true, sizeOk = true;
    ['artwork', 'photo'].forEach(function (k) {
      var el = form.elements[k];
      if (el && el.files && el.files.length) {
        for (var i = 0; i < el.files.length; i++) {
          if (!allowExt.test(el.files[i].name)) filesOk = false;
          if (el.files[i].size > 5 * 1024 * 1024) sizeOk = false;
        }
      }
    });
    if (!filesOk) { showTip(t.fileType, true); return false; }
    if (!sizeOk) { showTip(t.fileSize, true); return false; }

    // 汇总字段
    var pairs = [
      ['name', t.name], ['company', t.company], ['email', t.email], ['country', t.country],
      ['productSku', t.sku], ['category', t.category], ['material', t.material], ['thickness', t.thickness],
      ['hole', t.hole], ['qty', t.qty], ['printing', t.printing], ['scene_name', t.scene_name]
    ];
    var skuNow = val(form, 'productSku') || val(form, 'sku') || val(form, 'productName') || '';
    var lines = [];
    pairs.forEach(function (p) { var v = val(form, p[0]); if (v) lines.push(p[1] + ': ' + v); });
    lines.push('', t.notes + ':', val(form, 'notes'));
    // 产品详情上下文（客户从产品页带过来的型号/名称/来源链接）
    var pn = val(form, 'productName'), su = val(form, 'sourceUrl');
    if (pn) lines.push('Product: ' + pn);
    if (su) lines.push('Product link: ' + su);
    // 自动附加元数据：访问页面 / 语言 / 询盘时间 / 产品型号（两种提交路径都保留）
    lines.push('', '--- Inquiry meta ---');
    lines.push('Page: ' + location.href);
    lines.push('Language: ' + LANG);
    lines.push('Time: ' + new Date().toISOString());
    lines.push('Product SKU: ' + skuNow);
    var body = lines.join('\n');
    var subject = 'KALOZEN Website Inquiry — ' + name + ' — ' + (skuNow || val(form, 'category') || 'General');

    var btn = q('button[type=submit]', form);
    var oldLabel = btn ? btn.textContent : '';

    // 走真后端（仅当开关开启且 key 存在）
    if (DELIVERY_ON) {
      var fd = new FormData(form);
      fd.append('access_key', WEB3FORMS_KEY);
      fd.append('subject', subject);
      // 用户邮箱作为 Reply-To，方便直接回复客户
      fd.append('reply_to', email);
      fd.append('from_name', name);
      // 自动附加元数据：当前页面 / 页面语言 / 询盘时间 / 客户询问的产品型号
      fd.append('page_url', location.href);
      fd.append('page_language', LANG);
      fd.append('inquiry_time', new Date().toISOString());
      fd.append('product_sku', skuNow);
      fd.append('inquiry_summary', body);
      // 只上传已选择的文件，避免空 File 被当作无效
      ['artwork', 'photo'].forEach(function (k) {
        var el = form.elements[k];
        if (el && el.files && el.files.length) fd.append(k, el.files[0]);
      });
      submitting = true;
      if (btn) { btn.textContent = t.sending; btn.disabled = true; btn.setAttribute('aria-busy','true'); }
      function unlock() {
        submitting = false;
        if (btn) { btn.textContent = oldLabel; btn.disabled = false; btn.removeAttribute('aria-busy'); }
      }
      fetch('https://api.web3forms.com/submit', { method: 'POST', body: fd })
        .then(function (r) { return r.json().catch(function () { return null; }).then(function (j) { return { ok: r.ok, j: j }; }); })
        .then(function (res) {
          unlock();
          var j = res.j;
          if (res.ok && j && j.success) { form.reset(); showTip(t.okBackend, false); }
          else {
            var real = (j && (j.message || j.error)) ? String(j.message || j.error) : '';
            showTip(t.err, true, (t.errReal ? t.errReal + ' ' : '') + real);
          }
        })
        .catch(function (e) {
          unlock();
          showTip(t.err, true, (t.errReal ? t.errReal + ' ' : '') + (e && e.message ? e.message : ''));
        });
      return false;
    }

    // mailto 兜底（在线投递未配置时）：不声称已收到，仅说明需在邮件客户端发送
    var files = [];
    ['artwork', 'photo'].forEach(function (k) {
      var el = form.elements[k];
      if (el && el.files && el.files.length) files.push(t.file + ' ' + el.files[0].name);
    });
    if (files.length) body += '\n' + files.join('\n');
    if (RECV_EMAIL) {
      window.location.href = 'mailto:' + RECV_EMAIL
        + '?subject=' + encodeURIComponent(subject)
        + '&body=' + encodeURIComponent(body);
    }
    showTip(t.okMailto, false);
    return false;
  };

  // 初始化：按语言替换按钮文案 + 给隐私标签补链接
  document.addEventListener('DOMContentLoaded', function () {
    var t = T[LANG] || T.en;
    // —— 从 URL 查询参数回填所有字段（产品详情页 GET 跳转过来的 SKU/数量/备注等不丢失）——
    // 字段别名：productSku 也接受 sku；productName 也接受 name 之外的来源
    var backfillMap = {
      productSku: ['productSku', 'sku'],
      productName: ['productName'],
      sourceUrl: ['sourceUrl'],
      scene_name: ['scene_name', 'scene'],
      qty: ['qty'], material: ['material'], thickness: ['thickness'], hole: ['hole'],
      category: ['category'], printing: ['printing'], country: ['country'],
      name: ['name'], email: ['email'], company: ['company'], notes: ['notes']
    };
    try {
      var usp = new URLSearchParams(location.search);
      Object.keys(backfillMap).forEach(function (field) {
        var el = formById(field);
        if (!el || (el.value && String(el.value).trim())) return; // 已有值不覆盖
        var keys = backfillMap[field], found = '';
        for (var i = 0; i < keys.length; i++) {
          var v = usp.get(keys[i]);
          if (v) { found = v; break; }
        }
        if (found) el.value = found;
      });
    } catch (e) {}
    // 从详情页 ?sku=XX 自动回填
    var skuField = document.getElementById('productSku');
    if (skuField) {
      var m = location.search.match(/[?&]sku=([^&]+)/);
      if (m) {
        // 支持多 SKU（逗号分隔），去重去空
        var raw = decodeURIComponent(m[1]);
        var seen = {}, list = [];
        raw.split(',').forEach(function (x) {
          x = x.trim();
          if (x && !seen[x]) { seen[x] = 1; list.push(x); }
        });
        skuField.value = list.join(', ');
      }
    }
    // 回填来源应用场景到隐藏字段 scene_name
    var sceneField = document.getElementById('scene_name');
    if (sceneField) {
      var sn = getSceneFromUrl();
      if (sn) sceneField.value = sn;
    }
    // 在询价表单上方显示来源应用场景与关联 SKU
    var sceneName = getSceneFromUrl();
    if (sceneName) {
      var form = q('.form');
      if (form && !document.getElementById('sceneNotice')) {
        var notice = document.createElement('div');
        notice.id = 'sceneNotice';
        notice.setAttribute('role', 'note');
        notice.style.cssText = 'margin:0 0 18px;padding:12px 16px;border:1px solid var(--line);border-radius:10px;background:#f1f5ef;color:var(--forest);font-size:13px;line-height:1.7';
        var rel = skuField && skuField.value ? (SCENE_RELATED[LANG] || SCENE_RELATED.en) + skuField.value + (SCENE_CLOSE[LANG] || SCENE_CLOSE.en) : '';
        notice.textContent = (SCENE_LABEL[LANG] || SCENE_LABEL.en) + sceneName + rel;
        form.parentNode.insertBefore(notice, form);
      }
    }
    var btn = q('.form button[type=submit]');
    if (btn) btn.textContent = t.submit;
    var label = q('.form label[for=privacy], .form .privacy-label');
    if (label && !label.querySelector('a')) {
      var a = document.createElement('a');
      a.href = 'privacy.html';
      a.textContent = LANG === 'zh' ? '《隐私政策》' : 'Privacy Policy';
      a.style.color = 'var(--green)';
      label.appendChild(a);
    }
  });
})();
