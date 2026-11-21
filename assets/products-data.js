/* ==================================================================
 * KALOZEN · 产品数据（唯一来源）
 * ------------------------------------------------------------------
 * 全站只卖三种产品（三种钩型），数据驱动：
 *   - 产品列表页 products.html  读取本文件渲染三张产品卡
 *   - 详情页 product.html?sku=P01 读取本文件渲染规格与询价
 * 改这里 = 列表页 + 详情页 + 首页 同步生效。
 *
 * 图片：使用站点现有示意图（concept=true）。拿到真实产品照片后，
 *       把 image 换成实拍路径、concept 改为 false 即可全站生效。
 * 规格：均为常规生产区间（reference），非逐款实测，最终以样品与图纸为准。
 * ================================================================== */
(function () {
  'use strict';

  // 通用规格区间（三款适用）
  var COMMON = {
    material: { zh:'FSC® 牛皮卡 / 灰板', en:'FSC® kraft board / greyboard', ru:'Крафт / серый картон (FSC®)', ar:'كرافت / كرتون رمادي (FSC®)' },
    gsm: '300–450 gsm',
    printing: { zh:'1–4 色专色 · 大豆油墨', en:'1–4 spot colours · soy ink', ru:'1–4 цвета · соевые чернила', ar:'1–4 ألوان · حبر صويا' },
    finish: { zh:'烫金 / 击凸 / 压凹', en:'Foil / emboss / deboss', ru:'Фольга / тиснение', ar:'رقائق / نقش بارز' },
    pack: '1,000 / 5,000 pcs per carton',
    sampleLead: { zh:'3–7 天（按款评估）', en:'3–7 days (per item)', ru:'3–7 дней (по item)', ar:'3–7 أيام (حسب النوع)' },
    productionLead: { zh:'7–12 天（确认图稿与样品后起算）', en:'7–12 days (after artwork & sample approval)', ru:'7–12 дней (после утверждения макета и образца)', ar:'7–12 يومًا (بعد اعتماد التصميم والعينة)' },
    moq: { zh:'常规 10,000 只 / 定制 30,000 只', en:'Standard 10,000 pcs / Custom 30,000 pcs', ru:'Стандарт 10 000 шт. / На заказ 30 000 шт.', ar:'قياسي 10٬000 / مخصص 30٬000' },
    specNature: { zh:'以下为常规生产区间（参考值），非逐款实测数据；精确参数请索取规格书与样品。',
      en:'Values below are typical production ranges (reference), not per-item tested data; request a spec sheet and samples for exact figures.',
      ru:'Значения — отраслевые диапазоны (справочно), не измерения по каждой модели; запросите спецификацию и образцы.',
      ar:'القيم نطاقات إنتاج معتادة (إرشادية)، ليست قياسات لكل نوع؛ اطلب ورقة المواصفات والعينات.' }
  };

  // 三种产品
  var PRODUCTS = [
    {
      sku: 'P01',
      code: { zh:'01 / 日常通用', en:'01 / Everyday', ru:'01 / Повседневный', ar:'01 / يومي' },
      name: { zh:'S 形标准钩', en:'S-Shape Standard Hook', ru:'S-крючок стандартный', ar:'خطاف S القياسي' },
      tagline: { zh:'袜子、内衣及轻薄服饰的默认之选', en:'The default choice for socks, underwear and light apparel', ru:'Основной выбор для носков, белья и лёгкой одежды', ar:'الخيار الافتراضي للجوارب والملابس الداخلية الخفيفة' },
      desc: { zh:'对称 S 形一体模切，5 mm 标准孔径，挂在洞洞板上不歪不转。1.5 mm FSC® 牛皮卡纸，轻薄包装里最稳妥的通用款。',
        en:'Symmetrical S-shape die-cut in one piece, 5 mm standard hole — hangs straight and steady on pegboard. 1.5 mm FSC® kraft board, the most reliable all-rounder for light packaging.',
        ru:'Симметричный S-крючок, вырубленный целиком, стандартное отверстие 5 мм — держится ровно на перфорированной доске. Крафт 1,5 мм FSC®, универсальный вариант для лёгкой упаковки.',
        ar:'خطاف S متماثل مقطوع بالقالب، بفتحة قياسية 5 مم — يتعلق بشكل مستقر على اللوحة المثقبة. كرافت FSC® بسماكة 1.5 مم، الخيار الأكثر موثوقية للتغليف الخفيف.' },
      image: 'hook-detail.jpg',
      concept: true,
      specs: {
        thickness: '1.5 mm',
        hole: '5 mm',
        load: '≤ 300 g',
        use: { zh:'袜子 / 船袜 / 内衣', en:'Socks / ankle socks / underwear', ru:'Носки / бельё', ar:'جوارب / ملابس داخلية' }
      },
      bullets: {
        zh:['对称 S 形，通用挂杆','5 mm 标准孔径','1.5 mm FSC® 牛皮卡','10,000 只起订'],
        en:['Symmetrical S-shape, universal','5 mm standard hole','1.5 mm FSC® kraft board','MOQ 10,000 pcs'],
        ru:['Симметричная форма S','Отверстие 5 мм','Крафт 1,5 мм FSC®','От 10 000 шт.'],
        ar:['شكل S متماثل','فتحة قياسية 5 مم','كرافت FSC® 1.5 مم','الحد الأدنى 10,000 قطعة']
      }
    },
    {
      sku: 'P02',
      code: { zh:'02 / 加厚承重', en:'02 / Heavy duty', ru:'02 / Усиленный', ar:'02 / تقيل' },
      name: { zh:'加厚承重钩', en:'Heavy-Duty Hook', ru:'Усиленный крючок', ar:'خطاف تقيل' },
      tagline: { zh:'多件装与毛巾的承重方案', en:'The load-bearing option for multi-packs and towels', ru:'Вариант для мультиупаковок и полотенец', ar:'خيار التحميل للعبوات المتعددة والمناشف' },
      desc: { zh:'2.0 mm 灰板，钩口加宽、肩部加固，长期承重不下垂。适合多双装、毛巾、文胸等偏重商品，静态承重可达 600 g。',
        en:'2.0 mm greyboard with a widened throat and reinforced shoulder — holds its shape under sustained load. Built for heavier items such as multi-packs, towels and bras; static load up to 600 g.',
        ru:'Серый картон 2,0 мм с расширенным зевом и укреплённым плечом — не провисает при длительной нагрузке. Для тяжёлых товаров: мультиупаковки, полотенца, бюстгальтеры; до 600 г.',
        ar:'كرتون رمادي 2.0 مم بفم أوسع وكتف معزز — لا يتدلى تحت الحمل المستمر. للمنتجات الأثقل: عبوات متعددة، مناشف، حمالات صدر؛ حمل حتى 600 غ.' },
      image: 'material-macro.jpg',
      concept: true,
      specs: {
        thickness: '2.0 mm',
        hole: '5 / 6 mm',
        load: '≤ 600 g',
        use: { zh:'多双装 / 毛巾 / 文胸', en:'Multi-packs / towels / bras', ru:'Мультиупаковки / полотенца', ar:'عبوات متعددة / مناشف' }
      },
      bullets: {
        zh:['2.0 mm 加厚灰板','加宽钩口 · 加固肩部','静态承重 ≤ 600 g','长期陈列不下垂'],
        en:['2.0 mm thick greyboard','Widened throat · reinforced shoulder','Static load ≤ 600 g','No sagging on long display'],
        ru:['Серый картон 2,0 мм','Расширенный зев · укреплённое плечо','Нагрузка ≤ 600 г','Не провисает при долгой демонстрации'],
        ar:['كرتون رمادي 2.0 مم','فم أوسع · كتف معزز','حمل ≤ 600 غ','لا يتدلى مع العرض الطويل']
      }
    },
    {
      sku: 'P03',
      code: { zh:'03 / 品牌定制', en:'03 / Custom', ru:'03 / На заказ', ar:'03 / مخصص' },
      name: { zh:'异形定制钩', en:'Custom Die-Cut Hook', ru:'Фигурный крючок на заказ', ar:'خطاف مقطوع حسب الطلب' },
      tagline: { zh:'你的形状、你的印刷、你的品牌', en:'Your shape, your print, your brand', ru:'Ваша форма, ваша печать, ваш бренд', ar:'شكلتك، طباعتك، علامتك' },
      desc: { zh:'按你的轮廓开模，来图定制。可做专色印刷、烫金、击凸等后道工艺，是礼盒与高端产品线的品牌化选择。3–7 天打样，7–12 天量产。',
        en:'Die-cut to your outline, made from your artwork. Add spot-colour printing, foil stamping or embossing — the branding choice for gift boxes and premium lines. 3–7 days sampling, 7–12 days production.',
        ru:'Вырезается по вашему контуру, по вашему макету. Возможна печать, тиснение фольгой и рельеф — выбор для подарочных коробок и премиум-линий. Образец 3–7 дней, производство 7–12 дней.',
        ar:'يُقطع حسب مخططك. يمكن إضافة طباعة الألوان ورقائق النقش — الخيار للعلب الهدايا والخطوط الفاخرة. عينة 3–7 أيام، إنتاج 7–12 يومًا.' },
      image: 'gold-foil.jpg',
      concept: true,
      specs: {
        thickness: '1.5–2.0 mm',
        hole: { zh:'按图定制', en:'Per drawing', ru:'По чертежу', ar:'حسب المخطط' },
        load: { zh:'按结构评估', en:'Per structure', ru:'По конструкции', ar:'حسب الهيكل' },
        use: { zh:'礼盒 / 高端产品线', en:'Gift boxes / premium lines', ru:'Подарки / премиум', ar:'علب هدايا / خطوط فاخرة' }
      },
      bullets: {
        zh:['来图开模，形状自由','专色印刷 / 烫金 / 击凸','30,000 只起订','3–7 天打样'],
        en:['Custom die-cut from your artwork','Spot print / foil / emboss','MOQ 30,000 pcs','3–7 days sampling'],
        ru:['Вырубка по вашему макету','Печать / фольга / тиснение','От 30 000 шт.','Образец 3–7 дней'],
        ar:['قطع حسب مخططك','طباعة / رقائق / نقش','الحد الأدنى 30,000 قطعة','عينة 3–7 أيام']
      }
    }
  ];

  window.PH_PRODUCTS = {
    common: COMMON,
    products: PRODUCTS,
    skus: (function () { var m = {}; PRODUCTS.forEach(function (p) { m[p.sku] = p; }); return m; })()
  };
})();
