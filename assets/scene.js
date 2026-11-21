/* ==================================================================
 * PAPERHOOK · 应用场景页顶部内容按锚点切换
 * ------------------------------------------------------------------
 * 从首页点某个场景标签进来（cases.html#case-03），顶部大图、标题、
 * 说明、要点会自动切换成对应场景，不再永远是袜子。
 *
 * 【集中配置，只改这一个文件】
 *  - IMG  : 每个场景配的图（assets/img/ 里的文件名）
 *  - DATA : 四语的顶部文案（kicker/title/desc/list）
 * ================================================================== */
(function () {
  'use strict';

  // ---------- 每个场景的图片（按内容合理轮配现有图）----------
  var IMG = {
    1:  'retail-shelf.jpg',     // 棉袜/船袜 → 袜子货架
    2:  'packaged-sock.jpg',    // 运动袜/多双装 → 包装袜
    3:  'color-range.jpg',      // 内衣/文胸 → 多色/加厚承重钩阵列
    4:  'product-grid.jpg',     // 家居服/睡衣 → 钩子阵列
    5:  'paper-roll.jpg',       // 毛巾/浴巾 → 厚纸板卷
    6:  'material-macro.jpg',   // 抱枕套/桌布 → 大卡纸材质
    7:  'color-range.jpg',      // 宠物服饰 → 彩色钩
    8:  'hook-detail.jpg',      // 发饰 → 异形钩特写
    9:  'gold-foil.jpg',        // 围巾/帽子 → 烫金钩（带夹概念）
    10: 'paper-material.jpg',   // 母婴 → 原色纸板+绿叶（安全环保）
    11: 'hook-detail.jpg',      // 美妆工具 → S 形标准钩
    12: 'gold-foil.jpg'         // 礼品礼盒 → 烫金钩
  };

  // ---------- 四语顶部文案 ----------
  var DATA = {
    zh: {
      1:{k:'主场景',t:'棉袜 / 船袜：最常见也最好做',d:'棉袜轻薄、SKU 多、补货快。1.5 mm 牛皮 S 钩配 5 mm 孔径，适配标准商超洞洞板，换款只需换印刷。',l:['船袜与短袜：1.5 mm 足够','标准 5 mm 孔径，即插即用','换 SKU 只换印刷，不换模具']},
      2:{k:'主场景',t:'运动袜 / 多双装： heavier 要更稳',d:'单件更重、吊挂更久，钩体必须抗变形。加厚纸板与放宽钩口可防止挂久下垂、勒坏包装。',l:['建议加厚 2.0 mm 纸板','钩口放宽，多双装也能挂','承重可达 ≤600 g']},
      3:{k:'主场景',t:'内衣 / 文胸：宽体承重',d:'内衣需要更宽的钩体与更高承重。钩口加宽可避免肩带在理货时滑脱，哑黑或烫金更显质感。',l:['加厚承重钩 · 2.0 mm 灰板','钩口加宽，肩带不滑脱','哑黑/烫金提升品牌感']},
      4:{k:'主场景',t:'家居服 / 睡衣：一钩双挂',d:'套装体积大、垂坠感强。加厚承重钩分散承重，节省货架纵向空间，上装下装整齐呈现。',l:['加厚承重钩 · 1.8 mm','一钩双挂，省货架空间','适合套装组合陈列']},
      5:{k:'主场景',t:'毛巾 / 浴巾：挂得平',d:'重量集中在单侧，普通钩容易歪。加厚承重钩能挂平，孔径略大以适配粗挂杆。',l:['加厚承重钩','孔径略大适配粗挂杆','受力均衡，久挂不歪']},
      6:{k:'主场景',t:'抱枕套 / 桌布：整体感',d:'家纺类挂卡面积大，钩体与吊卡同色系，视觉更整体。大幅面吊卡也能稳稳承重。',l:['S 钩 · 同色系印刷','钩与吊卡视觉统一','适配大幅面挂卡']},
      7:{k:'主场景',t:'宠物服饰 / 小配件：用色出彩',d:'宠物袜、衣服、牵引小件，多用彩色纸钩配合活泼的印刷风格，在货架上更容易被看见。',l:['彩色定制 · 1.5 mm','活泼印刷，吸引眼球','小件挂取灵活']},
      8:{k:'主场景',t:'发饰 / 发圈：小尺寸更协调',d:'小件商品挂在标准钩上比例失调，小尺寸异形钩更协调，开模成本也可控。',l:['异形开模 · 小尺寸','与小件比例协调','可定制独特造型']},
      9:{k:'主场景',t:'围巾 / 帽子 / 手套：夹得住',d:'体积大、重量不均、常常没有吊卡。异形定制钩可直接夹住织物，不多一个零件，也不损伤商品。',l:['异形定制钩 · 1.8 mm','直接夹住，无需吊卡','不损伤织物']},
      10:{k:'主场景',t:'母婴用品：材质最放心',d:'婴儿袜、口水巾、围兜对材质安全要求高。纯纸无覆膜、无胶粘，可随纸卡一起回收。',l:['无覆膜牛皮 · 1.5 mm','无胶粘、无塑料件','与纸卡同渠道回收']},
      11:{k:'主场景',t:'美妆工具：药妆店高频补货',d:'洗脸巾、束发带、化妆棉多在药妆店挂架，补货频率高。S 形标准钩挂取快，白卡印刷干净。',l:['S 形标准钩 · 白卡','挂取快，适合高频补货','印刷干净显专业']},
      12:{k:'主场景',t:'礼品礼盒：提升价值感',d:'节日礼盒外挂装饰，烫金纸钩能明显提升礼盒的价值感，异形造型让包装更有记忆点。',l:['烫金 · 异形','节日礼盒外挂装饰','提升档次与记忆点']}
    },
    en: {
      1:{k:'MAIN SCENARIO',t:'Cotton & ankle socks: the classic',d:'Light, high-SKU and fast-moving. A 1.5 mm kraft S-hook with a 5 mm hole fits standard pegboards — changing a SKU means changing the print, not the tooling.',l:['Ankle & low-cut: 1.5 mm is enough','Standard 5 mm hole, ready to hang','Swap print, not moulds, for new SKUs']},
      2:{k:'MAIN SCENARIO',t:'Sports socks & multi-packs: built stronger',d:'Heavier items hang longer, so the hook must resist bending. Thicker board and a wider mouth stop sagging and protect the pack.',l:['Thicker 2.0 mm board recommended','Wider mouth holds multi-packs','Load up to ≤600 g']},
      3:{k:'MAIN SCENARIO',t:'Underwear & bras: wide and strong',d:'Needs a wider body and higher load. A widened mouth stops straps slipping during restocking; matte black or foil adds a premium feel.',l:['Heavy-Duty Hook · 2.0 mm greyboard','Wider mouth, no strap slip','Matte black / foil for brand look']},
      4:{k:'MAIN SCENARIO',t:'Loungewear & pyjamas: double hang',d:'Bulky sets with heavy drape. A heavy-duty hook hangs two pieces on one hook, saving vertical shelf space.',l:['Heavy-Duty Hook · 1.8 mm','Two pieces, one hook','Ideal for coordinated sets']},
      5:{k:'MAIN SCENARIO',t:'Towels & bath sheets: hang it flat',d:'Weight sits on one side, so ordinary hooks tilt. Heavy-Duty Hooks keep it level; a larger hole fits thick rails.',l:['Heavy-Duty Hook','Larger hole for thick rails','Balanced load, no tilting']},
      6:{k:'MAIN SCENARIO',t:'Cushion covers & table linen: unified look',d:'Large hang cards look better when the hook matches the card colour. A single paper board still carries the load reliably.',l:['S-hook · matching colour print','Hook and card visually unified','Supports large-format cards']},
      7:{k:'MAIN SCENARIO',t:'Pet apparel & accessories: full of colour',d:'Pet socks, clothes and leads use coloured paper hooks with lively printing, so they stand out on shelf.',l:['Custom die-cut · 1.5 mm','Lively print catches the eye','Flexible for small items']},
      8:{k:'MAIN SCENARIO',t:'Hair accessories: right-sized',d:'Small items look lost on a standard hook. A small die-cut hook is better proportioned and cost-effective to tool.',l:['Custom die-cut · small size','Better proportion for small goods','Unique shapes available']},
      9:{k:'MAIN SCENARIO',t:'Scarves, hats & gloves: grip it',d:'Bulky, uneven and often without a hang card. A custom die-cut hook grips fabric directly — no extra part, no damage.',l:['Custom die-cut hook · 1.8 mm','Grips fabric, no card needed','Won’t damage the product']},
      10:{k:'MAIN SCENARIO',t:'Baby & toddler: the safest material',d:'Baby socks, bibs and drool cloths demand material safety. Pure paper, no lamination, no glue — recycled with the card.',l:['Uncoated kraft · 1.5 mm','No glue, no plastic parts','Recycled with the paper card']},
      11:{k:'MAIN SCENARIO',t:'Beauty tools: fast restock in pharmacies',d:'Facial towels, hair bands and cotton pads hang in pharmacies and restock often. S-Shape hooks load fast; white card prints clean.',l:['S-Shape hook · white card','Fast loading for frequent restock','Clean, professional print']},
      12:{k:'MAIN SCENARIO',t:'Gift boxes: lift the perceived value',d:'Foil-stamped paper hooks noticeably lift a gift box’s perceived value, and custom silhouettes make packaging memorable.',l:['Foil stamping · custom shape','Holiday gift box outer hang','Adds premium feel and recall']}
    },
    ru: {
      1:{k:'ОСНОВНОЙ СЦЕНАРИЙ',t:'Носки и следки: классика',d:'Лёгкие, много SKU, частая ротация. Крафт S-крючок 1,5 мм с отверстием 5 мм подходит для стандартных перфорированных панелей.',l:['Следки: достаточно 1,5 мм','Стандартное отв. 5 мм','Меняем печать, не оснастку']},
      2:{k:'ОСНОВНОЙ СЦЕНАРИЙ',t:'Спортивные носки и мультипаки: прочнее',d:'Более тяжёлые изделия висят дольше — крючок должен держать форму. Плотный картон и широкий зев не дают провисать.',l:['Плотный картон 2,0 мм','Широкий зев для мультипаков','Нагрузка до ≤600 г']},
      3:{k:'ОСНОВНОЙ СЦЕНАРИЙ',t:'Бельё и бюстгальтеры: шире и прочнее',d:'Нужны более широкое тело и высокая нагрузка. Расширенный зев не даёт бретелям соскальзывать; матовый чёрный или фольга добавляют премиальность.',l:['Усиленный крючок · 2,0 мм серый картон','Расширенный зев, бретели не скользят','Матовый чёрный / фольга']},
      4:{k:'ОСНОВНОЙ СЦЕНАРИЙ',t:'Домашняя одежда: двойная подвеска',d:'Объёмные комплекты с сильным драпированием. Усиленный крючок держит две вещи на одном крючке, экономя место.',l:['Усиленный крючок · 1,8 мм','Две вещи на одном крючке','Идеально для комплектов']},
      5:{k:'ОСНОВНОЙ СЦЕНАРИЙ',t:'Полотенца: висят ровно',d:'Вес сосредоточен на одной стороне — обычный крючок перекашивается. Усиленный крючок держит ровно, большее отверстие подходит под толстый прут.',l:['Усиленный крючок','Большее отв. под толстый прут','Равномерная нагрузка']},
      6:{k:'ОСНОВНОЙ СЦЕНАРИЙ',t:'Наволочки и скатерти: цельный вид',d:'Крупные подвесные картинки лучше смотрятся, когда крючок в тон карточке. Один бумажный лист надёжно держит нагрузку.',l:['S-крючок · печать в тон','Крючок и карточка едины','Для крупных форматов']},
      7:{k:'ОСНОВНОЙ СЦЕНАРИЙ',t:'Одежда для питомцев: яркие цвета',d:'Носки, одежда и поводки для питомцев — цветные бумажные крючки с живой печатью заметнее на полке.',l:['Цветной заказ · 1,5 мм','Живая печать привлекает взгляд','Гибко для мелких товаров']},
      8:{k:'ОСНОВНОЙ СЦЕНАРИЙ',t:'Аксессуары для волос: нужный размер',d:'Мелким товарам тесно на стандартном крючке. Малый фигурный крючок соразмернее и экономнее в оснастке.',l:['Фигурный заказ · малый размер','Соразмерен мелким товарам','Уникальные формы']},
      9:{k:'ОСНОВНОЙ СЦЕНАРИЙ',t:'Шарфы, шапки, перчатки: надёжный зажим',d:'Объёмные, неравномерные и часто без подвесной карточки. Фигурный крючок на заказ держит ткань напрямую — без лишней детали и повреждений.',l:['Фигурный крючок на заказ · 1,8 мм','Держит ткань без карточки','Не повреждает изделие']},
      10:{k:'ОСНОВНОЙ СЦЕНАРИЙ',t:'Товары для малышей: безопасный материал',d:'Детские носки, слюнявчики и нагрудники требуют безопасности. Чистая бумага без ламинации и клея — перерабатывается вместе с карточкой.',l:['Неламинированный крафт · 1,5 мм','Без клея и пластика','Переработка с бумажной карточкой']},
      11:{k:'ОСНОВНОЙ СЦЕНАРИЙ',t:'Косметические инструменты: частая ротация',d:'Салфетки, резинки и ватные диски висят в аптеках и часто пополняются. S-крючок стандартный быстро снимается, белый картон печатается чисто.',l:['S-крючок стандартный · белый картон','Быстрая смена при ротации','Чистая печать']},
      12:{k:'ОСНОВНОЙ СЦЕНАРИЙ',t:'Подарочные коробки: выше ценность',d:'Крючок с тиснением фольгой заметно повышает воспринимаемую ценность подарочной коробки, а нестандартная форма делает упаковку запоминающейся.',l:['Фольга · нестандартная форма','Внешний подвес подарочной коробки','Премиальный вид']}
    },
    ar: {
      1:{k:'السيناريو الرئيسي',t:'الجوارب القطنية: الأكثر شيوعًا',d:'خفيفة، متعددة الأصناف، سريعة التغيير. خطاف S من الكراف 1.5 مم بفتحة 5 مم يناسب ألواح العرض القياسية — وتغيير الصنف يعني تغيير الطباعة لا القالب.',l:['الجوارب القصيرة: 1.5 مم كافٍ','فتحة قياسية 5 مم جاهزة','بدّل الطباعة لا القوالب']},
      2:{k:'السيناريو الرئيسي',t:'الجوارب الرياضية والعبوات المتعددة: أقوى',d:'الأثقال تعلّق أطول، لذا يجب أن يقاوم الخطاف الانثناء. الكرتون السميك والفم الأوسع يمنعان الترهل.',l:['كرتون سميك 2.0 مم موصى به','فم أوسع للعبوات المتعددة','حمولة حتى ≤600 ج']},
      3:{k:'السيناريو الرئيسي',t:'الملابس الداخلية: عريض وقوي',d:'يحتاج جسمًا أوسع وحمولة أعلى. الفم الموسّع يمنع انزلاق الأشرطة؛ والأسود المطفي أو الرقائق يضيفان فخامة.',l:['خطاف تقيل · 2.0 مم كرتون رمادي','فم موسّع، الأشرطة لا تنزلق','أسود مطفي / رقائق']},
      4:{k:'السيناريو الرئيسي',t:'ملابس المنزل: تعليق مزدوج',d:'الأطقم الضخمة ذات الانسيابية الكبيرة. الخطاف التقيل يعلّق قطعتين على خطاف واحد، موفرًا مساحة الرف.',l:['خطاف تقيل · 1.8 مم','قطعتان على خطاف واحد','مثالي للأطقم المنسقة']},
      5:{k:'السيناريو الرئيسي',t:'المناشف: تُعلَّق مستوية',d:'الوزن متركز في جهة واحدة، فيميل الخطاف العادي. النوع التقيل يحافظ على الاستواء، والفتحة الأكبر تناسب القضبان السميكة.',l:['التقيل','فتحة أكبر للقضبان السميكة','توزيع متوازن']},
      6:{k:'السيناريو الرئيسي',t:'أغطية الوسائد والشراشف: مظهر موحد',d:'البطاقات الكبيرة تبدو أفضل حين يكون الخطاف بنفس لون البطاقة. الورقة الواحدة تحمل الوزن بثبات.',l:['خطاف S · طباعة بنفس اللون','تناسق بصري بين الخطاف والبطاقة','للبطاقات كبيرة الحجم']},
      7:{k:'السيناريو الرئيسي',t:'ملابس الحيوانات: ألوان زاهية',d:'جوارب وملابس وأحزمة الحيوانات تستخدم خطافات ورقية ملونة بطباعة حيوية، فتبرز على الرف.',l:['لون مخصص · 1.5 مم','طباعة حيوية تجذب النظر','مرن للقطع الصغيرة']},
      8:{k:'السيناريو الرئيسي',t:'إكسسوارات الشعر: الحجم المناسب',d:'القطع الصغيرة تبدو غير متناسبة على خطاف قياسي. الخطاف الصغير المقطوع أنسب وأقل تكلفة قالبًا.',l:['قطع مخصص · حجم صغير','تناسب القطع الصغيرة','أشكال فريدة']},
      9:{k:'السيناريو الرئيسي',t:'الأوشحة والقبعات والقفازات: يمسك جيدًا',d:'كبيرة، غير متساوية، وغالبًا بلا بطاقة تعليق. خطاف مقطوع حسب الطلب يمسك القماش مباشرة — بلا قطعة إضافية أو ضرر.',l:['خطاف مقطوع حسب الطلب · 1.8 مم','يمسك القماش بلا بطاقة','لا يضر المنتج']},
      10:{k:'السيناريو الرئيسي',t:'مستلزمات الأطفال: المادة الأكثر أمانًا',d:'جوارب الأطفال واللهايات والمرايل تتطلب أمانًا عاليًا. ورق خالٍ من التغليف والغراء — يُعاد تدويره مع البطاقة.',l:['كراف غير مطلي · 1.5 مم','بلا غراء أو قطع بلاستيكية','تدوير مع البطاقة الورقية']},
      11:{k:'السيناريو الرئيسي',t:'أدوات التجميل: تعبئة متكررة',d:'المناديل وأربطة الشعر والقطن تعلّق في متاجر العناية وتُعاد تعبئتها كثيرًا. خطاف S القياسي سريع، والكرتون الأبيض طباعته نظيفة.',l:['خطاف S القياسي · كرتون أبيض','سريع للتعبئة المتكررة','طباعة نظيفة']},
      12:{k:'السيناريو الرئيسي',t:'علب الهدايا: قيمة أعلى',d:'الخطاف المطبوع برقائق الهدايا يرفع القيمة المدركة للعلبة، والشكل المخصص يجعل التغليف لا يُنسى.',l:['رقائق معدنية · شكل مخصص','تعليق خارجي لعلب الهدايا','مظهر فاخر']}
    }
  };

  function getLang() {
    var l = (document.documentElement.lang || 'en').toLowerCase();
    return l.indexOf('zh') === 0 ? 'zh' : l.indexOf('ru') === 0 ? 'ru' : l.indexOf('ar') === 0 ? 'ar' : 'en';
  }

  function apply() {
    var m = location.hash.match(/case-(\d+)/);
    if (!m) return;                       // 没有场景锚点 → 保持默认（袜子）
    var n = parseInt(m[1], 10);
    if (!IMG[n]) return;
    var lang = getLang();
    var d = (DATA[lang] && DATA[lang][n]) || DATA.en[n];
    if (!d) return;

    // 顶部图片
    var img = document.getElementById('heroSceneImg');
    if (img) { img.src = '../assets/img/' + IMG[n]; img.alt = d.t; }

    // 顶部文案
    var kicker = document.getElementById('heroSceneKicker');
    var title = document.getElementById('heroSceneTitle');
    var desc = document.getElementById('heroSceneDesc');
    var list = document.getElementById('heroSceneList');
    if (kicker) kicker.textContent = d.k;
    if (title) title.textContent = d.t;
    if (desc) desc.textContent = d.d;
    if (list && d.l) {
      list.innerHTML = d.l.map(function (x) { return '<li>' + x + '</li>'; }).join('');
    }
  }

  // 首次 + 点击其他场景卡片后（hash 变化）都切换
  apply();
  window.addEventListener('hashchange', apply);
})();
