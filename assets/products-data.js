/* ==================================================================
 * PAPERHOOK · 产品数据（数据驱动详情页 product-detail.html?sku=XX）
 * ------------------------------------------------------------------
 * 数据来源：现有产品页公开规格区间，均为「常规范围」，非逐款实测值。
 * 图片：使用站点现有概念/通用图，均已标注 concept=true（非实拍）。
 * 补真实素材：把 image 换成实拍路径、concept 改 false、填 spec 精确值即可。
 * ================================================================== */
(function () {
  'use strict';

  // 通用规格区间（全系列适用，逐款精确值待补）
  var COMMON = {
    material: { zh: 'FSC® 牛皮卡 / 灰板', en: 'FSC® kraft board / greyboard', ru: 'Крафт / серый картон (FSC®)', ar: 'كرافت / كرتون رمادي (FSC®)' },
    thickness: '1.5 / 1.8 / 2.0 mm',
    gsm: '300–450 gsm',
    hole: '4 / 5 / 6 mm',
    mouth: '8–22 mm',
    load: '150–600 g',
    printing: { zh: '1–4 色专色，大豆油墨', en: '1–4 spot colours, soy ink', ru: '1–4 цвета, соевые чернила', ar: '1–4 ألوان، حبر صويا' },
    finish: { zh: '烫金 / 击凸 / 压凹', en: 'Foil / emboss / deboss', ru: 'Фольга / тиснение', ar: 'رقائق / نقش بارز' },
    pack: '1,000 / 5,000 pcs per carton',
    lead: '7–12 days'
  };

  // 14 款现成 SKU —— 名称来自现有页面；应用/推荐钩型为合理归类，规格用通用区间
  var SKUS = {
    H01: { cat: 'S', name: { zh:'纸质环保可回收纸袜钩', en:'Eco recyclable paper sock hook', ru:'Эко бумажный крючок для носков', ar:'خطاف ورقي قابل لإعادة التدوير' }, img:'packaged-sock.jpg', concept:true, use:{zh:'袜子 / 船袜',en:'Socks / ankle',ru:'Носки',ar:'جوارب'}, hook:'S' },
    H02: { cat: 'S', name: { zh:'现货 FSC 外贸环保纸钩', en:'In-stock FSC export paper hook', ru:'FSC бумажный крючок в наличии', ar:'خطاف FSC جاهز للتصدير' }, img:'retail-shelf.jpg', concept:true, use:{zh:'出口袜子包装',en:'Export sock packaging',ru:'Экспортная упаковка',ar:'تغليف جوارب للتصدير'}, hook:'S' },
    H03: { cat: 'Q', name: { zh:'日韩爆款袜钩 问号钩', en:'Question-mark hook (JP/KR bestseller)', ru:'Крючок «вопрос» (бестселлер)', ar:'خطاف علامة الاستفهام' }, img:'color-range.jpg', concept:true, use:{zh:'便利店 / 药妆店补货',en:'Convenience / pharmacy restock',ru:'Частая ротация',ar:'تعبئة سريعة'}, hook:'Q' },
    H04: { cat: 'S', name: { zh:'环保可回收纸袜钩 纸质挂钩', en:'Recyclable paper hook', ru:'Перерабатываемый бумажный крючок', ar:'خطاف ورقي قابل للتدوير' }, img:'hook-detail.jpg', concept:true, use:{zh:'通用挂卡',en:'General hang card',ru:'Универсальный',ar:'بطاقة تعليق عامة'}, hook:'S' },
    H05: { cat: 'S', name: { zh:'钢板纸袜钩 2 字钩', en:'Steel-plate style paper hook (2-shape)', ru:'Бумажный крючок «2»', ar:'خطاف ورقي شكل 2' }, img:'hook-detail.jpg', concept:true, use:{zh:'需要挺括肩部',en:'Stiff shoulder needed',ru:'Жёсткое плечо',ar:'كتف صلب'}, hook:'S' },
    H06: { cat: 'Q', name: { zh:'源头厂家 FSC 牛皮纸问号钩', en:'Factory FSC kraft question hook', ru:'FSC крафт крючок «вопрос»', ar:'خطاف كرافت FSC' }, img:'gold-foil.jpg', concept:true, use:{zh:'多双装 / 运动袜',en:'Multi-pack / sports',ru:'Мультипаки',ar:'عبوات متعددة'}, hook:'Q' },
    H07: { cat: 'C', name: { zh:'环保可降解多用途纸钩（衣架 / 帽钩 / 宠物钩）', en:'Multi-purpose paper hook (hanger / hat / pet)', ru:'Многоцелевой крючок', ar:'خطاف متعدد الاستخدامات' }, img:'paper-material.jpg', concept:true, use:{zh:'落地衣架 / 帽子 / 宠物',en:'Floor hanger / hat / pet',ru:'Вешалка / шапка / питомцы',ar:'علاقات / قبعات / حيوانات'}, hook:'Custom' },
    H08: { cat: 'Q', name: { zh:'2026 源头工厂 FSC 牛皮纸问号钩', en:'2026 Factory FSC kraft question hook', ru:'FSC крючок «вопрос» 2026', ar:'خطاف كرافت FSC 2026' }, img:'packaged-sock.jpg', concept:true, use:{zh:'通用零售',en:'General retail',ru:'Розница',ar:'بيع بالتجزئة'}, hook:'Q' },
    B01: { cat: 'Board', name: { zh:'袜子挂板 牛皮纸 / 白卡纸 四季款', en:'Sock display board kraft/white', ru:'Подвесная доска для носков', ar:'لوحة عرض الجوارب' }, img:'product-grid.jpg', concept:true, use:{zh:'袜子陈列板',en:'Sock display',ru:'Демонстрация носков',ar:'عرض الجوارب'}, hook:'Board' },
    B02: { cat: 'Board', name: { zh:'新款袜子展示纸板（直播间 / 展会）', en:'Sock display board (live / expo)', ru:'Доска для выставок', ar:'لوحة عرض للمعارض' }, img:'retail-shelf.jpg', concept:true, use:{zh:'直播 / 展会',en:'Live streaming / expo',ru:'Выставки',ar:'بث / معارض'}, hook:'Board' },
    B03: { cat: 'Board', name: { zh:'工厂店袜子挂板 牛皮纸 / 白卡纸', en:'Factory store sock board', ru:'Доска для фирменного магазина', ar:'لوحة متجر المصنع' }, img:'paper-roll.jpg', concept:true, use:{zh:'工厂店陈列',en:'Factory store',ru:'Фирменный магазин',ar:'متجر المصنع'}, hook:'Board' },
    B04: { cat: 'Board', name: { zh:'展示袜子挂板 直播间专用', en:'Sock display board for live streaming', ru:'Доска для прямой трансляции', ar:'لوحة للبث المباشر' }, img:'color-range.jpg', concept:true, use:{zh:'直播间',en:'Live streaming',ru:'Трансляции',ar:'بث مباشر'}, hook:'Board' },
    B05: { cat: 'Board', name: { zh:'现货纸质袜板 长款 / 短款', en:'In-stock paper sock board long/short', ru:'Доска длинная/короткая', ar:'لوحة طويلة/قصيرة' }, img:'packaged-sock.jpg', concept:true, use:{zh:'长款 / 短款袜',en:'Long / short socks',ru:'Длинные/короткие',ar:'جوارب طويلة/قصيرة'}, hook:'Board' },
    B06: { cat: 'Board', name: { zh:'袜子挂板 多场景展示', en:'Sock display board multi-scene', ru:'Универсальная доска', ar:'لوحة متعددة المشاهد' }, img:'product-grid.jpg', concept:true, use:{zh:'多场景',en:'Multi-scene',ru:'Разные сцены',ar:'مشاهد متعددة'}, hook:'Board' }
  };

  // 六大钩型类别
  var CATS = {
    S: { zh:'S 形纸钩', en:'S Shape Paper Hooks', ru:'S-крючки', ar:'خطافات S' },
    Q: { zh:'问号纸钩', en:'Question Mark Paper Hooks', ru:'Крючки «вопрос»', ar:'خطافات علامة الاستفهام' },
    D: { zh:'双头纸钩', en:'Double-Head Paper Hooks', ru:'Двухголовые крючки', ar:'خطافات برأسين' },
    C: { zh:'带夹 / 异形纸钩', en:'Clip & Custom Die-Cut Hooks', ru:'Зажимные / фигурные', ar:'خطافات مشبك / مخصصة' },
    H: { zh:'加厚承重纸钩', en:'Heavy-Duty Paper Hooks', ru:'Прочные крючки', ar:'خطافات تقيلة' },
    Board: { zh:'袜子挂板 / 展示纸板', en:'Paper Display Boards', ru:'Подвесные доски', ar:'ألواح العرض' }
  };

  window.PH_PRODUCTS = { common: COMMON, skus: SKUS, cats: CATS };
})();
