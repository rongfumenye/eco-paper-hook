/* ==================================================================
 * KALOZEN · 产品列表渲染（数据驱动，唯一来源 products-data.js）
 * ------------------------------------------------------------------
 * 页面只需放置一个 <div id="productGrid"></div>，本脚本自动把
 * 三种产品渲染成三张「整块可点击」的卡片，点击进入对应详情页。
 * 四语按 <html lang> 自动本地化。
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
  function t(x) { return (x && typeof x === 'object') ? (x[L] || x.en) : x; }

  // 本地化标签
  var LBL = {
    zh: { view:'查看规格与询价', sample:'申请样品', concept:'示意图，非产品实拍；实拍图待补。', spec:'常规参数（参考）', thickness:'厚度', hole:'孔径', load:'承重', use:'适用', from:'起订', intro:'我们只做三种钩型。选型的关键只有两件事：单件克重，和挂杆孔径——下面三款覆盖从轻薄袜品到品牌定制的全部场景。' },
    en: { view:'View specs & inquire', sample:'Request a sample', concept:'Illustration, not a product photo. Real photo to be added.', spec:'Typical specs (reference)', thickness:'Thickness', hole:'Hole', load:'Load', use:'For', from:'MOQ', intro:'We make just three hook profiles. Choosing between them comes down to two things: item weight and bar diameter — the three below cover everything from light socks to branded custom work.' },
    ru: { view:'Характеристики и запрос', sample:'Запросить образец', concept:'Иллюстрация, не фото товара. Настоящее фото будет добавлено.', spec:'Типичные параметры (справочно)', thickness:'Толщина', hole:'Отверстие', load:'Нагрузка', use:'Для', from:'От', intro:'Мы делаем всего три типа крючков. Выбор определяется двумя параметрами: весом изделия и диаметром крюка — три варианта ниже покрывают всё: от лёгких носков до брендированных заказов.' },
    ar: { view:'المواصفات والاستفسار', sample:'طلب عينة', concept:'رسم توضيحي، ليست صورة منتج. ستُضاف الصورة الحقيقية.', spec:'المواصفات المعتادة (إرشادية)', thickness:'السماكة', hole:'الفتحة', load:'الحمل', use:'لـ', from:'الحد الأدنى', intro:'نصنع ثلاثة أشكال فقط. يعتمد الاختيار على أمرين: وزن القطعة وقطر العلّاقة — تغطي الثلاثة أدناه كل شيء من الجوارب الخفيفة إلى الطلبات المخصصة.' }
  };
  var l = LBL[L] || LBL.en;

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]; }); }
  function tval(x) { return esc(t(x)); }

  function cardMarkup(p) {
    var s = p.specs || {};
    var href = 'product.html?sku=' + encodeURIComponent(p.sku);
    var bullets = (p.bullets && p.bullets[L]) ? p.bullets[L] : (p.bullets && p.bullets.en) || [];
    var imgPath = 'img-' + p.sku + '.jpg'; // 预留未来独立图；当前用公共图兜底（见 onerror）
    var commonImg = '../assets/img/' + p.image;
    return ''
      + '<article class="card reveal prod-card">'
      + '  <a class="prod-link" href="' + href + '" aria-label="' + tval(p.name) + '">'
      + '    <div class="card-media"><img src="' + commonImg + '" alt="' + tval(p.name) + '" loading="lazy" decoding="async"></div>'
      + '    <div class="prod-body">'
      + '      <div class="num">' + tval(p.code) + '</div>'
      + '      <h3>' + tval(p.name) + '</h3>'
      + '      <p class="prod-tag">' + tval(p.tagline) + '</p>'
      + '      <p class="prod-desc">' + tval(p.desc) + '</p>'
      + '      <ul class="prod-bullets">' + bullets.map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('') + '</ul>'
      + '      <div class="prod-specs">'
      + '        <span><b>' + l.thickness + ':</b> ' + esc(s.thickness || '—') + '</span>'
      + '        <span><b>' + l.hole + ':</b> ' + tval(s.hole) + '</span>'
      + '        <span><b>' + l.load + ':</b> ' + tval(s.load) + '</span>'
      + '        <span><b>' + l.use + ':</b> ' + tval(s.use) + '</span>'
      + '      </div>'
      + '      ' + (p.concept ? '<p class="prod-concept">' + l.concept + '</p>' : '')
      + '      <span class="btn primary prod-cta">' + l.view + ' <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>'
      + '    </div>'
      + '  </a>'
      + '</article>';
  }

  function init() {
    var grid = document.getElementById('productGrid');
    if (!grid) return;
    grid.innerHTML = '<div class="prod-intro reveal">' + l.intro + '</div><div class="grid-3 prod-grid">' + (P.products || []).map(cardMarkup).join('') + '</div>';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
