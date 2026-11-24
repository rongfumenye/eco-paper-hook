/* ==================================================================
 * KALOZEN · 联系方式运行时接管（第一阶段：恢复 WhatsApp 入口）
 * ------------------------------------------------------------------
 * 读取 config.js 的 PH_CONFIG，统一管理页面联系方式展示：
 *   - WhatsApp（已确认联系方式）：whatsapp.published=true 时显示可点击
 *     的 wa.me 链接；点击可在手机/桌面唤起 WhatsApp。
 *   - 邮箱（待核实）：仅在 verified=true 时发布；未核实前不在页面展示。
 *   - 结构化数据 email/telephone 与上述开关保持一致。
 *   - 在线投递未启用时，在询价表单上方显示明确说明（不谎称已发送）。
 * 联系方式只需在 config.js 一处维护。
 * ================================================================== */
(function () {
  'use strict';

  var C = window.PH_CONFIG;
  if (!C) return;

  var L = (document.documentElement.lang || 'en').toLowerCase();
  var LANG = L.indexOf('zh') === 0 ? 'zh' : L.indexOf('ru') === 0 ? 'ru'
    : L.indexOf('ar') === 0 ? 'ar' : 'en';

  var WA = {
    en: { label: 'WhatsApp: ', hint: ' — or use the inquiry form' },
    zh: { label: 'WhatsApp：', hint: '，或通过询价表单留言' },
    ru: { label: 'WhatsApp: ', hint: ' — или через форму запроса' },
    ar: { label: 'واتساب: ', hint: ' — أو عبر نموذج الاستفسار' }
  };
  var PENDING = {
    en: 'Please contact us via WhatsApp or email.',
    zh: '请通过 WhatsApp 或邮箱联系我们。',
    ru: 'Свяжитесь с нами через WhatsApp или e-mail.',
    ar: 'تواصل معنا عبر واتساب أو البريد الإلكتروني.'
  };
  // 匹配页面各处“联系信息待核实”占位文案（含带地址变体）
  var PLACEHOLDER_RE = /^(Contact details pending verification|联系信息待核实|Контакты уточняются|بيانات التواصل قيد التحقق)/;

  var inquiryNotice = {
    zh: '说明：网站在线直投尚未启用，提交后会调起你的邮件客户端并预填内容，请在邮件中点击发送。只有邮件真正发出，询价才会送达。',
    en: 'Note: online direct delivery is not yet enabled. Submitting opens your email client with the inquiry pre-filled — please press SEND. Your inquiry is only received once the email is actually sent.',
    ru: 'Примечание: онлайн-отправка пока не включена. Отправка откроет почтовый клиент с готовым письмом — нажмите ОТПРАВИТЬ. Запрос считается полученным только после отправки.',
    ar: 'ملاحظة: الإرسال المباشر أونلاين غير مفعّل بعد. الإرسال سيفتح برنامج البريد برسالة جاهزة — اضغط إرسال. لا يُعد الطلب مستلمًا إلا بعد إرسال البريد فعليًا.'
  };

  function waPublished() {
    return !!(C.whatsapp && C.whatsapp.published === true && C.whatsapp.url && C.whatsapp.number);
  }

  function buildContactFragment() {
    var t = WA[LANG] || WA.en;
    var frag = document.createDocumentFragment();
    var any = false;
    if (waPublished()) {
      var a = document.createElement('a');
      a.setAttribute('href', C.whatsapp.url);
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener');
      a.setAttribute('aria-label', 'WhatsApp ' + C.whatsapp.number);
      a.style.cssText = 'color:var(--green);text-decoration:none;font-weight:600';
      a.textContent = t.label + C.whatsapp.number;
      frag.appendChild(a);
      frag.appendChild(document.createTextNode(t.hint));
      any = true;
    }
    // 邮箱待核实：verified=true 才发布
    if (C.verified === true && C.email) {
      if (any) frag.appendChild(document.createTextNode(' · '));
      var em = document.createElement('a');
      em.setAttribute('href', 'mailto:' + C.email);
      em.style.cssText = 'color:var(--green);text-decoration:none;font-weight:600';
      em.textContent = C.email;
      frag.appendChild(em);
      any = true;
    }
    if (!any) frag.appendChild(document.createTextNode(PENDING[LANG] || PENDING.en));
    return frag;
  }

  // 填充“Email / 邮箱”卡片中原本为空的 <p dir="ltr"> 槽位。
  // 仅在 verified=true 且有邮箱时填入可点击 mailto；不新增节点、不改布局。
  function fillEmailCard() {
    if (C.verified !== true || !C.email) return;
    var slots = document.querySelectorAll('p[dir="ltr"]');
    for (var i = 0; i < slots.length; i++) {
      var p = slots[i];
      if (p.textContent.trim() !== '') continue; // 只填空槽
      var a = document.createElement('a');
      a.setAttribute('href', 'mailto:' + C.email);
      a.style.cssText = 'color:var(--green);text-decoration:none;font-weight:600';
      a.textContent = C.email;
      p.appendChild(a);
    }
  }

  // 投递未启用说明（保持原有行为，不谎称提交成功）
  function addInquiryNotice() {
    var form = document.querySelector('.form, .inq-form');
    if (form && C.inquiryDeliveryEnabled === false && !document.getElementById('inquiryNotice')) {
      var n = document.createElement('div');
      n.id = 'inquiryNotice';
      n.setAttribute('role', 'note');
      n.style.cssText = 'margin:14px 0 0;padding:12px 16px;border:1px solid var(--line);border-radius:10px;background:#faf6ec;color:var(--muted);font-size:12.5px;line-height:1.7';
      n.textContent = inquiryNotice[LANG] || inquiryNotice.en;
      form.parentNode.insertBefore(n, form);
    }
  }

  // 把页面各处的“待核实”占位文本替换为真实 WhatsApp 可点击入口
  function injectContactSlots() {
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    var node, targets = [];
    while ((node = walker.nextNode())) {
      if (!node.nodeValue) continue;
      var txt = node.nodeValue.trim();
      if (PLACEHOLDER_RE.test(txt)) {
        var parent = node.parentElement;
        if (parent && node.parentNode === parent) targets.push({ node: node, parent: parent });
      }
    }
    targets.forEach(function (x) {
      var slot = document.createElement('span');
      slot.className = 'contact-whatsapp-slot';
      slot.appendChild(buildContactFragment());
      try { x.parent.replaceChild(slot, x.node); } catch (e) {}
    });
  }

  // 覆盖页面中若已存在的 wa.me / mailto 锚点，指向中央配置
  function overrideAnchors() {
    if (waPublished()) {
      var wa = document.querySelectorAll('a[href*="wa.me"]');
      for (var i = 0; i < wa.length; i++) wa[i].setAttribute('href', C.whatsapp.url);
    }
    if (C.verified === true && C.email) {
      var ml = document.querySelectorAll('a[href^="mailto:"]');
      for (var j = 0; j < ml.length; j++) ml[j].setAttribute('href', 'mailto:' + C.email);
    }
  }

  // 结构化数据：电话跟随 WhatsApp 开关，邮箱跟随 verified
  function syncStructuredData() {
    var scripts = document.querySelectorAll('script[type="application/ld+json"]');
    for (var s = 0; s < scripts.length; s++) {
      try {
        var obj = JSON.parse(scripts[s].textContent);
        var changed = false;
        (function walk(o) {
          if (!o || typeof o !== 'object') return;
          if (o['@type'] === 'ContactPoint') {
            if (waPublished()) o.telephone = String(C.whatsapp.number).replace(/[^+\d]/g, '');
            else delete o.telephone;
            if (C.verified === true && C.email) o.email = C.email;
            else delete o.email;
            changed = true;
          }
          for (var k in o) if (o[k] && typeof o[k] === 'object') walk(o[k]);
        })(obj);
        if (changed) scripts[s].textContent = JSON.stringify(obj);
      } catch (e) { /* 保留原 schema，不破坏页面 */ }
    }
  }

  function apply() {
    addInquiryNotice();
    injectContactSlots();
    fillEmailCard();
    overrideAnchors();
    syncStructuredData();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply);
  } else {
    apply();
  }
})();
