/* ==================================================================
 * KALOZEN · 详情页内联兜底渲染器
 * ------------------------------------------------------------------
 * 目的：即使 products-data.js / product-detail.js 因缓存失效，也能用
 * 自包含数据渲染出 SKU 编号、中英文名称、图片、场景、询价带入，确保
 * 「SKU 和产品名称永不为空」。本文件既作为独立脚本提供，也被内联到
 * product.html 中（内联副本是最终生效者，见 HTML 中 PD_INLINE_FALLBACK）。
 * ================================================================== */
(function () {
  'use strict';

  var TBC = { zh:'待确认', en:'To be confirmed', ru:'Уточняется', ar:'قيد التحقق' };
  var MAT = {
    zh:'可选范围：牛皮卡纸 / 白卡纸 / 灰板（以样品与合同确认为准）',
    en:'Options: kraft board / white card / greyboard (confirmed by sample and contract)',
    ru:'Варианты: крафт, белый картон, серый картон (по образцу и контракту)',
    ar:'الخيارات: كرافت، بطاقة بيضاء، كرتون رمادي (تُؤكد بالعينة والعقد)'
  };
  var PRT = {
    zh:'可选：专色 / 四色 / 烫金 / 击凸 / 压凹（待确认）',
    en:'Options: spot colour / CMYK / foil / emboss / deboss (to be confirmed)',
    ru:'Варианты: плашечная / CMYK / фольга / конгрев / тиснение (уточняется)',
    ar:'الخيارات: لون خاص / CMYK / رقائق / نقش بارز وغائر (قيد التحقق)'
  };
  var CUS = {
    zh:'可定制：外形、尺寸、挂孔、材质、印刷与表面工艺（以图纸与样品确认为准）。',
    en:'Customisable: shape, dimensions, hole, material, print and finishing (confirmed by drawing and sample).',
    ru:'Настройка: форма, размеры, отверстие, материал, печать и отделка (по чертежу и образцу).',
    ar:'قابل للتخصيص: الشكل، الأبعاد، الفتحة، الخامة، الطباعة والتشطيب (يُؤكد بالرسم والعينة).'
  };
  var CONCEPT = {
    zh:'',
    en:'',
    ru:'Иллюстрация, не фото товара.',
    ar:'رسم توضيحي، ليس صورة منتج حقيقية.'
  };
  var SPECNOTE = {
    zh:'尺寸、厚度、孔径等精确参数尚未逐款实测，标注「待确认」；请以规格书与样品书面确认为准。',
    en:'Exact dimensions, thickness and hole sizes are not per-item tested and are marked "To be confirmed".',
    ru:'Точные размеры и параметры не проверены по каждой модели и обозначены «уточняется».',
    ar:'الأبعاد الدقيقة غير مُختبرة لكل موديل وموسومة بـ«قيد التحقق».'
  };

  // 14 款在售 SKU 自包含数据（name/image/features/use）
  var DB = {
    H01:{image:'packaged-sock.jpg',name:{zh:'环保纸质袜钩',en:'Eco Paper Sock Hook'},features:{zh:'一体模切的纸质挂钩，用于替代袜子包装上的塑料挂钩；可与吊卡配合悬挂陈列。',en:'A one-piece die-cut paper hook that replaces plastic hangers on sock packaging and works with header cards for display.'},use:{zh:'袜子 / 船袜零售包装',en:'Socks / ankle socks retail packaging'}},
    H02:{image:'home/hero-paper-hooks.jpg',name:{zh:'外贸环保纸钩',en:'Export Eco Paper Hook'},features:{zh:'面向出口包装的纸质挂钩，结构简洁，便于印刷品牌信息；适合批量包装配装。',en:'A paper hook for export packaging, simple in structure and easy to print brand information on; suited to bulk packing.'},use:{zh:'出口袜子及服饰包装',en:'Export sock and apparel packaging'}},
    H03:{image:'home/hook-structures.jpg',name:{zh:'问号形纸袜钩',en:'Question-Mark Paper Hook'},features:{zh:'问号形轮廓的纸质挂钩，钩部便于快速挂取，适合需要频繁上货补货的零售场景。',en:'A question-mark shaped paper hook whose open throat allows quick hanging and re-stocking in fast-turn retail.'},use:{zh:'便利店 / 药妆店 / 快速补货陈列',en:'Convenience stores / pharmacies / fast restock displays'}},
    H04:{image:'hook-detail.jpg',name:{zh:'环保纸质挂钩',en:'Eco Paper Hook'},features:{zh:'通用型纸质挂卡钩，一体成型，可与各类吊牌、挂卡组合使用。',en:'A general-purpose paper hang card hook, formed in one piece for use with a range of tags and header cards.'},use:{zh:'通用商品挂卡',en:'General hang-card applications'}},
    H05:{image:'material-macro.jpg',name:{zh:'2 字形纸袜钩',en:'2-Shape Paper Sock Hook'},features:{zh:'2 字形轮廓的纸质挂钩，肩部区域更宽，适合对挺括度有要求的陈列。',en:'A 2-shaped paper hook with a wider shoulder area for displays that need extra stiffness.'},use:{zh:'需要挺括肩部的袜品陈列',en:'Sock displays requiring a stiffer shoulder'}},
    H06:{image:'gold-foil.jpg',name:{zh:'牛皮纸问号钩',en:'Kraft Paper Question-Mark Hook'},features:{zh:'牛皮纸质感的问号形纸钩，可做印刷与烫金等表面工艺，兼顾实用与品牌呈现。',en:'A kraft-textured question-mark paper hook that supports printing and foil finishing for both function and branding.'},use:{zh:'多双装 / 运动袜包装',en:'Multi-pack / sports sock packaging'}},
    H07:{image:'paper-material.jpg',name:{zh:'多用途纸钩',en:'Multi-Purpose Paper Hook'},features:{zh:'多用途纸质挂钩，可按不同场景调整结构与尺寸，适用于衣架、帽挂、宠物用品悬挂等。',en:'A multi-purpose paper hook whose structure and size can be adapted for hangers, hat hooks, pet product hanging and more.'},use:{zh:'衣架 / 帽子 / 宠物用品',en:'Hangers / hats / pet accessories'}},
    H08:{image:'color-range.jpg',name:{zh:'牛皮纸问号钩（零售款）',en:'Kraft Paper Question-Mark Hook (Retail)'},features:{zh:'面向通用零售陈列的问号形纸钩，可做多色印刷，便于统一门店视觉。',en:'A question-mark paper hook for general retail display, available with multi-colour printing for consistent in-store visuals.'},use:{zh:'通用零售陈列',en:'General retail display'}},
    B01:{image:'home/sock-display-cards.jpg',name:{zh:'袜子展示挂板',en:'Sock Display Board'},features:{zh:'纸质袜子展示挂板，可印刷品牌与尺码信息，配合纸钩或直接悬挂进行零售陈列。',en:'A paper sock display board that can carry brand and size printing, used with paper hooks or hung directly for retail display.'},use:{zh:'袜子陈列 / 门店挂板',en:'Sock display / in-store hanging board'}},
    B02:{image:'retail-shelf.jpg',name:{zh:'袜子展示纸板',en:'Sock Display Card'},features:{zh:'展示用纸板，适合直播间、展会等场景集中陈列袜品，可定制印刷面。',en:'A display card suited to live-streaming and trade-show settings for grouped sock presentation, with a customisable print surface.'},use:{zh:'直播间 / 展会陈列',en:'Live streaming / trade show display'}},
    B03:{image:'paper-roll.jpg',name:{zh:'袜子陈列挂板',en:'Sock Merchandising Board'},features:{zh:'用于门店陈列的纸质挂板，可承载多双袜子展示，支持品牌视觉印刷。',en:'A paper board for in-store merchandising that can present multiple pairs of socks and carry brand visuals.'},use:{zh:'门店 / 工厂店陈列',en:'Store / factory-outlet display'}},
    B04:{image:'home/socks-application.jpg',name:{zh:'直播展示挂板',en:'Live-Stream Display Board'},features:{zh:'便于集中展示多款袜品的纸质挂板，适合直播、短视频等线上销售场景。',en:'A paper board for presenting multiple sock styles together, suited to live-streaming and short-video selling.'},use:{zh:'直播 / 线上销售展示',en:'Live streaming / online sales display'}},
    B05:{image:'product-grid.jpg',name:{zh:'长短款纸质袜板',en:'Paper Sock Board (Long / Short)'},features:{zh:'提供长款与短款两种展示形态的纸质袜板，适配不同长度袜品与陈列位。',en:'A paper sock board available in long and short formats to suit different sock lengths and display spaces.'},use:{zh:'长款 / 短款袜品展示',en:'Long / short sock presentation'}},
    B06:{image:'home/custom-packaging.jpg',name:{zh:'多场景袜子挂板',en:'Multi-Scene Sock Display Board'},features:{zh:'可适配多种陈列场景的袜子挂板，结构可定制，便于统一品牌展示效果。',en:'A sock display board adaptable to multiple retail scenarios, with customisable structure for consistent brand presentation.'},use:{zh:'多场景零售陈列',en:'Multi-scene retail display'}}
  };

  var LBL = {
    zh:{sku:'SKU 编号',nameZh:'中文名称',nameEn:'英文名称',features:'结构与特点',use:'适用场景',dimensions:'产品尺寸',material:'纸张材质',thickness:'厚度',hole:'孔位 / 挂孔规格',printing:'印刷及表面工艺',customizable:'可定制内容',specTitle:'产品规格',notfound:'未找到该 SKU，请从产品中心选择产品。',inqTitle:'询价此款产品',inqIntro:'已自动带入以下产品信息，你只需补充需求：',carryName:'产品名称',fQty:'Required Quantity · 需求数量',fMat:'Material · 材质',fThk:'Thickness · 厚度',fDesign:'Custom Design · 定制设计',fPrint:'Printing Requirements · 印刷要求',fAdd:'Additional Requirements · 其他要求',fName:'姓名',fEmail:'邮箱',fCompany:'公司',fSubmit:'发送询价',fNeed:'请填写：姓名、邮箱、需求数量。',fOk:'说明：在线直投未启用，提交后将调起邮件客户端并预填内容，请在邮件中点击发送。',source:'当前产品链接',privacy:'我已阅读并同意隐私政策，同意就本次询价与我联系。'},
    en:{sku:'SKU',nameZh:'Chinese name',nameEn:'English name',features:'Structure & Features',use:'Applications',dimensions:'Dimensions',material:'Board material',thickness:'Thickness',hole:'Hole / hanging spec',printing:'Printing & finishing',customizable:'Customisation options',specTitle:'Product specifications',notfound:'SKU not found. Please choose a product from the product centre.',inqTitle:'Inquire about this item',inqIntro:'Product details are filled in for you — just add your requirements:',carryName:'Product name',fQty:'Required Quantity',fMat:'Material',fThk:'Thickness',fDesign:'Custom Design',fPrint:'Printing Requirements',fAdd:'Additional Requirements',fName:'Name',fEmail:'Email',fCompany:'Company',fSubmit:'Send inquiry',fNeed:'Please fill in: name, email and quantity.',fOk:'Note: online direct delivery is not enabled. Submitting opens your email client with the inquiry pre-filled — please press SEND.',source:'Current product link',privacy:'I agree to the Privacy Policy and consent to being contacted about this inquiry.'},
    ru:{sku:'Артикул',nameZh:'Китайское название',nameEn:'Английское название',features:'Структура и особенности',use:'Применение',dimensions:'Размеры',material:'Материал картона',thickness:'Толщина',hole:'Отверстие / крепление',printing:'Печать и отделка',customizable:'Варианты настройки',specTitle:'Характеристики товара',notfound:'Артикул не найден. Выберите товар в каталоге.',inqTitle:'Запрос по товару',inqIntro:'Данные товара заполнены — добавьте свои требования:',carryName:'Название товара',fQty:'Требуемое количество',fMat:'Материал',fThk:'Толщина',fDesign:'Индивидуальный дизайн',fPrint:'Требования к печати',fAdd:'Дополнительные требования',fName:'Имя',fEmail:'E-mail',fCompany:'Компания',fSubmit:'Отправить запрос',fNeed:'Заполните: имя, e-mail и количество.',fOk:'Онлайн-отправка не включена — откроется почтовый клиент, нажмите ОТПРАВИТЬ.',source:'Ссылка на товар',privacy:'Я согласен с политикой конфиденциальности.'},
    ar:{sku:'SKU',nameZh:'الاسم الصيني',nameEn:'الاسم الإنجليزي',features:'الهيكل والمميزات',use:'أماكن الاستخدام',dimensions:'الأبعاد',material:'مادة الورق',thickness:'السماكة',hole:'الفتحة / التعليق',printing:'الطباعة والتشطيب',customizable:'خيارات التخصيص',specTitle:'مواصفات المنتج',notfound:'لم يُعثر على SKU. اختر منتجًا من قائمة المنتجات.',inqTitle:'استفسار عن هذا المنتج',inqIntro:'تم تعبئة بيانات المنتج — أضف متطلباتك فقط:',carryName:'اسم المنتج',fQty:'الكمية المطلوبة',fMat:'المادة',fThk:'السماكة',fDesign:'التصميم المخصص',fPrint:'متطلبات الطباعة',fAdd:'متطلبات إضافية',fName:'الاسم',fEmail:'البريد الإلكتروني',fCompany:'الشركة',fSubmit:'إرسال الاستفسار',fNeed:'يرجى تعبئة: الاسم والبريد والكمية.',fOk:'الإرسال المباشر غير مفعّل — سيفتح برنامج البريد، اضغط إرسال.',source:'رابط المنتج الحالي',privacy:'أوافق على سياسة الخصوصية.'}
  };

  function currentLang() {
    var l = (document.documentElement.lang || 'en').toLowerCase();
    if (l.indexOf('zh') === 0) return 'zh';
    if (l.indexOf('ru') === 0) return 'ru';
    if (l.indexOf('ar') === 0) return 'ar';
    return 'en';
  }
  function t(x, L) { return (x && typeof x === 'object') ? (x[L] || x.en || x.zh) : x; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]; }); }
  function byId(id) { return document.getElementById(id); }

  function readSku() {
    var s = '';
    try { s = new URLSearchParams(location.search).get('sku') || ''; } catch (e) {}
    if (!s && location.hash) { try { s = new URLSearchParams(location.hash.replace(/^#\/?/, '')).get('sku') || ''; } catch (e) {} }
    if (!s) { var m = String(location.href).match(/[?&]sku=([^&#]+)/i); if (m) s = decodeURIComponent(m[1]); }
    return String(s || '').trim().toUpperCase();
  }

  function render(sku) {
    var L = currentLang();
    var l = LBL[L] || LBL.en;
    var raw = DB[sku];
    if (!raw) {
      var nm = byId('pName'); if (nm) nm.textContent = l.notfound;
      return;
    }
    var d = {
      name: raw.name, image: raw.image, features: raw.features, use: raw.use,
      dimensions: TBC[L], material: MAT[L], thickness: TBC[L], hole: TBC[L],
      printing: PRT[L], customizable: CUS[L]
    };
    var common = { conceptNote: CONCEPT[L], specNature: SPECNOTE[L] };

    if (byId('crumbSku')) byId('crumbSku').textContent = sku + ' · ' + t(d.name, L);
    if (byId('pName')) byId('pName').textContent = t(d.name, L);
    document.title = t(d.name, L) + ' (' + sku + ') | KALOZEN';

    var img = byId('pImg');
    if (img) { img.style.display = ''; img.src = '../assets/img/' + d.image; img.alt = t(d.name, L) + ' (' + sku + ')'; }
    var note = byId('conceptNote'); if (note) { note.style.display = ''; note.textContent = CONCEPT[L]; }

    var intro = byId('pIntro');
    if (intro) {
      intro.innerHTML = ''
        + '<div class="detail-sku"><span class="detail-sku-label">' + l.sku + '</span><b>' + esc(sku) + '</b></div>'
        + '<div class="detail-nameline"><span class="kicker">' + l.nameZh + '</span><p>' + esc(t(d.name,'zh') || t(d.name,'en')) + '</p>'
        + '<span class="kicker" style="margin-top:10px;display:block">' + l.nameEn + '</span><p>' + esc(t(d.name,'en') || t(d.name,'zh')) + '</p></div>'
        + '<div class="detail-block"><div class="kicker">' + l.features + '</div><p>' + esc(t(d.features, L)) + '</p></div>'
        + '<div class="detail-block"><div class="kicker">' + l.use + '</div><p>' + esc(t(d.use, L)) + '</p></div>';
    }
    var rows = [
      [l.sku, sku], [l.nameZh, t(d.name,'zh')||t(d.name,'en')], [l.nameEn, t(d.name,'en')||t(d.name,'zh')],
      [l.dimensions, d.dimensions], [l.material, d.material], [l.thickness, d.thickness],
      [l.hole, d.hole], [l.printing, d.printing]
    ];
    var tb = byId('pSpecs');
    if (tb) tb.innerHTML = rows.map(function (r) { return '<tr><td><b>' + esc(r[0]) + '</b></td><td>' + esc(r[1]) + '</td></tr>'; }).join('');
    var specNote = byId('pSpecNote'); if (specNote) specNote.textContent = SPECNOTE[L];
    var cust = byId('pCustom'); if (cust) cust.innerHTML = '<div class="kicker">' + l.customizable + '</div><p>' + esc(t(d.customizable, L)) + '</p>';

    var curUrl = location.href;
    var inq = byId('pInquiry');
    if (inq) inq.href = 'https://kalozen.com/en/contact?sku=' + encodeURIComponent(sku) + '&name=' + encodeURIComponent(t(d.name, L)) + '&source=' + encodeURIComponent(curUrl);
    var fSku = byId('qSku'); if (fSku) fSku.value = sku;
    var fName = byId('qName'); if (fName) fName.value = t(d.name, L);
    var fSrc = byId('qSource'); if (fSrc) fSrc.value = curUrl;
    var showSku = byId('showSku'); if (showSku) showSku.textContent = sku;
    var showName = byId('showName'); if (showName) showName.textContent = t(d.name, L);
    var showSrc = byId('showSource'); if (showSrc) { showSrc.textContent = curUrl; showSrc.href = curUrl; }
    var map = {
      qTitle:l.inqTitle,qIntro:l.inqIntro,lCarryName:l.carryName,lQty:l.fQty,lMat:l.fMat,lThk:l.fThk,
      lDesign:l.fDesign,lPrint:l.fPrint,lAdd:l.fAdd,lName:l.fName,lEmail:l.fEmail,lCompany:l.fCompany,
      lSource:l.source,lPrivacy:l.privacy,qSubmit:l.fSubmit,qNeed:l.fNeed,qOk:l.fOk,pSpecTitle:l.specTitle,lSku:l.sku
    };
    Object.keys(map).forEach(function (id) { var el = byId(id); if (el && el.textContent !== map[id]) el.textContent = map[id]; });
    return true;
  }

  window.PD_INLINE_FALLBACK = { render: render, skus: DB };

  function boot() {
    // 若外部脚本已成功渲染（pName 不再是默认 Product/占位），则不覆盖
    var nm = byId('pName');
    var done = nm && nm.textContent && nm.textContent !== 'Product' && nm.textContent.indexOf('未找到') < 0 && nm.textContent.indexOf('not found') < 0 && nm.textContent.indexOf('не найден') < 0 && nm.textContent.indexOf('لم يُعثر') < 0 && nm.textContent.indexOf('未能加载') < 0 && nm.textContent.indexOf('could not be loaded') < 0;
    if (done) return;
    var sku = readSku();
    if (sku) render(sku);
  }

  // 数据缺失事件触发时立即接管
  window.addEventListener('pd:data-missing', function (e) { render((e.detail && e.detail.sku) || readSku()); });
  // DOM 就绪后兜底扫描（延迟以让外部脚本先执行）
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(boot, 60); });
  else setTimeout(boot, 60);
  window.addEventListener('load', function () { setTimeout(boot, 120); });
})();
