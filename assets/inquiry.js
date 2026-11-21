/* ==================================================================
 * PAPERHOOK · B2B 询价表单增强
 * ------------------------------------------------------------------
 * 双轨提交：
 *   1) 配置了 WEB3FORMS_KEY  → 走 Web3Forms 真后端（网站直接提交 + 邮件通知，无需服务器）
 *   2) 未配置                → 自动降级为 mailto（打开邮件客户端，兜底可用）
 * 统一：前端验证 / 成功提示 / WhatsApp 备用 / 隐私同意 / 文件上传
 *
 * 【启用真后端】到 https://web3forms.com 用收件邮箱免费申请 Access Key，
 * 填入下方 WEB3FORMS_KEY 即可。申请说明见 DEPLOY-GUIDE.md。
 * ================================================================== */
(function () {
  'use strict';

  // —— 真后端接入点（留空 = 使用 mailto 兜底）——
  var WEB3FORMS_KEY = '';            // 例：'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
  var RECV_EMAIL = '1450920332@qq.com';
  var WHATSAPP = 'https://wa.me/8615515601979?text=';

  var L = (document.documentElement.lang || 'en').toLowerCase();
  var LANG = L.indexOf('zh') === 0 ? 'zh' : L.indexOf('ru') === 0 ? 'ru'
    : L.indexOf('ar') === 0 ? 'ar' : 'en';

  var T = {
    en: {
      subject: 'Website inquiry', name: 'Name', company: 'Company', email: 'Email',
      country: 'Country / Market', category: 'Product category', material: 'Material',
      thickness: 'Thickness (mm)', hole: 'Hole diameter (mm)', qty: 'Quantity (pcs)',
      printing: 'Printing / finishing', artwork: 'Artwork upload', photo: 'Product / shelf photo',
      notes: 'Notes', privacy: 'I agree to the Privacy Policy and consent to being contacted about this inquiry.',
      submit: 'Send inquiry', sending: 'Sending…', need: 'Please fill in: name, email and quantity.',
      okBackend: 'Thank you! Your inquiry has been sent — we will reply by email shortly.',
      okMailto: 'Your email client is opening with the inquiry filled in. If it does not open, email ' + RECV_EMAIL + ' or WhatsApp us.',
      err: 'Sending failed. Please contact us via WhatsApp +86 155 1560 1979 or email ' + RECV_EMAIL + '.',
      wa: 'WhatsApp:', email: 'Email:', file: 'File attached:'
    },
    zh: {
      subject: '官网询价', name: '姓名', company: '公司', email: '邮箱',
      country: '国家 / 市场', category: '需求产品', material: '纸张材质',
      thickness: '纸板厚度 (mm)', hole: '挂钩孔径 (mm)', qty: '预计数量（只）',
      printing: '印刷 / 后道工艺', artwork: '设计稿上传', photo: '产品或货架照片',
      notes: '需求说明', privacy: '我已阅读并同意隐私政策，同意就本次询价与我联系。',
      submit: '发送询价', sending: '发送中…', need: '请填写：姓名、邮箱和数量。',
      okBackend: '提交成功！我们已收到你的询价，将尽快通过邮件回复。',
      okMailto: '已调起邮件客户端并填好内容。若未自动打开，请发送至 ' + RECV_EMAIL + ' 或通过 WhatsApp 联系我们。',
      err: '提交失败，请改用 WhatsApp +86 155 1560 1979 或邮件 ' + RECV_EMAIL + ' 联系我们。',
      wa: 'WhatsApp：', email: '邮箱：', file: '附件：'
    },
    ru: {
      subject: 'Запрос с сайта', name: 'Имя', company: 'Компания', email: 'E-mail',
      country: 'Страна / рынок', category: 'Категория продукта', material: 'Материал',
      thickness: 'Толщина (мм)', hole: 'Диаметр отверстия (мм)', qty: 'Количество, шт.',
      printing: 'Печать / отделка', artwork: 'Загрузка макета', photo: 'Фото товара / полки',
      notes: 'Комментарий', privacy: 'Я согласен с политикой конфиденциальности и на связь по этому запросу.',
      submit: 'Отправить запрос', sending: 'Отправка…', need: 'Заполните: имя, e-mail и количество.',
      okBackend: 'Спасибо! Ваш запрос отправлен — мы ответим по e-mail в ближайшее время.',
      okMailto: 'Открывается почтовый клиент с готовым письмом. Если он не открылся, напишите на ' + RECV_EMAIL + ' или в WhatsApp.',
      err: 'Не удалось отправить. Свяжитесь через WhatsApp +86 155 1560 1979 или e-mail ' + RECV_EMAIL + '.',
      wa: 'WhatsApp:', email: 'E-mail:', file: 'Файл:'
    },
    ar: {
      subject: 'استفسار من الموقع', name: 'الاسم', company: 'الشركة', email: 'البريد الإلكتروني',
      country: 'البلد / السوق', category: 'فئة المنتج', material: 'الخامة',
      thickness: 'السماكة (مم)', hole: 'قطر الفتحة (مم)', qty: 'الكمية (قطعة)',
      printing: 'الطباعة / التشطيب', artwork: 'رفع التصميم', photo: 'صورة المنتج / الرف',
      notes: 'ملاحظات', privacy: 'أوافق على سياسة الخصوصية وأوافق على التواصل معي بخصوص هذا الاستفسار.',
      submit: 'إرسال الطلب', sending: 'جارٍ الإرسال…', need: 'يرجى تعبئة: الاسم والبريد والكمية.',
      okBackend: 'شكرًا! تم إرسال طلبك — سنرد عبر البريد قريبًا.',
      okMailto: 'سيُفتح برنامج البريد مع رسالة جاهزة. إن لم يفتح، راسلنا على ' + RECV_EMAIL + ' أو واتساب.',
      err: 'فشل الإرسال. تواصل عبر واتساب ‎+86 155 1560 1979 أو البريد ' + RECV_EMAIL + '.',
      wa: 'واتساب:', email: 'البريد:', file: 'مرفق:'
    }
  };

  function q(sel, root) { return (root || document).querySelector(sel); }
  function val(form, name) { var e = form.elements[name]; return e ? String(e.value || '').trim() : ''; }
  function showTip(msg, isErr) {
    var tip = document.getElementById('formTip');
    if (!tip) return;
    tip.style.display = 'block';
    tip.textContent = msg;
    tip.style.color = isErr ? '#b3261e' : 'var(--green)';
  }

  window.sendInquiry = function (ev) {
    if (ev && ev.preventDefault) ev.preventDefault();
    var form = (ev && ev.target) ? ev.target : q('.form');
    if (!form) return false;
    var t = T[LANG] || T.en;

    // 前端验证
    var name = val(form, 'name'), email = val(form, 'email'), qty = val(form, 'qty');
    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    var consent = form.elements['privacy'];
    if (!name || !emailOk || !qty || (consent && !consent.checked)) {
      showTip(t.need, true);
      return false;
    }

    // 汇总字段
    var pairs = [
      ['name', t.name], ['company', t.company], ['email', t.email], ['country', t.country],
      ['category', t.category], ['material', t.material], ['thickness', t.thickness],
      ['hole', t.hole], ['qty', t.qty], ['printing', t.printing]
    ];
    var lines = [];
    pairs.forEach(function (p) { var v = val(form, p[0]); if (v) lines.push(t[p[0]] + ': ' + v); });
    lines.push('', t.notes + ':', val(form, 'notes'));
    var body = lines.join('\n');
    var subject = t.subject + ' — ' + (val(form, 'category') || 'Paper hooks') + ' — ' + name;

    var btn = q('button[type=submit]', form);
    var oldLabel = btn ? btn.textContent : '';

    // 走真后端
    if (WEB3FORMS_KEY) {
      var fd = new FormData(form);
      fd.append('access_key', WEB3FORMS_KEY);
      fd.append('subject', subject);
      // 只上传已选择的文件，避免空 File 被当作无效
      ['artwork', 'photo'].forEach(function (k) {
        var el = form.elements[k];
        if (el && el.files && el.files.length) fd.append(k, el.files[0]);
      });
      if (btn) { btn.textContent = t.sending; btn.disabled = true; }
      fetch('https://api.web3forms.com/submit', { method: 'POST', body: fd })
        .then(function (r) { return r.json(); })
        .then(function (j) {
          if (btn) { btn.textContent = oldLabel; btn.disabled = false; }
          if (j && j.success) { form.reset(); showTip(t.okBackend, false); }
          else showTip(t.err, true);
        })
        .catch(function () {
          if (btn) { btn.textContent = oldLabel; btn.disabled = false; }
          showTip(t.err, true);
        });
      return false;
    }

    // mailto 兜底
    var waText = encodeURIComponent(subject + '\n' + body);
    var files = [];
    ['artwork', 'photo'].forEach(function (k) {
      var el = form.elements[k];
      if (el && el.files && el.files.length) files.push(t.file + ' ' + el.files[0].name);
    });
    if (files.length) body += '\n' + files.join('\n');
    window.location.href = 'mailto:' + RECV_EMAIL
      + '?subject=' + encodeURIComponent(subject)
      + '&body=' + encodeURIComponent(body);
    showTip(t.okMailto + ' ' + t.wa + ' ' + WHATSAPP.slice(0, 24) + '…', false);
    return false;
  };

  // 初始化：按语言替换按钮文案 + 给隐私标签补链接
  document.addEventListener('DOMContentLoaded', function () {
    var t = T[LANG] || T.en;
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
