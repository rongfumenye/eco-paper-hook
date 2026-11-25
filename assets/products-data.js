/* ==================================================================
 * KALOZEN · 产品数据（唯一来源）
 * ------------------------------------------------------------------
 * 详情页 product.html?sku=XX 读取本文件的 skus 映射渲染 12 项字段。
 * 产品中心 products.html 读取 products 数组（P01–P03）渲染三张卡。
 *
 * 【数据原则 · 第三轮整改第三阶段】
 *  - 14 款在售 SKU：H01–H08（纸质挂钩）、B01–B06（纸质挂板）。
 *  - 名称：保留产品识别信息，去除未经确认的营销词（源头厂家/爆款/
 *    FSC 认证/可降解/年份等），不虚构。
 *  - 精确参数（尺寸/厚度/孔径/克重）：未经逐款实测，统一标注「待确认」，
 *    不编造替代数值。材质/工艺给可选范围并注明待确认。
 *  - 图片：均为原创示意图（concept=true），非实拍，不得冒充实物照片。
 * ================================================================== */
(function () {
  'use strict';

  // 通用可选范围（非逐款实测，供参考；精确值一律「待确认」）
  var COMMON = {
    materialOptions: {
      zh: '可选范围：牛皮卡纸 / 白卡纸 / 灰板（具体以样品与合同确认为准）',
      en: 'Options: kraft board / white card / greyboard (confirmed by sample and contract)'
    },
    printingOptions: {
      zh: '可选：专色印刷 / 四色印刷 / 烫金 / 击凸 / 压凹（待确认）',
      en: 'Options: spot colour / CMYK / foil stamping / emboss / deboss (to be confirmed)'
    },
    specNature: {
      zh: '尺寸、厚度、孔径等精确参数尚未逐款实测，标注为「待确认」；请索取规格书与样品后以书面确认为准。',
      en: 'Exact dimensions, thickness and hole sizes are not per-item tested and are marked "To be confirmed". Request a spec sheet and samples for written confirmation.'
    },
    conceptNote: {
      zh: '',
      en: ''
    }
  };

  // —— 产品中心三张卡（列表页专用，保持不变）——
  var PRODUCTS = [
    {
      sku: 'P01',
      code: { zh:'01 / 日常通用', en:'01 / Everyday' },
      name: { zh:'S 形标准钩', en:'S-Shape Standard Hook' },
      tagline: { zh:'袜子、内衣及轻薄服饰的通用款', en:'A versatile choice for socks, underwear and light apparel' },
      desc: { zh:'对称 S 形一体模切，挂在洞洞板上不歪不转。适用于袜子、内衣及轻薄服饰包装。', en:'Symmetrical S-shape die-cut in one piece, hangs straight on pegboard. For socks, underwear and light apparel.' },
      image: 'hook-detail.jpg', concept: true,
      specs: { thickness:{zh:'待确认',en:'To be confirmed'}, hole:{zh:'待确认',en:'To be confirmed'}, use:{zh:'袜子 / 内衣',en:'Socks / underwear'} },
      bullets: { zh:['对称 S 形，通用挂杆','一体模切成型','参数以样品为准'], en:['Symmetrical S-shape','One-piece die-cut','Specs confirmed by sample'] }
    },
    {
      sku: 'P02',
      code: { zh:'02 / 加厚承重', en:'02 / Heavy duty' },
      name: { zh:'加厚承重钩', en:'Heavy-Duty Hook' },
      tagline: { zh:'多件装与毛巾的承重方案', en:'A load-bearing option for multi-packs and towels' },
      desc: { zh:'加厚纸板，钩口加宽、肩部加固，适合多双装、毛巾等偏重商品长期陈列。', en:'Thicker board with a widened throat and reinforced shoulder for multi-packs and towels on long display.' },
      image: 'material-macro.jpg', concept: true,
      specs: { thickness:{zh:'待确认',en:'To be confirmed'}, hole:{zh:'待确认',en:'To be confirmed'}, use:{zh:'多双装 / 毛巾',en:'Multi-packs / towels'} },
      bullets: { zh:['加厚纸板','加宽钩口 · 加固肩部','参数以样品为准'], en:['Thicker board','Widened throat · reinforced shoulder','Specs confirmed by sample'] }
    },
    {
      sku: 'P03',
      code: { zh:'03 / 品牌定制', en:'03 / Custom' },
      name: { zh:'异形定制钩', en:'Custom Die-Cut Hook' },
      tagline: { zh:'你的形状、你的印刷、你的品牌', en:'Your shape, your print, your brand' },
      desc: { zh:'按你的轮廓开模，来图定制。可做专色印刷、烫金、击凸等后道工艺，适合礼盒与高端产品线。', en:'Die-cut to your outline from your artwork, with spot print, foil or emboss options for gift boxes and premium lines.' },
      image: 'gold-foil.jpg', concept: true,
      specs: { thickness:{zh:'待确认',en:'To be confirmed'}, hole:{zh:'按图定制',en:'Per drawing'}, use:{zh:'礼盒 / 高端产品线',en:'Gift boxes / premium lines'} },
      bullets: { zh:['来图开模，形状自由','专色印刷 / 烫金 / 击凸','参数以图纸与样品为准'], en:['Custom die-cut from artwork','Spot print / foil / emboss','Specs per drawing and sample'] }
    }
  ];

  var TBC = { zh:'待确认', en:'To be confirmed' };
  var NA_BOARD = { zh:'不适用（挂板类产品）', en:'N/A (display board type)' };
  var CUSTOM_ALL = {
    zh:'可定制：外形结构、尺寸、挂孔、纸张材质、印刷图案与表面工艺（具体以图纸与样品确认为准）。',
    en:'Customisable: shape/structure, dimensions, hanging hole, board material, print artwork and finishing (confirmed by drawing and sample).'
  };

  // —— 14 款在售 SKU ——
  var SKUS = {
    H01: {
      sku:'H01', type:'hook', image:'packaged-sock.jpg', concept:true,
      name:{ zh:'环保纸质袜钩', en:'Eco Paper Sock Hook' },
      features:{ zh:'一体模切的纸质挂钩，用于替代袜子包装上的塑料挂钩；可与吊卡配合悬挂陈列。', en:'A one-piece die-cut paper hook that replaces plastic hangers on sock packaging and works with header cards for display.' },
      use:{ zh:'袜子 / 船袜零售包装', en:'Socks / ankle socks retail packaging' },
      dimensions:TBC, material:COMMON.materialOptions, thickness:TBC, hole:TBC,
      printing:COMMON.printingOptions, customizable:CUSTOM_ALL
    },
    H02: {
      sku:'H02', type:'hook', image:'home/hero-paper-hooks.jpg', concept:true,
      name:{ zh:'外贸环保纸钩', en:'Export Eco Paper Hook' },
      features:{ zh:'面向出口包装的纸质挂钩，结构简洁，便于印刷品牌信息；适合批量包装配装。', en:'A paper hook for export packaging, simple in structure and easy to print brand information on; suited to bulk packing.' },
      use:{ zh:'出口袜子及服饰包装', en:'Export sock and apparel packaging' },
      dimensions:TBC, material:COMMON.materialOptions, thickness:TBC, hole:TBC,
      printing:COMMON.printingOptions, customizable:CUSTOM_ALL
    },
    H03: {
      sku:'H03', type:'hook', image:'home/hook-structures.jpg', concept:true,
      name:{ zh:'问号形纸袜钩', en:'Question-Mark Paper Hook' },
      features:{ zh:'问号形轮廓的纸质挂钩，钩部便于快速挂取，适合需要频繁上货补货的零售场景。', en:'A question-mark shaped paper hook whose open throat allows quick hanging and re-stocking in fast-turn retail.' },
      use:{ zh:'便利店 / 药妆店 / 快速补货陈列', en:'Convenience stores / pharmacies / fast restock displays' },
      dimensions:TBC, material:COMMON.materialOptions, thickness:TBC, hole:TBC,
      printing:COMMON.printingOptions, customizable:CUSTOM_ALL
    },
    H04: {
      sku:'H04', type:'hook', image:'hook-detail.jpg', concept:true,
      name:{ zh:'环保纸质挂钩', en:'Eco Paper Hook' },
      features:{ zh:'通用型纸质挂卡钩，一体成型，可与各类吊牌、挂卡组合使用。', en:'A general-purpose paper hang card hook, formed in one piece for use with a range of tags and header cards.' },
      use:{ zh:'通用商品挂卡', en:'General hang-card applications' },
      dimensions:TBC, material:COMMON.materialOptions, thickness:TBC, hole:TBC,
      printing:COMMON.printingOptions, customizable:CUSTOM_ALL
    },
    H05: {
      sku:'H05', type:'hook', image:'material-macro.jpg', concept:true,
      name:{ zh:'2 字形纸袜钩', en:'2-Shape Paper Sock Hook' },
      features:{ zh:'2 字形轮廓的纸质挂钩，肩部区域更宽，适合对挺括度有要求的陈列。', en:'A 2-shaped paper hook with a wider shoulder area for displays that need extra stiffness.' },
      use:{ zh:'需要挺括肩部的袜品陈列', en:'Sock displays requiring a stiffer shoulder' },
      dimensions:TBC, material:COMMON.materialOptions, thickness:TBC, hole:TBC,
      printing:COMMON.printingOptions, customizable:CUSTOM_ALL
    },
    H06: {
      sku:'H06', type:'hook', image:'gold-foil.jpg', concept:true,
      name:{ zh:'牛皮纸问号钩', en:'Kraft Paper Question-Mark Hook' },
      features:{ zh:'牛皮纸质感的问号形纸钩，可做印刷与烫金等表面工艺，兼顾实用与品牌呈现。', en:'A kraft-textured question-mark paper hook that supports printing and foil finishing for both function and branding.' },
      use:{ zh:'多双装 / 运动袜包装', en:'Multi-pack / sports sock packaging' },
      dimensions:TBC, material:COMMON.materialOptions, thickness:TBC, hole:TBC,
      printing:COMMON.printingOptions, customizable:CUSTOM_ALL
    },
    H07: {
      sku:'H07', type:'hook', image:'paper-material.jpg', concept:true,
      name:{ zh:'多用途纸钩', en:'Multi-Purpose Paper Hook' },
      features:{ zh:'多用途纸质挂钩，可按不同场景调整结构与尺寸，适用于衣架、帽挂、宠物用品悬挂等。', en:'A multi-purpose paper hook whose structure and size can be adapted for hangers, hat hooks, pet product hanging and more.' },
      use:{ zh:'衣架 / 帽子 / 宠物用品', en:'Hangers / hats / pet accessories' },
      dimensions:TBC, material:COMMON.materialOptions, thickness:TBC, hole:TBC,
      printing:COMMON.printingOptions, customizable:CUSTOM_ALL
    },
    H08: {
      sku:'H08', type:'hook', image:'color-range.jpg', concept:true,
      name:{ zh:'牛皮纸问号钩（零售款）', en:'Kraft Paper Question-Mark Hook (Retail)' },
      features:{ zh:'面向通用零售陈列的问号形纸钩，可做多色印刷，便于统一门店视觉。', en:'A question-mark paper hook for general retail display, available with multi-colour printing for consistent in-store visuals.' },
      use:{ zh:'通用零售陈列', en:'General retail display' },
      dimensions:TBC, material:COMMON.materialOptions, thickness:TBC, hole:TBC,
      printing:COMMON.printingOptions, customizable:CUSTOM_ALL
    },
    B01: {
      sku:'B01', type:'board', image:'home/sock-display-cards.jpg', concept:true,
      name:{ zh:'袜子展示挂板', en:'Sock Display Board' },
      features:{ zh:'纸质袜子展示挂板，可印刷品牌与尺码信息，配合纸钩或直接悬挂进行零售陈列。', en:'A paper sock display board that can carry brand and size printing, used with paper hooks or hung directly for retail display.' },
      use:{ zh:'袜子陈列 / 门店挂板', en:'Sock display / in-store hanging board' },
      dimensions:TBC, material:COMMON.materialOptions, thickness:TBC, hole:NA_BOARD,
      printing:COMMON.printingOptions, customizable:CUSTOM_ALL
    },
    B02: {
      sku:'B02', type:'board', image:'retail-shelf.jpg', concept:true,
      name:{ zh:'袜子展示纸板', en:'Sock Display Card' },
      features:{ zh:'展示用纸板，适合直播间、展会等场景集中陈列袜品，可定制印刷面。', en:'A display card suited to live-streaming and trade-show settings for grouped sock presentation, with a customisable print surface.' },
      use:{ zh:'直播间 / 展会陈列', en:'Live streaming / trade show display' },
      dimensions:TBC, material:COMMON.materialOptions, thickness:TBC, hole:NA_BOARD,
      printing:COMMON.printingOptions, customizable:CUSTOM_ALL
    },
    B03: {
      sku:'B03', type:'board', image:'paper-roll.jpg', concept:true,
      name:{ zh:'袜子陈列挂板', en:'Sock Merchandising Board' },
      features:{ zh:'用于门店陈列的纸质挂板，可承载多双袜子展示，支持品牌视觉印刷。', en:'A paper board for in-store merchandising that can present multiple pairs of socks and carry brand visuals.' },
      use:{ zh:'门店 / 工厂店陈列', en:'Store / factory-outlet display' },
      dimensions:TBC, material:COMMON.materialOptions, thickness:TBC, hole:NA_BOARD,
      printing:COMMON.printingOptions, customizable:CUSTOM_ALL
    },
    B04: {
      sku:'B04', type:'board', image:'home/socks-application.jpg', concept:true,
      name:{ zh:'直播展示挂板', en:'Live-Stream Display Board' },
      features:{ zh:'便于集中展示多款袜品的纸质挂板，适合直播、短视频等线上销售场景。', en:'A paper board for presenting multiple sock styles together, suited to live-streaming and short-video selling.' },
      use:{ zh:'直播 / 线上销售展示', en:'Live streaming / online sales display' },
      dimensions:TBC, material:COMMON.materialOptions, thickness:TBC, hole:NA_BOARD,
      printing:COMMON.printingOptions, customizable:CUSTOM_ALL
    },
    B05: {
      sku:'B05', type:'board', image:'product-grid.jpg', concept:true,
      name:{ zh:'长短款纸质袜板', en:'Paper Sock Board (Long / Short)' },
      features:{ zh:'提供长款与短款两种展示形态的纸质袜板，适配不同长度袜品与陈列位。', en:'A paper sock board available in long and short formats to suit different sock lengths and display spaces.' },
      use:{ zh:'长款 / 短款袜品展示', en:'Long / short sock presentation' },
      dimensions:TBC, material:COMMON.materialOptions, thickness:TBC, hole:NA_BOARD,
      printing:COMMON.printingOptions, customizable:CUSTOM_ALL
    },
    B06: {
      sku:'B06', type:'board', image:'home/custom-packaging.jpg', concept:true,
      name:{ zh:'多场景袜子挂板', en:'Multi-Scene Sock Display Board' },
      features:{ zh:'可适配多种陈列场景的袜子挂板，结构可定制，便于统一品牌展示效果。', en:'A sock display board adaptable to multiple retail scenarios, with customisable structure for consistent brand presentation.' },
      use:{ zh:'多场景零售陈列', en:'Multi-scene retail display' },
      dimensions:TBC, material:COMMON.materialOptions, thickness:TBC, hole:NA_BOARD,
      printing:COMMON.printingOptions, customizable:CUSTOM_ALL
    }
  };

  // P01–P03 也并入 skus，详情页 ?sku=P0x 仍可用（产品中心点击进入）
  PRODUCTS.forEach(function (p) {
    SKUS[p.sku] = {
      sku: p.sku, type: 'hook', image: p.image, concept: true,
      name: p.name, features: p.desc, use: p.specs.use,
      dimensions: TBC, material: COMMON.materialOptions,
      thickness: p.specs.thickness, hole: p.specs.hole,
      printing: COMMON.printingOptions, customizable: CUSTOM_ALL
    };
  });


  // —— 9 款环保食品包装及餐饮用品（Custom Paper Packaging 体系下新增）——
  // 说明：均为通用产品示意图（concept=true），非实拍；精确尺寸/材料/颜色/印刷/包装等参数
  //      未经逐款确认，统一标注「待确认 / Custom Specifications」，不编造认证或检测数据。
  var FOOD_SPEC = {
    dimensions: { zh:'Custom Specifications（尺寸待确认）', en:'Custom Specifications (dimensions to be confirmed)' },
    material: { zh:'Custom Specifications（材质待确认；可选范围以样品与合同为准）', en:'Custom Specifications (material to be confirmed; options subject to sample and contract)' },
    thickness: { zh:'Custom Specifications（厚度待确认）', en:'Custom Specifications (thickness to be confirmed)' },
    hole: { zh:'不适用（食品包装类产品）', en:'N/A (food packaging type)' },
    printing: { zh:'Custom Specifications（印刷方案待确认）', en:'Custom Specifications (printing to be confirmed)' },
    customizable: { zh:'可定制：尺寸、材质、颜色、印刷、包装与结构（具体以图纸与样品确认为准）。', en:'Customisable: dimensions, material, colour, printing, packing and structure (confirmed by drawing and sample).' }
  };
  var FOODS = {
    F01: {
      sku:'F01', type:'food', image:'sku/F01_kraft_bag.webp', concept:true,
      name:{ zh:'牛皮纸购物袋', en:'Kraft Paper Bags' },
      features:{ zh:'适合零售购物、礼品与外带的牛皮纸手提袋，可印刷品牌信息。', en:'Plain kraft paper shopping bags with handles for retail, gifts and takeaway, suitable for brand printing.' },
      use:{ zh:'零售购物 / 礼品 / 外带', en:'Retail / gifts / takeaway' },
      dimensions:FOOD_SPEC.dimensions, material:FOOD_SPEC.material, thickness:FOOD_SPEC.thickness, hole:FOOD_SPEC.hole,
      printing:FOOD_SPEC.printing, customizable:FOOD_SPEC.customizable
    },
    F02: {
      sku:'F02', type:'food', image:'sku/F02_food_box.webp', concept:true,
      name:{ zh:'外卖餐盒', en:'Takeaway Food Boxes' },
      features:{ zh:'用于外卖与堂食打包的纸质餐盒，结构可按需定制。', en:'Paper takeaway food boxes for delivery and takeout, with customisable structure.' },
      use:{ zh:'外卖 / 堂食打包', en:'Takeaway / dine-in takeout' },
      dimensions:FOOD_SPEC.dimensions, material:FOOD_SPEC.material, thickness:FOOD_SPEC.thickness, hole:FOOD_SPEC.hole,
      printing:FOOD_SPEC.printing, customizable:FOOD_SPEC.customizable
    },
    F03: {
      sku:'F03', type:'food', image:'sku/F03_paper_bowl.webp', concept:true,
      name:{ zh:'纸碗', en:'Paper Bowls' },
      features:{ zh:'一次性纸质碗，适合汤品、沙拉与轻食盛装。', en:'Disposable paper bowls for soups, salads and light meals.' },
      use:{ zh:'汤品 / 沙拉 / 轻食', en:'Soup / salad / light meals' },
      dimensions:FOOD_SPEC.dimensions, material:FOOD_SPEC.material, thickness:FOOD_SPEC.thickness, hole:FOOD_SPEC.hole,
      printing:FOOD_SPEC.printing, customizable:FOOD_SPEC.customizable
    },
    F04: {
      sku:'F04', type:'food', image:'sku/F04_paper_cup.webp', concept:true,
      name:{ zh:'纸杯', en:'Paper Cups' },
      features:{ zh:'用于热饮与冷饮的纸质杯，杯口与杯身规格可定制。', en:'Paper cups for hot and cold drinks, with customisable rim and body specs.' },
      use:{ zh:'热饮 / 冷饮', en:'Hot / cold beverages' },
      dimensions:FOOD_SPEC.dimensions, material:FOOD_SPEC.material, thickness:FOOD_SPEC.thickness, hole:FOOD_SPEC.hole,
      printing:FOOD_SPEC.printing, customizable:FOOD_SPEC.customizable
    },
    F05: {
      sku:'F05', type:'food', image:'sku/F05_soup_container.webp', concept:true,
      name:{ zh:'纸质汤碗', en:'Paper Soup Containers' },
      features:{ zh:'带盖纸质汤碗，适合汤品与流质食品的打包运输。', en:'Paper soup containers with lids for soups and liquid foods, suitable for takeaway.' },
      use:{ zh:'汤品 / 流质食品打包', en:'Soup / liquid food takeaway' },
      dimensions:FOOD_SPEC.dimensions, material:FOOD_SPEC.material, thickness:FOOD_SPEC.thickness, hole:FOOD_SPEC.hole,
      printing:FOOD_SPEC.printing, customizable:FOOD_SPEC.customizable
    },
    F06: {
      sku:'F06', type:'food', image:'sku/F06_food_tray.webp', concept:true,
      name:{ zh:'纸托盘', en:'Paper Food Trays' },
      features:{ zh:'浅型纸质托盘，适合烘焙、小吃与生鲜陈列。', en:'Shallow paper food trays for bakery, snacks and fresh food display.' },
      use:{ zh:'烘焙 / 小吃 / 生鲜', en:'Bakery / snacks / fresh food' },
      dimensions:FOOD_SPEC.dimensions, material:FOOD_SPEC.material, thickness:FOOD_SPEC.thickness, hole:FOOD_SPEC.hole,
      printing:FOOD_SPEC.printing, customizable:FOOD_SPEC.customizable
    },
    F07: {
      sku:'F07', type:'food', image:'sku/F07_paper_straw.webp', concept:true,
      name:{ zh:'纸吸管', en:'Paper Straws' },
      features:{ zh:'可定制长度与直径的纸质饮用吸管。', en:'Paper drinking straws with customisable length and diameter.' },
      use:{ zh:'饮品搭配', en:'Beverage pairing' },
      dimensions:FOOD_SPEC.dimensions, material:FOOD_SPEC.material, thickness:FOOD_SPEC.thickness, hole:FOOD_SPEC.hole,
      printing:FOOD_SPEC.printing, customizable:FOOD_SPEC.customizable
    },
    F08: {
      sku:'F08', type:'food', image:'sku/F08_napkin.webp', concept:true,
      name:{ zh:'纸巾', en:'Paper Napkins' },
      features:{ zh:'餐饮用纸质纸巾，可印刷品牌图案。', en:'Paper napkins for food service, suitable for brand printing.' },
      use:{ zh:'餐饮 / 餐桌', en:'Food service / table' },
      dimensions:FOOD_SPEC.dimensions, material:FOOD_SPEC.material, thickness:FOOD_SPEC.thickness, hole:FOOD_SPEC.hole,
      printing:FOOD_SPEC.printing, customizable:FOOD_SPEC.customizable
    },
    F09: {
      sku:'F09', type:'food', image:'sku/F09_wooden_cutlery.webp', concept:true,
      name:{ zh:'木质餐具', en:'Wooden Cutlery' },
      features:{ zh:'木质叉、刀、勺等一次性餐具，适合外带与餐饮配套。', en:'Wooden disposable cutlery (fork, knife, spoon) for takeaway and catering.' },
      use:{ zh:'外带 / 餐饮配套', en:'Takeaway / catering' },
      dimensions:FOOD_SPEC.dimensions, material:FOOD_SPEC.material, thickness:FOOD_SPEC.thickness, hole:FOOD_SPEC.hole,
      printing:FOOD_SPEC.printing, customizable:FOOD_SPEC.customizable
    },
  };

  // 合并 F01–F09 到 skus，供 ?sku=F0x 详情页读取
  Object.keys(FOODS).forEach(function (k) { SKUS[k] = FOODS[k]; });

  window.PH_PRODUCTS = {
    common: COMMON,
    products: PRODUCTS,
    skus: SKUS,
    foods: FOODS
  };
})();
