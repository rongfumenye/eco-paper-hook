/* ==================================================================
 * KALOZEN · 产品详情页渲染（数据驱动，唯一来源 products-data.js）
 * ------------------------------------------------------------------
 * 读取 ?sku=P01/P02/P03，渲染产品名、图、卖点、规格、询价链接。
 * 四语按 <html lang> 自动本地化。四语 product.html 共用此脚本。
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
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]; }); }

  var LBL = {
    zh:{ use:'推荐应用：', tagline:'', bullets:'产品要点', inquire:'咨询这款产品 →', sample:'申请样品', whatsapp:'WhatsApp：', concept:'示意图，非产品实拍；实拍图待补。', specTitle:'常规规格（参考区间）', specNote:'以上为常规生产区间（参考值），非逐款实测数据；精确参数请索取规格书与样品。', back:'返回产品中心', notfound:'未找到该产品，已显示默认产品。' },
    en:{ use:'Recommended for: ', bullets:'Key features', inquire:'Inquire about this item →', sample:'Request a sample', whatsapp:'WhatsApp:', concept:'Illustration, not a product photo. Real photo to be added.', specTitle:'Typical specifications (reference)', specNote:'Values are typical production ranges (reference), not per-item tested data; request a spec sheet and samples for exact figures.', back:'Back to products', notfound:'Product not found — showing the default item.' },
    ru:{ use:'Применение: ', bullets:'Ключевые особенности', inquire:'Запросить этот товар →', sample:'Запросить образец', whatsapp:'WhatsApp:', concept:'Иллюстрация, не фото товара. Настоящее фото будет добавлено.', specTitle:'Типичные характеристики (справочно)', specNote:'Значения — отраслевые диапазоны (справочно), не измерения по каждой модели; запросите спецификацию и образцы.', back:'К продукции', notfound:'Товар не найден — показан стандартный.' },
    ar:{ use:'الاستخدام الموصى به: ', bullets:'المزايا الرئيسية', inquire:'الاستفسار عن هذا المنتج →', sample:'طلب عينة', whatsapp:'واتساب:', concept:'رسم توضيحي، ليست صورة منتج. ستُضاف الصورة الحقيقية.', specTitle:'المواصفات المعتادة (إرشادية)', specNote:'القيم نطاقات إنتاج معتادة (إرشادية)، ليست قياسات لكل نوع؛ اطلب ورقة المواصفات والعينات.', back:'العودة للمنتجات', notfound:'لم يُعثر على المنتج — تم عرض المنتج الافتراضي.' }
  };
  var l = LBL[L] || LBL.en;

  function byId(id) { return document.getElementById(id); }

  function init() {
    var sku = new URLSearchParams(location.search).get('sku') || 'P01';
    var d = P.skus[sku];
    if (!d) { d = P.skus.P01; sku = 'P01'; }
    var c = P.common;

    // 标题、面包屑
    document.title = t(d.name) + ' | KALOZEN';
    if (byId('crumbSku')) byId('crumbSku').textContent = t(d.name);
    if (byId('pName')) byId('pName').textContent = t(d.name);
    if (byId('pCat')) byId('pCat').textContent = t(d.code);

    // 图片
    var img = byId('pImg');
    if (img) { img.src = '../assets/img/' + d.image; img.alt = t(d.name); }
    var note = byId('conceptNote');
    if (note) { if (d.concept) note.textContent = l.concept; else note.style.display = 'none'; }

    // 推荐应用 + tagline + 描述 + 卖点（插入到 pUse 之后）
    var useEl = byId('pUse');
    if (useEl) {
      useEl.textContent = l.use + t(d.specs.use);
      var extra = document.createElement('div');
      extra.innerHTML = ''
        + '<p style="margin-top:8px;font-size:14px;color:var(--forest-2);font-weight:600">' + esc(t(d.tagline)) + '</p>'
        + '<p style="margin-top:8px;font-size:14px;color:var(--ink-2);line-height:1.75">' + esc(t(d.desc)) + '</p>'
        + '<div style="margin-top:16px"><div class="kicker" style="font-size:11px;letter-spacing:.18em;color:var(--kraft);font-weight:600;margin-bottom:10px">' + l.bullets + '</div>'
        + '<ul class="list check">' + (d.bullets && (d.bullets[L] || d.bullets.en) || []).map(function(b){return '<li>'+esc(b)+'</li>';}).join('') + '</ul></div>';
      useEl.parentNode.insertBefore(extra, useEl.nextSibling);
    }

    // 规格表
    var specs = [
      [ {zh:'材质',en:'Material',ru:'Материал',ar:'الخامة'}[L], t(c.material) ],
      [ {zh:'厚度',en:'Thickness',ru:'Толщина',ar:'السماكة'}[L], esc(d.specs.thickness) ],
      [ {zh:'孔径',en:'Hole diameter',ru:'Диаметр отверстия',ar:'قطر الفتحة'}[L], t(d.specs.hole) ],
      [ {zh:'克重',en:'Grammage',ru:'Плотность',ar:'الوزن'}[L], c.gsm ],
      [ {zh:'承重（静态/干燥）',en:'Load (static/dry)',ru:'Нагрузка (стат./сухо)',ar:'الحمل (ساكن/جاف)'}[L], t(d.specs.load) ],
      [ {zh:'起订量 (MOQ)',en:'MOQ',ru:'Мин. заказ',ar:'الحد الأدنى'}[L], t(c.moq) ],
      [ {zh:'打样交期',en:'Sample lead time',ru:'Срок образца',ar:'مدة العينة'}[L], t(c.sampleLead) ],
      [ {zh:'量产交期',en:'Production lead time',ru:'Срок производства',ar:'مدة الإنتاج'}[L], t(c.productionLead) ],
      [ {zh:'印刷',en:'Printing',ru:'Печать',ar:'الطباعة'}[L], t(c.printing) ],
      [ {zh:'表面工艺',en:'Finishing',ru:'Отделка',ar:'التشطيب'}[L], t(c.finish) ],
      [ {zh:'包装',en:'Packaging',ru:'Упаковка',ar:'التغليف'}[L], c.pack ]
    ];
    var tb = byId('pSpecs');
    if (tb) tb.innerHTML = specs.map(function(r){return '<tr><td><b>'+r[0]+'</b></td><td>'+r[1]+'</td></tr>';}).join('');
    var specNote = byId('pSpecNote');
    if (specNote) specNote.textContent = t(c.specNature);

    // 询价按钮带 SKU、文案本地化
    var inq = byId('pInquiry');
    if (inq) { inq.href = 'contact.html?sku=' + sku; inq.innerHTML = esc(l.inquire) + ' <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'; }
    var smp = byId('pSample');
    if (smp) smp.textContent = l.sample;

    // 返回链接
    var back = byId('pBack');
    if (back) { back.textContent = '← ' + l.back; back.href = 'products.html'; }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
