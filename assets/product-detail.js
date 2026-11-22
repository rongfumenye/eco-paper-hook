/* ==================================================================
 * KALOZEN · 产品详情页渲染（数据驱动，唯一来源 products-data.js）
 * ------------------------------------------------------------------
 * 读取 ?sku=XX（H01–H08 / B01–B06 / P01–P03），按当前语言渲染 12 字段：
 *   SKU / 中英文名称 / 主图 / 结构特点 / 适用场景 / 尺寸 / 材质 /
 *   厚度 / 孔位 / 印刷工艺 / 可定制内容 / 询价入口。
 * 四语按 <html lang> 本地化；未确认参数由数据层标注「待确认」。
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
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]; }); }

  var LBL = {
    zh:{
      sku:'SKU 编号', nameZh:'中文名称', nameEn:'英文名称', features:'结构与特点', use:'适用场景',
      dimensions:'产品尺寸', material:'纸张材质', thickness:'厚度', hole:'孔位 / 挂孔规格',
      printing:'印刷及表面工艺', customizable:'可定制内容',
      specTitle:'产品规格', concept:'示意图，非产品实拍；实拍图待补。',
      inquire:'Request a Quote', back:'返回产品中心',
      notfound:'未找到该 SKU，请从产品中心选择产品。',
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

  function init() {
    var params = new URLSearchParams(location.search);
    var sku = (params.get('sku') || '').toUpperCase();
    var d = P.skus[sku];
    if (!d) {
      var nm = byId('pName'); if (nm) nm.textContent = l.notfound;
      var im = byId('pImg'); if (im) im.style.display = 'none';
      var note = byId('conceptNote'); if (note) note.style.display = 'none';
      return;
    }
    var c = P.common;

    // 面包屑 / 标题
    if (byId('crumbSku')) byId('crumbSku').textContent = sku + ' · ' + t(d.name);
    if (byId('pName')) byId('pName').textContent = t(d.name);
    document.title = t(d.name) + ' (' + sku + ') | KALOZEN';

    // 主图
    var img = byId('pImg');
    if (img) { img.src = '../assets/img/' + d.image; img.alt = t(d.name) + ' (' + sku + '), illustrative image'; }
    var note = byId('conceptNote'); if (note) note.textContent = t(c.conceptNote);

    // 介绍区
    var intro = byId('pIntro');
    if (intro) {
      intro.innerHTML = ''
        + '<div class="detail-sku"><span class="detail-sku-label">' + l.sku + '</span><b>' + esc(sku) + '</b></div>'
        + '<div class="detail-nameline"><span class="kicker">' + l.nameZh + '</span><p>' + esc(d.name.zh) + '</p>'
        + '<span class="kicker" style="margin-top:10px;display:block">' + l.nameEn + '</span><p>' + esc(d.name.en) + '</p></div>'
        + '<div class="detail-block"><div class="kicker">' + l.features + '</div><p>' + esc(t(d.features)) + '</p></div>'
        + '<div class="detail-block"><div class="kicker">' + l.use + '</div><p>' + esc(t(d.use)) + '</p></div>';
    }

    // 规格表
    var rows = [
      [l.sku, sku],
      [l.nameZh, d.name.zh],
      [l.nameEn, d.name.en],
      [l.dimensions, t(d.dimensions)],
      [l.material, t(d.material)],
      [l.thickness, t(d.thickness)],
      [l.hole, t(d.hole)],
      [l.printing, t(d.printing)]
    ];
    var tb = byId('pSpecs');
    if (tb) tb.innerHTML = rows.map(function (r) {
      return '<tr><td><b>' + esc(r[0]) + '</b></td><td>' + esc(r[1]) + '</td></tr>';
    }).join('');
    var specNote = byId('pSpecNote'); if (specNote) specNote.textContent = t(c.specNature);

    // 可定制内容
    var cust = byId('pCustom');
    if (cust) cust.innerHTML = '<div class="kicker">' + l.customizable + '</div><p>' + esc(t(d.customizable)) + '</p>';

    // 询价按钮带完整信息（SKU + 产品名称 + 当前链接）
    var curUrl = location.href;
    var qp = '?sku=' + encodeURIComponent(sku)
      + '&name=' + encodeURIComponent(t(d.name))
      + '&source=' + encodeURIComponent(curUrl);
    var inq = byId('pInquiry');
    if (inq) { inq.href = 'contact.html' + qp; inq.setAttribute('data-inq', '1'); }

    // 页内询价表单：自动带入只读产品信息
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
      pSpecTitle:l.specTitle, pConcept:l.concept, pBackLabel:l.back
    };
    Object.keys(map).forEach(function (id) { var el = byId(id); if (el) el.textContent = map[id]; });

    var back = byId('pBack'); if (back) back.href = 'products.html';
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
