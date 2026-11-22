/* ==================================================================
 * KALOZEN · 产品中心列表渲染（数据驱动，唯一来源 products-data.js）
 * ------------------------------------------------------------------
 * 统一口径：展示 14 款在售 SKU（H01–H08 纸质挂钩 + B01–B06 纸质挂板），
 * 与产品详情页完全一致。每张卡片整块可点击，进入对应 SKU 详情页。
 * 四语按 <html lang> 自动本地化；缺语种回退英文。
 * 图片均为示意图，非实拍。
 * ================================================================== */
(function () {
  'use strict';

  var P = window.PH_PRODUCTS;
  if (!P) return;

  function currentLang() {
    var l = (document.documentElement.lang || 'en').toLowerCase();
    if (l.indexOf('zh') === 0) return 'zh';
    if (l.indexOf('ru') === 0) return 'ru';
    if (l.indexOf('ar') === 0) return 'ar';
    return 'en';
  }
  var L = currentLang();
  function t(x) { return (x && typeof x === 'object') ? (x[L] || x.en || x.zh) : x; }

  var LBL = {
    zh: {
      view: '查看规格与询价',
      concept: '示意图，非产品实拍；实拍图待补。',
      typeHook: '纸质挂钩', typeBoard: '纸质挂板',
      spec: '结构与适用', use: '适用场景',
      intro: '以下为 14 款在售 SKU：H01–H08 为纸质挂钩，B01–B06 为纸质挂板。尺寸、厚度、孔径等精确参数标注「待确认」，请以规格书与样品为准。'
    },
    en: {
      view: 'View specs & inquire',
      concept: 'Illustration, not a product photo. Real photo to be added.',
      typeHook: 'Paper hook', typeBoard: 'Display board',
      spec: 'Structure & use', use: 'Applications',
      intro: 'Below are 14 SKUs currently available: H01–H08 paper hooks and B01–B06 display boards. Exact dimensions, thickness and hole sizes are marked "To be confirmed" — please refer to the spec sheet and samples.'
    },
    ru: {
      view: 'Характеристики и запрос',
      concept: 'Иллюстрация, не фото товара. Настоящее фото будет добавлено.',
      typeHook: 'Бумажный крючок', typeBoard: 'Дисплейная пластина',
      spec: 'Структура и применение', use: 'Применение',
      intro: 'Ниже 14 артикулов в наличии: H01–H08 бумажные крючки, B01–B06 дисплейные пластины. Точные размеры, толщина и диаметр отверстия обозначены «уточняется» — ориентируйтесь на спецификацию и образцы.'
    },
    ar: {
      view: 'المواصفات والاستفسار',
      concept: 'رسم توضيحي، ليست صورة منتج. ستُضاف الصورة الحقيقية.',
      typeHook: 'خطاف ورقي', typeBoard: 'لوحة عرض',
      spec: 'الهيكل والاستخدام', use: 'أماكن الاستخدام',
      intro: 'فيما يلي 14 منتجًا متاحًا: H01–H08 خطافات ورقية، B01–B06 لوحات عرض. الأبعاد والسماكة وقطر الفتحة الدقيقة موسومة بـ«قيد التحقق» — يُرجى الرجوع إلى المواصفات والعينات.'
    }
  };
  var l = LBL[L] || LBL.en;

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]; }); }
  function tval(x) { return esc(t(x)); }

  function cardMarkup(d) {
    var sku = d.sku;
    var href = 'product.html?sku=' + encodeURIComponent(sku);
    var typeLabel = d.type === 'board' ? l.typeBoard : l.typeHook;
    var use = d.use ? tval(d.use) : '—';
    var feat = d.features ? tval(d.features) : '';
    var commonImg = '../assets/img/' + d.image;
    return ''
      + '<article class="card reveal prod-card">'
      + '  <a class="prod-link" href="' + href + '" aria-label="' + tval(d.name) + '">'
      + '    <div class="card-media"><img src="' + commonImg + '" alt="' + tval(d.name) + ' (' + sku + '), illustrative image" loading="lazy" decoding="async"></div>'
      + '    <div class="prod-body">'
      + '      <div class="num">' + esc(sku) + ' · ' + esc(typeLabel) + '</div>'
      + '      <h3>' + tval(d.name) + '</h3>'
      + '      <p class="prod-desc" style="font-size:13px;line-height:1.6">' + feat + '</p>'
      + '      <div class="prod-specs">'
      + '        <span><b>' + l.use + ':</b> ' + use + '</span>'
      + '      </div>'
      + '      ' + (d.concept ? '<p class="prod-concept">' + l.concept + '</p>' : '')
      + '      <span class="btn primary prod-cta">' + l.view + ' <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>'
      + '    </div>'
      + '  </a>'
      + '</article>';
  }

  function init() {
    var grid = document.getElementById('productGrid');
    if (!grid) return;
    // 取 14 款在售 SKU（H01–H08 + B01–B06），按编号排序；P01–P03 仅兼容旧链接，不展示
    var all = P.skus || {};
    var list = Object.keys(all)
      .filter(function (k) { return /^(H0[1-8]|B0[1-6])$/.test(k); })
      .sort()
      .map(function (k) { return all[k]; });
    grid.innerHTML = '<div class="prod-intro reveal">' + l.intro + '</div>'
      + '<div class="grid-3 prod-grid">' + list.map(cardMarkup).join('') + '</div>';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
