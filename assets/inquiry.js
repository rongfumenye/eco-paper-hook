/* ==================================================================
 * KALOZEN · 全站询盘表单增强（第一阶段整改版）
 * ------------------------------------------------------------------
 * 提交路径：
 *   1) 统一 POST 到真实后端 CFG.inquiryEndpoint（/api/inquiry）。
 *      后端负责服务端校验、KV 记录留存、服务端发信（密钥只在服务端）。
 *   2) 后端明确返回 NOT_CONFIGURED（尚未配置收件邮箱/邮件服务/存储）时，
 *      降级为 mailto 兜底，并显示"尚未启用"说明，绝不谎报提交成功。
 *   3) 后端返回成功才显示成功提示，并派发 kalozen_inquiry_success 事件
 *      （第三阶段统计系统据此记录 generate_lead，客户点按钮不算有效询盘）。
 *
 * 【安全】前端不含任何密钥；后端配置见 docs/INQUIRY-BACKEND-SETUP.md。
 * ================================================================== */
(function () {
  'use strict';

  var CFG = window.PH_CONFIG || {};
  var ENDPOINT = CFG.inquiryEndpoint || '/api/inquiry';
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
      submit: 'Send inquiry', sending: 'Sending…', need: 'Please fill in: name, a valid email, quantity and consent.',
      okBackend: 'Thank you! Your inquiry has been received — we will reply by email shortly.',
      fileType: 'Only AI, PDF, EPS, PNG, JPG files are allowed.', fileSize: 'Each file must be under 5 MB.', bot: 'Submission blocked.',
      okMailto: 'Online delivery is not yet enabled. We have prepared your inquiry in your email client — please press SEND there. If it does not open, email {MAIL} or WhatsApp {WA}. Your inquiry is only received once the email is actually sent.',
      err: 'Sending failed. Please contact us via WhatsApp {WA} or email {MAIL}.', errReal: 'Server message:',
      dup: 'This inquiry appears to have already been submitted. Please do not send twice.',
      rate: 'Too many submissions. Please wait a moment and try again.',
      wa: 'WhatsApp:', email: 'Email:', file: 'File attached:'
    },
    zh: {
      subject: '官网询价', scene_name: '场景名称', sku: '产品型号 (SKU)', name: '姓名', company: '公司', email: '邮箱',
      country: '国家 / 市场', category: '需求产品', material: '纸张材质',
      thickness: '纸板厚度 (mm)', hole: '挂钩孔径 (mm)', qty: '预计数量（只）',
      printing: '印刷 / 后道工艺', artwork: '设计稿上传', photo: '产品或货架照片',
      notes: '需求说明', privacy: '我已阅读并同意隐私政策，同意就本次询价与我联系。',
      submit: '发送询价', sending: '发送中…', need: '请填写：姓名、有效邮箱、数量，并勾选同意。',
      okBackend: '提交成功！我们已收到你的询价，将尽快通过邮件回复。',
      fileType: '仅支持 AI / PDF / EPS / PNG / JPG 文件。', fileSize: '单个文件不得超过 5 MB。', bot: '提交被拦截。',
      okMailto: '在线投递尚未启用。我们已在你的邮件客户端填好询价内容，请在邮件中点击发送；若未自动打开，请发送至 {MAIL} 或通过 WhatsApp {WA} 联系。只有邮件真正发出后，询价才算送达。',
      err: '提交失败，请改用 WhatsApp {WA} 或邮件 {MAIL} 联系我们。', errReal: '服务器返回：',
      dup: '该询价似乎已经提交过，请勿重复提交。',
      rate: '提交过于频繁，请稍后再试。',
      wa: 'WhatsApp：', email: '邮箱：', file: '附件：'
    },
    ru: {
      subject: 'Запрос с сайта', scene_name: 'Название сценария', sku: 'Артикул (SKU)', name: 'Имя', company: 'Компания', email: 'E-mail',
      country: 'Страна / рынок', category: 'Категория продукта', material: 'Материал',
      thickness: 'Толщина (мм)', hole: 'Диаметр отверстия (мм)', qty: 'Количество, шт.',
      printing: 'Печать / отделка', artwork: 'Загрузка макета', photo: 'Фото товара / полки',
      notes: 'Комментарий', privacy: 'Я согласен с политикой конфиденциальности и на связь по этому запросу.',
      submit: 'Отправить запрос', sending: 'Отправка…', need: 'Заполните: имя, e-mail, количество и согласие.',
      okBackend: 'Спасибо! Ваш запрос получен — мы ответим по e-mail в ближайшее время.',
      fileType: 'Разрешены только AI, PDF, EPS, PNG, JPG.', fileSize: 'Размер файла — до 5 МБ.', bot: 'Отправка заблокирована.',
      okMailto: 'Онлайн-отправка пока не включена. Мы подготовили письмо в почтовом клиенте — нажмите ОТПРАВИТЬ. Если клиент не открылся, напишите на {MAIL} или в WhatsApp {WA}. Запрос считается полученным только после фактической отправки.',
      err: 'Не удалось отправить. Свяжитесь через WhatsApp {WA} или e-mail {MAIL}.', errReal: 'Сообщение сервера:',
      dup: 'Этот запрос уже был отправлен. Не отправляйте дважды.',
      rate: 'Слишком много запросов. Пожалуйста, подождите.',
      wa: 'WhatsApp:', email: 'E-mail:', file: 'Файл:'
    },
    ar: {
      subject: 'استفسار من الموقع', scene_name: 'اسم السيناريو', sku: 'رقم المنتج (SKU)', name: 'الاسم', company: 'الشركة', email: 'البريد الإلكتروني',
      country: 'البلد / السوق', category: 'فئة المنتج', material: 'الخامة',
      thickness: 'السماكة (مم)', hole: 'قطر الفتحة (مم)', qty: 'الكمية (قطعة)',
      printing: 'الطباعة / التشطيب', artwork: 'رفع التصميم', photo: 'صورة المنتج / الرف',
      notes: 'ملاحظات', privacy: 'أوافق على سياسة الخصوصية وأوافق على التواصل معي بخصوص هذا الاستفسار.',
      submit: 'إرسال الطلب', sending: 'جارٍ الإرسال…', need: 'يرجى تعبئة: الاسم والبريد والكمية والموافقة.',
      okBackend: 'شكرًا! تم استلام طلبك — سنرد عبر البريد قريبًا.',
      fileType: 'يُسمح بملفات AI وPDF وEPS وPNG وJPG فقط.', fileSize: 'حجم الملف أقل من 5 ميجابايت.', bot: 'تم حظر الإرسال.',
      okMailto: 'الإرسال الأونلاين غير مفعّل بعد. جهّزنا رسالتك في برنامج البريد — اضغط إرسال. إن لم يفتح، راسلنا على {MAIL} أو واتساب {WA}. يُعد الطلب مستلمًا فقط بعد إرسال البريد فعليًا.',
      err: 'فشل الإرسال. تواصل عبر واتساب {WA} أو البريد {MAIL}.', errReal: 'رسالة الخادم:',
      dup: 'يبدو أن هذا الطلب أُرسل مسبقًا. لا ترسل مرتين.',
      rate: 'طلبات كثيرة جدًا. يرجى الانتظار قليلاً.',
      wa: 'واتساب:', email: 'البريد:', file: 'مرفق:'
    }
  };

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
  function val(form, name) {
    var el = form.elements[name];
    if (!el) return '';
    if (el.disabled) return '';   // 未选产品类型时对应的专用字段不收集
    return String(el.value || '').trim();
  }
  function showTip(msg, isErr) {
    var tip = document.getElementById('formTip');
    if (!tip) return;
    var wa = (CFG.whatsapp && CFG.whatsapp.number) ? CFG.whatsapp.number : '';
    msg = String(msg).replace(/\{WA\}/g, wa).replace(/\{MAIL\}/g, RECV_EMAIL);
    if (isErr && arguments[2]) msg += '\n' + arguments[2];
    tip.style.whiteSpace = 'pre-line';
    tip.style.display = 'block';
    tip.textContent = msg;
    tip.style.color = isErr ? '#b3261e' : 'var(--green)';
  }

  // 派发中性事件，供第三阶段统计系统订阅（本阶段不调用任何统计 SDK）
  function fireFormStart() {
    try { window.dispatchEvent(new CustomEvent('kalozen_form_start')); } catch (e) {}
  }
  function fireSuccess(id) {
    try {
      window.dispatchEvent(new CustomEvent('kalozen_inquiry_success', {
        detail: { id: id, source: 'website' }
      }));
    } catch (e) {}
  }

  // 汇总所有客户填写字段（产品/数量/公司/联系人/邮箱/需求内容完整保留）
  function collect(form) {
    var keys = [
      'name', 'company', 'email', 'phone', 'whatsapp', 'country', 'productType', 'category', 'material',
      'thickness', 'hole', 'barDiameter', 'itemWeight', 'sizeCapacity', 'lidType', 'packReq',
      'qty', 'printing', 'notes', 'productSku', 'sku', 'productName', 'sourceUrl', 'scene_name', 'scene'
    ];
    var out = {};
    keys.forEach(function (k) { var v = val(form, k); if (v) out[k] = v; });
    var consent = form.elements['privacy'];
    out.privacy = (consent && (consent.checked || consent.value === 'on')) ? 'on' : '';
    out.page_url = location.href;
    out.page_language = LANG;
    out.inquiry_time = new Date().toISOString();
    return out;
  }

  var FIELD_LABEL = {
    zh: { name:'姓名', company:'公司', email:'邮箱', phone:'WhatsApp/电话', country:'国家/市场',
      productType:'产品类型', category:'应用行业', material:'材质', thickness:'纸板厚度(mm)',
      hole:'挂钩孔径(mm)', barDiameter:'挂杆直径(mm)', itemWeight:'商品重量(g)',
      sizeCapacity:'尺寸/容量', lidType:'盖型', packReq:'包装要求', qty:'数量',
      printing:'印刷/后道工艺', notes:'需求说明', productSku:'产品型号' },
    en: { name:'Name', company:'Company', email:'Email', phone:'WhatsApp/Phone', country:'Country/Market',
      productType:'Product type', category:'Application', material:'Material', thickness:'Board thickness (mm)',
      hole:'Hole diameter (mm)', barDiameter:'Bar diameter (mm)', itemWeight:'Item weight (g)',
      sizeCapacity:'Size/Capacity', lidType:'Lid type', packReq:'Packaging requirements', qty:'Quantity',
      printing:'Printing/finishing', notes:'Requirements', productSku:'Product SKU' }
  };
  function mailtoFallback(form, payload, t) {
    var subject = 'New Inquiry - KALOZEN Website - ' + (payload.name || '') + ' - ' + (payload.productType || payload.productSku || payload.category || 'General');
    var lines = [];
    var LABEL = FIELD_LABEL[LANG] || FIELD_LABEL.en;
    Object.keys(payload).forEach(function (k) {
      if (['privacy', 'page_url', 'page_language', 'inquiry_time'].indexOf(k) >= 0) return;
      if (payload[k]) lines.push((LABEL[k] || k) + ': ' + payload[k]);
    });
    lines.push('', 'Page: ' + payload.page_url, 'Language: ' + payload.page_language, 'Time: ' + payload.inquiry_time);
    if (RECV_EMAIL) {
      window.location.href = 'mailto:' + RECV_EMAIL
        + '?subject=' + encodeURIComponent(subject)
        + '&body=' + encodeURIComponent(lines.join('\n'));
    }
    showTip(t.okMailto, false);
  }

  window.sendInquiry = function (ev) {
    if (ev && ev.preventDefault) ev.preventDefault();
    var form = (ev && ev.target) ? ev.target : q('.form');
    if (!form) return false;
    if (submitting) return false;   // 防重复提交锁
    var t = T[LANG] || T.en;

    // —— 前端校验（必填 + 邮箱格式 + 同意）——
    var name = val(form, 'name'), email = val(form, 'email'), qty = val(form, 'qty');
    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    var consent = form.elements['privacy'];
    if (!name || !emailOk || !qty || (consent && !consent.checked)) {
      showTip(t.need, true);
      return false;
    }
    // honeypot 防垃圾
    if (val(form, 'website') || val(form, 'company_website')) {
      showTip(t.bot, true);
      return false;
    }
    // 文件类型与大小校验
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

    var payload = collect(form);
    var btn = q('button[type=submit]', form);
    var oldLabel = btn ? btn.textContent : '';
    submitting = true;
    if (btn) { btn.textContent = t.sending; btn.disabled = true; btn.setAttribute('aria-busy', 'true'); }
    function unlock() {
      submitting = false;
      if (btn) { btn.textContent = oldLabel; btn.disabled = false; btn.removeAttribute('aria-busy'); }
    }

    // —— POST 到真实后端 ——
    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'accept': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify(payload)
    })
      .then(function (r) {
        return r.json().catch(function () { return null; }).then(function (j) { return { ok: r.ok, status: r.status, j: j }; });
      })
      .then(function (res) {
        var j = res.j || {};
        // 真实成功：仅此时显示成功提示并派发 generate_lead 前置事件
        if (res.ok && j.success === true) {
          unlock();
          form.reset();
          showTip(t.okBackend, false);
          fireSuccess(j.id);
          return;
        }
        unlock();
        // 后端尚未配置，或后端接口暂未部署(404/无JSON响应) → mailto 兜底 + 明确说明
        if (j.code === 'NOT_CONFIGURED' || res.status === 404 || (!res.j && !res.ok)) {
          mailtoFallback(form, payload, t);
          return;
        }
        if (j.code === 'DUPLICATE') { showTip(t.dup, true); return; }
        if (j.code === 'RATE_LIMITED') { showTip(t.rate, true); return; }
        var real = (j.message ? String(j.message) : '');
        showTip(t.err, true, real ? (t.errReal ? t.errReal + ' ' : '') + real : '');
      })
      .catch(function (e) {
        unlock();
        // 网络层失败（后端不可达等）：明确报错，不谎报成功
        showTip(t.err, true, e && e.message ? e.message : '');
      });
    return false;
  };

  // 初始化：回填 URL 参数、按钮文案、隐私链接、form_start 事件
  document.addEventListener('DOMContentLoaded', function () {
    var t = T[LANG] || T.en;
    var backfillMap = {
      productSku: ['productSku', 'sku'],
      productName: ['productName'],
      sourceUrl: ['sourceUrl'],
      scene_name: ['scene_name', 'scene'],
      qty: ['qty'], material: ['material'], thickness: ['thickness'], hole: ['hole'],
      category: ['category'], printing: ['printing'], country: ['country'],
      name: ['name'], email: ['email'], company: ['company'], notes: ['notes'],
      phone: ['phone', 'whatsapp'], whatsapp: ['whatsapp', 'phone']
    };
    try {
      var usp = new URLSearchParams(location.search);
      Object.keys(backfillMap).forEach(function (field) {
        var el = formById(field);
        if (!el || (el.value && String(el.value).trim())) return;
        var keys = backfillMap[field], found = '';
        for (var i = 0; i < keys.length; i++) {
          var v = usp.get(keys[i]);
          if (v) { found = v; break; }
        }
        if (found) el.value = found;
      });
    } catch (e) {}
    var skuField = document.getElementById('productSku');
    if (skuField) {
      var m = location.search.match(/[?&]sku=([^&]+)/);
      if (m) {
        var raw = decodeURIComponent(m[1]);
        var seen = {}, list = [];
        raw.split(',').forEach(function (x) {
          x = x.trim();
          if (x && !seen[x]) { seen[x] = 1; list.push(x); }
        });
        skuField.value = list.join(', ');
      }
    }
    var sceneField = document.getElementById('scene_name');
    if (sceneField) {
      var sn = getSceneFromUrl();
      if (sn) sceneField.value = sn;
    }
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
    // form_start：客户首次与表单交互时派发一次
    var form = q('.form');
    if (form) {
      var started = false;
      form.addEventListener('input', function () {
        if (!started) { started = true; fireFormStart(); }
      }, { passive: true });
    }
  });
})();
