/* ==================================================================
 * PAPERHOOK · 首页产品展示弹窗
 * ------------------------------------------------------------------
 * 【集中配置，改这一个文件全站五页四语生效】
 *  - POPUP_I18N : 四语标题、文案、按钮文字
 *  - IMAGE      : 弹窗主图（相对 assets/img/ 目录）
 *  - DELAY      : 打开页面后多久弹出（毫秒）
 *  - SHOW_EVERY_TIME : true=每次刷新都弹；false=关闭后本次会话不再弹（推荐）
 * ================================================================== */
(function () {
  'use strict';

  // ---------- 配置区 ----------
  var IMAGE = 'product-grid.jpg';       // 产品主图，可换成 color-range.jpg / hook-detail.jpg 等
  var DELAY = 700;                       // 延时 0.7 秒弹出
  var SHOW_EVERY_TIME = false;           // false=关闭后本次会话不再弹；true=每次刷新都弹
  var SESSION_KEY = 'ph-popup-closed';

  var POPUP_I18N = {
    zh: {
      kicker: 'FSC® 认证 · 环保纸制品',
      title: '把塑料，<br>从货架上拿下来',
      desc: '一张 FSC® 认证牛皮纸，一体模切成型。替代袜子包装上的塑料挂钩，可回收、可印刷——10000 只起订。',
      feats: ['FSC® 认证', '无塑料', '可回收'],
      btnProduct: '看看产品',
      btnWhats: 'WhatsApp 咨询',
      foot: '10000 只起订 · 支持定制印刷 · 全球配送',
      close: '关闭'
    },
    en: {
      kicker: 'FSC® CERTIFIED · ECO PAPER',
      title: 'Take the plastic<br>off the shelf',
      desc: 'One sheet of FSC®-certified kraft paper, die-cut into shape. Replaces plastic hooks on sock packaging — recyclable, printable, 10,000 pcs MOQ.',
      feats: ['FSC® certified', 'Plastic-free', 'Recyclable'],
      btnProduct: 'View products',
      btnWhats: 'Chat on WhatsApp',
      foot: 'MOQ 10,000 · Custom print · Worldwide shipping',
      close: 'Close'
    },
    ru: {
      kicker: 'СЕРТИФИКАТ FSC® · ЭКО БУМАГА',
      title: 'Уберите пластик<br>с полки',
      desc: 'Один лист крафт-бумаги с сертификатом FSC®, вырубленный по форме. Заменяет пластиковые крючки на упаковке носков — перерабатываемый, печатный, от 10 000 шт.',
      feats: ['Сертификат FSC®', 'Без пластика', 'Перерабатываемый'],
      btnProduct: 'Смотреть продукцию',
      btnWhats: 'Написать в WhatsApp',
      foot: 'От 10 000 шт. · Печать на заказ · Доставка по миру',
      close: 'Закрыть'
    },
    ar: {
      kicker: 'معتمد FSC® · ورق صديق للبيئة',
      title: 'أزل البلاستيك<br>من الرف',
      desc: 'ورقة كرافت معتمدة من FSC® تُقطع بالقالب لتحل محل الخطافات البلاستيكية في تغليف الجوارب — قابلة لإعادة التدوير والطباعة، الحد الأدنى 10,000 قطعة.',
      feats: ['معتمد FSC®', 'خالٍ من البلاستيك', 'قابل للتدوير'],
      btnProduct: 'عرض المنتجات',
      btnWhats: 'تواصل عبر واتساب',
      foot: 'الحد الأدنى 10,000 · طباعة مخصصة · شحن عالمي',
      close: 'إغلاق'
    }
  };

  // ---------- 语言与路径 ----------
  var docLang = (document.documentElement.lang || 'en').toLowerCase();
  var LANG = docLang.indexOf('zh') === 0 ? 'zh'
    : docLang.indexOf('ru') === 0 ? 'ru'
    : docLang.indexOf('ar') === 0 ? 'ar' : 'en';
  var t = POPUP_I18N[LANG] || POPUP_I18N.en;

  // 判断脚本路径前缀：语言页是 ../assets/，根落地页是 assets/
  var src = '';
  var scripts = document.querySelectorAll('script[src*="popup.js"]');
  if (scripts.length) src = scripts[scripts.length - 1].getAttribute('src') || '';
  var isSub = src.indexOf('../') === 0;
  var ASSET = isSub ? '../assets/' : 'assets/';
  var productHref = isSub ? 'products.html' : 'zh/products.html';
  var waHref = 'https://wa.me/8615515601979';

  var dir = LANG === 'ar' ? 'rtl' : 'ltr';

  // ---------- 样式 ----------
  var css = ''
    + '.ph-pop{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;opacity:0;visibility:hidden;transition:opacity .35s ease,visibility .35s;font-family:inherit}'
    + '.ph-pop.on{opacity:1;visibility:visible}'
    + '.ph-pop-shade{position:absolute;inset:0;background:rgba(14,44,36,.6);backdrop-filter:blur(4px)}'
    + '.ph-pop-card{position:relative;width:min(560px,100%);max-height:calc(100vh - 40px);overflow:auto;background:var(--paper,#f9f6ef);border-radius:24px;box-shadow:0 34px 80px -28px rgba(0,0,0,.55);transform:translateY(22px) scale(.97);transition:transform .42s cubic-bezier(.2,.8,.2,1);direction:' + dir + '}'
    + '.ph-pop.on .ph-pop-card{transform:none}'
    + '.ph-pop-x{position:absolute;top:14px;right:14px;z-index:3;width:34px;height:34px;border:0;border-radius:50%;background:rgba(255,255,255,.92);color:#14231d;font-size:21px;line-height:1;cursor:pointer;display:grid;place-items:center;box-shadow:0 4px 12px rgba(0,0,0,.18)}'
    + '.ph-pop-x:hover{background:#fff;transform:rotate(90deg)}'
    + '[dir="rtl"] .ph-pop-x{right:auto;left:14px}'
    + '.ph-pop-media{width:100%;height:230px;overflow:hidden;background:#e8e0cf}'
    + '.ph-pop-media img{width:100%;height:100%;object-fit:cover;display:block}'
    + '.ph-pop-body{padding:26px 30px 28px}'
    + '.ph-pop-kicker{font-size:11px;letter-spacing:.18em;color:#b57c42;font-weight:700;text-transform:uppercase}'
    + '.ph-pop-title{font-family:Georgia,"Times New Roman",serif;font-size:clamp(27px,4vw,38px);line-height:1.16;color:#14231d;margin:10px 0 12px;font-weight:600}'
    + '.ph-pop-desc{font-size:14px;line-height:1.75;color:#3a4b43;margin:0 0 16px}'
    + '.ph-pop-feats{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px}'
    + '.ph-pop-feats span{font-size:12px;color:#1c6350;background:rgba(28,99,80,.09);border:1px solid rgba(28,99,80,.18);border-radius:999px;padding:5px 12px}'
    + '.ph-pop-btns{display:flex;flex-wrap:wrap;gap:10px}'
    + '.ph-pop-btns a{flex:1 1 auto;text-align:center;padding:13px 16px;border-radius:11px;font-size:14px;font-weight:700;text-decoration:none;transition:transform .2s,filter .2s}'
    + '.ph-pop-btns a:hover{transform:translateY(-2px);filter:brightness(1.05)}'
    + '.ph-pop-btns .p{background:#0e2c24;color:#fff}'
    + '.ph-pop-btns .s{background:#25D366;color:#fff}'
    + '.ph-pop-foot{margin-top:16px;font-size:11px;letter-spacing:.03em;color:#7b877f;text-align:center}'
    + '@media(max-width:520px){.ph-pop-media{height:180px}.ph-pop-body{padding:20px 20px 22px}.ph-pop-btns a{flex:1 1 100%}}';

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // ---------- DOM ----------
  function build() {
    var wrap = document.createElement('div');
    wrap.className = 'ph-pop';
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-modal', 'true');
    wrap.innerHTML = ''
      + '<div class="ph-pop-shade" data-close></div>'
      + '<div class="ph-pop-card">'
      + '<button class="ph-pop-x" type="button" data-close aria-label="' + t.close + '">×</button>'
      + '<div class="ph-pop-media"><img src="' + ASSET + 'img/' + IMAGE + '" alt="PAPERHOOK" loading="eager"></div>'
      + '<div class="ph-pop-body">'
      + '<div class="ph-pop-kicker">' + t.kicker + '</div>'
      + '<h2 class="ph-pop-title">' + t.title + '</h2>'
      + '<p class="ph-pop-desc">' + t.desc + '</p>'
      + '<div class="ph-pop-feats">' + t.feats.map(function (f) { return '<span>' + f + '</span>'; }).join('') + '</div>'
      + '<div class="ph-pop-btns">'
      + '<a class="p" href="' + productHref + '">' + t.btnProduct + ' →</a>'
      + '<a class="s" href="' + waHref + '" target="_blank" rel="noopener">' + t.btnWhats + '</a>'
      + '</div>'
      + '<div class="ph-pop-foot">' + t.foot + '</div>'
      + '</div></div>';
    document.body.appendChild(wrap);

    function close() {
      wrap.classList.remove('on');
      try { sessionStorage.setItem(SESSION_KEY, '1'); } catch (e) {}
    }
    wrap.querySelectorAll('[data-close]').forEach(function (el) {
      el.addEventListener('click', close);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
    return wrap;
  }

  var closed = false;
  try { closed = sessionStorage.getItem(SESSION_KEY) === '1'; } catch (e) {}
  if (SHOW_EVERY_TIME || !closed) {
    setTimeout(function () {
      var el = build();
      requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.add('on'); }); });
    }, DELAY);
  }
})();
