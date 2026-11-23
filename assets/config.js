/* ==================================================================
 * KALOZEN · 全站中央配置（唯一联系方式来源）
 * ------------------------------------------------------------------
 * 所有联系方式只在这里维护，HTML 中即使残留旧值也会被 contact.js
 * 在运行时按本配置覆盖。改这一处 = 全站生效。
 *
 * 【重要】VERIFIED 开关：
 *   true  = 发布下方联系方式（当前值来自网站所有者先前提供）
 *   false = 全站隐藏联系方式，改为“联系信息待核实”占位提示，
 *           询盘入口仍可用（表单提交/邮件客户端），但不在页面显示号码。
 *   简报 §1/§7 要求未核实不得发布；是否置 true 请由网站所有者决定。
 * ================================================================== */
(function () {
  'use strict';

  var CONFIG = {
    // —— 联系方式发布开关（未验证请设为 false）——
    // 邮箱 www.777910@gmail.com 保留原始拼写，等待所有者核实后再置 true。
    // WhatsApp 为已确认联系方式，其入口由 whatsapp.published 单独控制。
    verified: false,

    // —— 在线询盘投递开关 ——
    // false = 在线直投未启用：表单走邮件客户端（mailto），并显示明确的临时限制说明。
    // true  = 需先在 inquiry.js 顶部填写 WEB3FORMS_KEY 并配置收件邮箱。
    // 简报 §6：投递服务未确认前不启用，且不显示"提交成功"假象。
    // 【InquiryDeliveryEnabled】必须同时满足以下三项才允许置 true：
    //   1) WEB3FORMS_ACCESS_KEY 填入所有者提供的真实 Access Key；
    //   2) 收件邮箱已由所有者核实准确；
    //   3) 真实提交测试成功，且所有者确认 Gmail 收到邮件。
    // 当前三条均未满足，保持 false，绝不显示"提交成功"假象。
    inquiryDeliveryEnabled: false,

    // —— Web3Forms Access Key（第一阶段仅预留位置，严禁伪造）——
    // 所有者将提供真实 Access Key；提供前必须保持空字符串。
    // 即使填入，仍需 inquiryDeliveryEnabled=true 才会真正走在线提交。
    WEB3FORMS_ACCESS_KEY: '',

    // —— 业务联系方式 ——
    // WhatsApp 已由所有者确认为真实联系方式，入口单独发布。
    whatsapp: {
      number: '+8615515631079',
      url: 'https://wa.me/8615515631079',
      published: true   // 已确认，允许在页面显示 WhatsApp 入口
    },
    // 邮箱保留所有者提供的原始拼写，发布前等待核实；verified=false 时不显示。
    email: 'www.777910@gmail.com',

    // —— 公司信息 ——
    company: 'KALOZEN',
    location: { zh: '中国河南郑州', en: 'Zhengzhou, Henan, China', ru: 'Чжэнчжоу, Хэнань, Китай', ar: 'تشنغتشو، خنان، الصين' },
    exportPorts: { zh: '青岛 / 上海', en: 'Qingdao / Shanghai', ru: 'Циндао / Шанхай', ar: 'تشينغداو / شانغهاي' },

    // —— 社交链接（无则不发布）——
    social: {},

    // —— 生产与业务模式（简报 §3）——
    productionModel: {
      zh: '通过可靠的合作工厂与协同供应链生产',
      en: 'Manufacturing through reliable partner factories and a coordinated supply chain',
      ru: 'Производство через проверенных партнёров и скоординированную цепочку поставок',
      ar: 'التصنيع عبر مصانع شركاء موثوقة وسلسلة توريد منسقة'
    }
  };

  window.PH_CONFIG = CONFIG;
})();
