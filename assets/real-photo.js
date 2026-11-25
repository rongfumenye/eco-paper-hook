/**
 * KALOZEN 真实产品照片替换机制
 * ------------------------------------------------------------------
 * 目的：为 23 个商品建立"真实产品照片替换位置"，同时绝不把 AI 示意图
 *       标注成实拍照片，也绝不伪造客户项目照片。
 *
 * 工作方式：
 * 1) 每个产品的图片容器用 data-real-sku 标注商品编号（如 H01 / F09）。
 * 2) 真实照片集中登记在 /assets/real-photos.json（键=SKU，值=图片相对路径）。
 * 3) 只有当 JSON 中该 SKU 登记了路径、且图片真实加载成功（onload，非 404）时，
 *    才会把 AI 示意图替换为真实照片，并把该容器的 AI 标识切换为"产品实拍"。
 * 4) 任何情况下：未登记 / 文件不存在 / 加载失败 → 一律保持现有 AI 示意图和 AI 标识，
 *    不做任何"实拍"宣称。
 *
 * 标识策略：
 * - AI 示意图容器：显示"AI 示意图 / AI illustration"
 * - 真实照片容器：显示"产品实拍 / Product photo"（仅当真实文件加载成功）
 */
(function () {
  'use strict';
  var JSON_URL = '/assets/real-photos.json';
  var LABELS = {
    zh: { ai: 'AI 示意图', real: '产品实拍', pending: '实拍图待补' },
    en: { ai: 'AI illustration', real: 'Product photo', pending: 'Actual photo to be added' }
  };

  function lang() {
    var m = (location.pathname || '').match(/^\/(zh|en)\//);
    return m ? m[1] : 'en';
  }

  // 在图片容器上放置/更新一个角标，明确区分「AI 示意图」与「产品实拍」
  function ensureBadge(container, text, isReal) {
    var badge = container.querySelector('.photo-badge');
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'photo-badge';
      container.appendChild(badge);
    }
    badge.textContent = text;
    badge.classList.toggle('is-real', !!isReal);
    // 内联样式确保在无 CSS 更新时也能清晰显示
    badge.style.cssText = 'position:absolute;left:8px;top:8px;z-index:2;' +
      'font-size:11px;font-weight:700;letter-spacing:.02em;padding:3px 8px;border-radius:999px;' +
      (isReal
        ? 'background:#0e5c3a;color:#fff;'
        : 'background:rgba(14,44,36,.82);color:#fff;');
    if (getComputedStyle(container).position === 'static') {
      container.style.position = 'relative';
    }
  }

  function markPending(container, L) {
    // 未配置真实照片：保持 AI 标识（不显示"实拍"字样）
    var note = container.querySelector('.prod-concept');
    if (note && /实拍图待补|Actual photo to be added/.test(note.textContent)) {
      // 保留原有"待补"提示，文案已如实说明是 AI 示意图
      return;
    }
    ensureBadge(container, L.ai, false);
  }

  function applyReal(container, img, src, L) {
    var probe = new Image();
    probe.onload = function () {
      // 仅当图片真实加载成功后才替换并标为"产品实拍"
      img.src = src;
      img.alt = (img.getAttribute('data-real-name') || img.alt || 'KALOZEN product');
      img.setAttribute('data-photo-source', 'real');
      ensureBadge(container, L.real, true);
      var note = container.querySelector('.prod-concept');
      if (note) {
        note.textContent = L.zh ? '产品实拍照片。' : 'Real product photo.';
      }
    };
    probe.onerror = function () {
      // 文件不存在/加载失败：保持 AI 示意图，不宣称实拍
      markPending(container, L);
    };
    probe.src = src;
  }

  function init(registry) {
    var L = LABELS[lang()];
    var zh = lang() === 'zh';
    var nodes = document.querySelectorAll('[data-real-sku]');
    Array.prototype.forEach.call(nodes, function (container) {
      var sku = (container.getAttribute('data-real-sku') || '').trim();
      var img = container.querySelector('img');
      if (!sku || !img) return;
      var src = registry[sku];
      if (src && String(src).length) {
        // 路径相对于站点根，统一补前导斜杠
        if (src.charAt(0) !== '/') src = '/' + src;
        applyReal(container, img, src, { ai: L.ai, real: L.real, zh: zh });
      } else {
        markPending(container, { ai: L.ai, real: L.real, zh: zh });
      }
    });
  }

  fetch(JSON_URL, { cache: 'no-cache' })
    .then(function (r) { return r.ok ? r.json() : {}; })
    .then(init)
    .catch(function () { init({}); });
})();
