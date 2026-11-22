/* ==================================================================
 * KALOZEN · 联系方式运行时接管
 * ------------------------------------------------------------------
 * 读取 config.js 的 PH_CONFIG，覆盖页面中所有硬编码的联系方式：
 *   - wa.me / mailto 链接的 href 与显示文字
 *   - schema.org 结构化数据中的 email/telephone
 * verified=false 时：隐藏所有联系方式容器，并显示"待核实"占位。
 * 这样，联系方式只需在 config.js 一处维护。
 * ================================================================== */
(function () {
  'use strict';

  var C = window.PH_CONFIG;
  if (!C) return;

  var L = (document.documentElement.lang || 'en').toLowerCase();
  var LANG = L.indexOf('zh') === 0 ? 'zh' : L.indexOf('ru') === 0 ? 'ru'
    : L.indexOf('ar') === 0 ? 'ar' : 'en';
  var pending = {
    zh: '联系信息待核实，请通过页面询价表单留言。',
    en: 'Contact details pending verification — please use the inquiry form.',
    ru: 'Контакты уточняются — используйте форму запроса.',
    ar: 'بيانات التواصل قيد التحقق — استخدم نموذج الاستفسار.'
  };

  function setHref(sel, url, text) {
    var nodes = document.querySelectorAll(sel);
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].setAttribute('href', url);
      if (text && !nodes[i].querySelector('svg')) nodes[i].textContent = text;
    }
  }

  var inquiryNotice = {
    zh: '说明：网站在线直投尚未启用，提交后会调起你的邮件客户端并预填内容，请在邮件中点击发送。只有邮件真正发出，询价才会送达。',
    en: 'Note: online direct delivery is not yet enabled. Submitting opens your email client with the inquiry pre-filled — please press SEND. Your inquiry is only received once the email is actually sent.',
    ru: 'Примечание: онлайн-отправка пока не включена. Отправка откроет почтовый клиент с готовым письмом — нажмите ОТПРАВИТЬ. Запрос считается полученным только после отправки.',
    ar: 'ملاحظة: الإرسال المباشر أونلاين غير مفعّل بعد. الإرسال سيفتح برنامج البريد برسالة جاهزة — اضغط إرسال. لا يُعد الطلب مستلمًا إلا بعد إرسال البريد فعليًا.'
  };

  function apply() {
    // 在线投递未启用：在询价表单上方显示明确说明
    var form = document.querySelector('.form');
    if (form && C.inquiryDeliveryEnabled === false && !document.getElementById('inquiryNotice')) {
      var notice = document.createElement('div');
      notice.id = 'inquiryNotice';
      notice.setAttribute('role', 'note');
      notice.style.cssText = 'margin:14px 0 0;padding:12px 16px;border:1px solid var(--line);border-radius:10px;background:#faf6ec;color:var(--muted);font-size:12.5px;line-height:1.7';
      notice.textContent = inquiryNotice[LANG] || inquiryNotice.en;
      form.parentNode.insertBefore(notice, form);
    }

    // 结构化数据里的 email/telephone
    var scripts = document.querySelectorAll('script[type="application/ld+json"]');
    for (var s = 0; s < scripts.length; s++) {
      try {
        var raw = scripts[s].textContent;
        var obj = JSON.parse(raw);
        var found = false;
        (function walk(o) {
          if (!o || typeof o !== 'object') return;
          if (o['@type'] === 'ContactPoint') {
            if (C.verified) { o.email = C.email; o.telephone = C.whatsapp.number.replace(/[^+\d]/g, ''); }
            else { delete o.email; delete o.telephone; }
            found = true;
          }
          for (var k in o) if (o[k] && typeof o[k] === 'object') walk(o[k]);
        })(obj);
        if (found) scripts[s].textContent = JSON.stringify(obj);
      } catch (e) { /* 保留原始 schema，不破坏页面 */ }
    }

    if (C.verified) {
      // 覆盖所有 wa.me 链接
      var wa = document.querySelectorAll('a[href*="wa.me"]');
      for (var i = 0; i < wa.length; i++) {
        wa[i].setAttribute('href', C.whatsapp.url);
        // 保留图标，只替换纯文字节点
        var txt = wa[i].textContent;
        if (txt.indexOf('+86') >= 0 || /whatsapp/i.test(txt) || /واتساب/.test(txt)) {
          // 若含前缀词（如 "WhatsApp "），只替换号码部分
          wa[i].innerHTML = wa[i].innerHTML.replace(/(?:\+?86[\s-]?)?155[\s-]?1560[\s-]?1979/g, (C.whatsapp.number || ''));
        }
      }
      // 覆盖所有 mailto
      var ml = document.querySelectorAll('a[href^="mailto:"]');
      for (var j = 0; j < ml.length; j++) {
        ml[j].setAttribute('href', 'mailto:' + C.email);
        ml[j].innerHTML = ml[j].innerHTML.replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, (C.email || ''));
      }
      // 覆盖非链接的纯文本号码/邮箱
      var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      var node;
      while ((node = walker.nextNode())) {
        if (node.nodeValue && node.parentElement && node.parentElement.tagName !== 'A') {
          var v = node.nodeValue
            .replace(/(?:\+?86[\s-]?)?155[\s-]?1560[\s-]?1979/g, (C.whatsapp.number || ''))
            .replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, (C.email || ''));
          if (v !== node.nodeValue) node.nodeValue = v;
        }
      }
    } else {
      // 未验证：隐藏所有联系方式元素（链接、含号码的文本块），显示占位
      var hide = document.querySelectorAll('a[href*="wa.me"], a[href^="mailto:"]');
      for (var h = 0; h < hide.length; h++) {
        var el = hide[h];
        // 若父级是包含信息的 <p>，隐藏整段
        var target = (el.parentElement && /^(P|LI|DIV)$/.test(el.parentElement.tagName)) ? el.parentElement : el;
        target.style.display = 'none';
      }
      var box = document.createElement('div');
      box.setAttribute('role', 'status');
      box.style.cssText = 'margin:14px 0;padding:12px 16px;border:1px solid var(--line);border-radius:10px;background:#faf6ec;color:var(--muted);font-size:13px';
      box.textContent = pending[LANG] || pending.en;
      var main = document.querySelector('main') || document.body;
      main.insertBefore(box, main.firstChild);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply);
  } else {
    apply();
  }
})();
