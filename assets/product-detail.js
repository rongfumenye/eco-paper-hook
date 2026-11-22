/* ==================================================================
 * KALOZEN · 产品详情页渲染（数据驱动，唯一来源 products-data.js）
 * ------------------------------------------------------------------
 * 读取 ?sku=XX（H01–H08 / B01–B06 / P01–P03），按当前语言渲染 12 字段。
 * 四语按 <html lang> 本地化；未确认参数由数据层标注「待确认」。
 *
 * 【健壮性加固 · 2026-11】
 *  - SKU 读取：location.search -> location.hash -> href 正则 三级兜底，
 *    兼容 /product.html?sku= 与 307 后的 /product?sku=。
 *  - 数据缺失：不再静默 return；显示明确错误提示并给出返回链接。
 *  - 可被内联兜底渲染器复用：window.renderProductDetail(sku, data, common)。
 * ================================================================== */
(function () {
  'use strict';

  var P = window.PH_PRODUCTS;

  function currentLang() {
    var l = (document.documentElement.lang || 'en').toLowerCase();
    if (l.indexOf('zh') === 0) return 'zh';
    if (l.indexOf('ru') === 0) return 'ru';
    if (l.indexOf('ar') === 0) return 'ar';
    return 'en';
  }
  var L = currentLang();
  function t(x, lang) {
    lang = lang || L;
    return (x && typeof x === 'object') ? (x[lang] || x.en || x.zh) : x;
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]; }); }

  var LBL = {
    zh:{
      sku:'SKU 编号', nameZh:'中文名称', nameEn:'英文名称', features:'结构与特点', use:'适用场景',
      dimensions:'产品尺寸', material:'纸张材质', thickness:'厚度', hole:'孔位 / 挂孔规格',
      printing:'印刷及表面工艺', customizable:'可定制内容',
      specTitle:'产品规格', concept:'示意图，非产品实拍；实拍图待补。',
      inquire:'Request a Quote', back:'返回产品中心',
      notfound:'未找到该 SKU，请从产品中心选择产品。',
      nodata:'产品数据未能加载。请刷新页面（Ctrl+F5 / Cmd+Shift+R）后重试，或从产品中心重新进入。',
      inqTitle:'询价此款产品', inqIntro:'已自动带入以下产品信息，你只需补充需求：',
      carryName:'产品名称', fQty:'Required Quantity · 需求数量', fMat:'Material · 材质', fThk:'Thickness · 厚度',
      fDesign:'Custom Design · 定制设计', fPrint:'Printing Requirements · 印刷要求', fAdd:'Additional Requirements · 其他要求',
      fName:'姓名', fEmail:'邮箱', fCompany:'公司', fSubmit:'发送询价', fNeed:'请填写：姓名、邮箱、需求数量。',
      fOk:'说明：在线直投未启用，提交后将调起邮件客户端并预填内容，请在邮件中点击发送。',
      source:'当前产品链接', privacy:'我已阅读并同意隐私政策，同意就本次询价与我联系。'
    },
    en:{
      sku:'SKU', nameZh:'Chinese name', nameEn:'English name', features:'Structure & Features', use:'Applications',
      dimensions:'Dimensions', material:'Board material', thickness:'Thickness', hole:'Hole / hanging spec',
      printing:'Printing & finishing', customizable:'Customisation options',
      specTitle:'Product specifications', concept:'Illustration, not a real product photo. Actual photo to be added.',
      inquire:'Request a Quote', back:'Back to products',
      notfound:'SKU not found. Please choose a product from the product centre.',
      nodata:'Product data could not be loaded. Please hard-refresh (Ctrl+F5 / Cmd+Shift+R) and retry, or re-enter from the product centre.',
      inqTitle:'Inquire about this item', inqIntro:'Product details are filled in for you — just add your requirements:',
      carryName:'Product name', fQty:'Required Quantity', fMat:'Material', fThk:'Thickness',
      fDesign:'Custom Design', fPrint:'Printing Requirements', fAdd:'Additional Requirements',
      fName:'Name', fEmail:'Email', fCompany:'Company', fSubmit:'Send inquiry', fNeed:'Please fill in: name, email and quantity.',
      fOk:'Note: online direct delivery is not enabled. Submitting opens your email client with the inquiry pre-filled — please press SEND.',
      source:'Current product link', privacy:'I agree to the Privacy Policy and consent to being contacted about this inquiry.'
    },
    ru:{
      sku:'Артикул', nameZh:'Китайское название', nameEn:'Английское название', features:'Структура и особенности', use:'Применение',
      dimensions:'Размеры', material:'Материал картона', thickness:'Толщина', hole:'Отверстие / крепление',
      printing:'Печать и отделка', customizable:'Варианты настройки',
      specTitle:'Характеристики товара', concept:'Иллюстрация, не фото товара.',
      inquire:'Request a Quote', back:'К продукции',
      notfound:'Артикул не найден. Выберите товар в каталоге.',
      nodata:'Не удалось загрузить данные товара. Обновите страницу (Ctrl+F5 / Cmd+Shift+R) или откройте товар из каталога.',
      inqTitle:'Запрос по товару', inqIntro:'Данные товара заполнены — добавьте свои требования:',
      carryName:'Название товара', fQty:'Требуемое количество', fMat:'Материал', fThk:'Толщина',
      fDesign:'Индивидуальный дизайн', fPrint:'Требования к печати', fAdd:'Дополнительные требования',
      fName:'Имя', fEmail:'E-mail', fCompany:'Компания', fSubmit:'Отправить запрос', fNeed:'Заполните: имя, e-mail и количество.',
      fOk:'Онлайн-отправка не включена — откроется почтовый клиент, нажмите ОТПРАВИТЬ.',
      source:'Ссылка на товар', privacy:'Я согласен с политикой конфиденциальности.'
    },
    ar:{
      sku:'SKU', nameZh:'الاسم الصيني', nameEn:'الاسم الإنجليزي', features:'الهيكل والمميزات', use:'أماكن الاستخدام',
      dimensions:'الأبعاد', material:'مادة الورق', thickness:'السماكة', hole:'الفتحة / التعليق',
      printing:'الطباعة والتشطيب', customizable:'خيارات التخصيص',
      specTitle:'مواصفات المنتج', concept:'رسم توضيحي، ليس صورة منتج حقيقية.',
      inquire:'Request a Quote', back:'العودة للمنتجات',
      notfound:'لم يُعثر على SKU. اختر منتجًا من قائمة المنتجات.',
      nodata:'تعذّر تحميل بيانات المنتج. حدّث الصفحة (Ctrl+F5 / Cmd+Shift+R) أو افتح المنتج من القائمة.',
      inqTitle:'استفسار عن هذا المنتج', inqIntro:'تم تعبئة بيانات المنتج — أضف متطلباتك فقط:',
      carryName:'اسم المنتج', fQty:'الكمية المطلوبة', fMat:'المادة', fThk:'السماكة',
      fDesign:'التصميم المخصص', fPrint:'متطلبات الطباعة', fAdd:'متطلبات إضافية',
      fName:'الاسم', fEmail:'البريد الإلكتروني', fCompany:'الشركة', fSubmit:'إرسال الاستفسار', fNeed:'يرجى تعبئة: الاسم والبريد والكمية.',
      fOk:'الإرسال المباشر غير مفعّل — سيفتح برنامج البريد، اضغط إرسال.',
      source:'رابط المنتج الحالي', privacy:'أوافق على سياسة الخصوصية.'
    }
  };
  var l = LBL[L] || LBL.en;

  function byId(id) { return document.getElementById(id); }

  // —— SKU 三级兜底读取 ——
  function readSku() {
    var s = '';
    try { s = new URLSearchParams(location.search).get('sku') || ''; } catch (e) {}
    if (!s && location.hash) {
      try { s = new URLSearchParams(location.hash.replace(/^#\/?/, '')).get('sku') || ''; } catch (e) {}
    }
    if (!s) {
      var m = String(location.href).match(/[?&]sku=([^&#]+)/i);
      if (m) s = decodeURIComponent(m[1]);
    }
    return String(s || '').trim().toUpperCase();
  }

  // —— 错误态渲染（保证任何情况下不留空占位） ——
  function renderMessage(msg) {
    var nm = byId('pName'); if (nm) nm.textContent = msg;
    var cr = byId('crumbSku'); if (cr) cr.textContent = '—';
    var intro = byId('pIntro'); if (intro) intro.innerHTML = '<div class="detail-block"><p>' + esc(msg) + '</p></div>';
    var sp = byId('pSpecs'); if (sp) sp.innerHTML = '';
    var cu = byId('pCustom'); if (cu) cu.innerHTML = '';
    var img = byId('pImg'); if (img) img.style.display = 'none';
    var note = byId('conceptNote'); if (note) note.style.display = 'none';
  }

  // —— 核心渲染：供本文件与外部内联兜底复用 ——
  window.renderProductDetail = function (sku, d, common) {
    common = common || {};
    if (byId('crumbSku')) byId('crumbSku').textContent = sku + ' · ' + t(d.name);
    if (byId('pName')) byId('pName').textContent = t(d.name);
    document.title = t(d.name) + ' (' + sku + ') | KALOZEN';

    var img = byId('pImg');
    if (img) {
      img.style.display = '';
      img.src = (/^https?:|^\//.test(d.image) ? d.image : '../assets/img/' + d.image);
      img.alt = t(d.name) + ' (' + sku + '), illustrative image';
    }
    var note = byId('conceptNote');
    if (note) {
      note.style.display = '';
      var cn = common.conceptNote || (window.PH_PRODUCTS && window.PH_PRODUCTS.common && window.PH_PRODUCTS.common.conceptNote);
      note.textContent = t(cn) || l.concept;
    }

    var intro = byId('pIntro');
    if (intro) {
      intro.innerHTML = ''
        + '<div class="detail-sku"><span class="detail-sku-label">' + l.sku + '</span><b>' + esc(sku) + '</b></div>'
        + '<div class="detail-nameline"><span class="kicker">' + l.nameZh + '</span><p>' + esc((d.name && d.name.zh) || '') + '</p>'
        + '<span class="kicker" style="margin-top:10px;display:block">' + l.nameEn + '</span><p>' + esc((d.name && d.name.en) || '') + '</p></div>'
        + '<div class="detail-block"><div class="kicker">' + l.features + '</div><p>' + esc(t(d.features)) + '</p></div>'
        + '<div class="detail-block"><div class="kicker">' + l.use + '</div><p>' + esc(t(d.use)) + '</p></div>';
    }

    var tbc = { zh:'待确认', en:'To be confirmed', ru:'Уточняется', ar:'قيد التحقق' };
    var rows = [
      [l.sku, sku],
      [l.nameZh, (d.name && d.name.zh) || ''],
      [l.nameEn, (d.name && d.name.en) || ''],
      [l.dimensions, t(d.dimensions) || tbc[L]],
      [l.material, t(d.material) || tbc[L]],
      [l.thickness, t(d.thickness) || tbc[L]],
      [l.hole, t(d.hole) || tbc[L]],
      [l.printing, t(d.printing) || tbc[L]]
    ];
    var tb = byId('pSpecs');
    if (tb) tb.innerHTML = rows.map(function (r) {
      return '<tr><td><b>' + esc(r[0]) + '</b></td><td>' + esc(r[1]) + '</td></tr>';
    }).join('');
    var specNote = byId('pSpecNote');
    var sn = common.specNature || (window.PH_PRODUCTS && window.PH_PRODUCTS.common && window.PH_PRODUCTS.common.specNature);
    if (specNote) specNote.textContent = t(sn) || '';

    var cust = byId('pCustom');
    if (cust) cust.innerHTML = '<div class="kicker">' + l.customizable + '</div><p>' + esc(t(d.customizable)) + '</p>';

    var curUrl = location.href;
    var qp = '?sku=' + encodeURIComponent(sku)
      + '&name=' + encodeURIComponent(t(d.name))
      + '&source=' + encodeURIComponent(curUrl);
    var inq = byId('pInquiry');
    if (inq) { inq.href = 'contact.html' + qp; inq.setAttribute('data-inq', '1'); }

    var fSku = byId('qSku'); if (fSku) fSku.value = sku;
    var fName = byId('qName'); if (fName) fName.value = t(d.name);
    var fSrc = byId('qSource'); if (fSrc) fSrc.value = curUrl;
    var showSku = byId('showSku'); if (showSku) showSku.textContent = sku;
    var showName = byId('showName'); if (showName) showName.textContent = t(d.name);
    var showSrc = byId('showSource'); if (showSrc) { showSrc.textContent = curUrl; showSrc.href = curUrl; }
    var map = {
      qTitle:l.inqTitle, qIntro:l.inqIntro, lCarryName:l.carryName, lQty:l.fQty, lMat:l.fMat, lThk:l.fThk,
      lDesign:l.fDesign, lPrint:l.fPrint, lAdd:l.fAdd, lName:l.fName, lEmail:l.fEmail,
      lCompany:l.fCompany, lSource:l.source, lPrivacy:l.privacy, qSubmit:l.fSubmit, qNeed:l.fNeed, qOk:l.fOk,
      pSpecTitle:l.specTitle, pConcept:l.concept, pBackLabel:l.back, lSku:l.sku
    };
    Object.keys(map).forEach(function (id) { var el = byId(id); if (el && el.textContent !== map[id]) el.textContent = map[id]; });

    var back = byId('pBack'); if (back) back.href = 'products.html';
    return true;
  };

  function init() {
    var sku = readSku();
    if (!sku) { renderMessage(l.notfound); return; }

    if (!P || !P.skus) {
      // 外部数据脚本未加载 —— 通知内联兜底渲染器接管；缺席则显示明确提示
      window.dispatchEvent(new CustomEvent('pd:data-missing', { detail: { sku: sku } }));
      if (!window.PD_INLINE_FALLBACK) renderMessage(l.nodata);
      return;
    }
    var d = P.skus[sku];
    if (!d) { renderMessage(l.notfound); return; }
    window.renderProductDetail(sku, d, P.common);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
