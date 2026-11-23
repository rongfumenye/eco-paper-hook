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

    // —— 在线询盘后端接口（第一阶段整改） ——
    // 表单统一 POST 到此真实后端：functions/api/inquiry.js（Cloudflare Function）。
    // 后端是否真正投递由其服务端环境变量决定，前端不再持有任何密钥。
    // 前端仅根据后端返回的 success 字段显示成功/失败，绝不谎报成功。
    inquiryEndpoint: '/api/inquiry',

    // —— 在线询盘投递状态（只读镜像，由后端健康检查结果驱动）——
    // 注意：真正的门控在服务端（收件邮箱 + 邮件凭据 + KV 存储三者齐备）。
    // 此值仅供前端在后端尚未配置时选择 mailto 兜底，保留字段以兼容旧逻辑。
    // 当前服务端三项配置均未提供，保持 false，绝不显示"提交成功"假象。
    inquiryDeliveryEnabled: false,

    // 【重要·安全】密钥不存前端：
    // 旧版 WEB3FORMS_ACCESS_KEY 已从前端移除。所有密钥现只存于服务端环境变量：
    //   INQUIRY_TO_EMAIL / MAIL_API_KEY / MAIL_FROM / INQUIRY_WEBHOOK_URL / INQUIRY_DB(KV)
    // 详见 docs/INQUIRY-BACKEND-SETUP.md。前端代码与仓库中不存在任何真实密钥。

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
