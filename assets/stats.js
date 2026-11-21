/* ==================================================================
 * 首页数据条 · 集中配置（改这一个文件，全站五页四语同步）
 * ------------------------------------------------------------------
 * 数据来源：供应商 1688 店铺公开数据
 *   - 累计出货 100,000+：单款商品显示「已售 10 万+」
 *   - 商品体验评分 5.0：店铺服务分中「商品体验」为 5.0（满分 5）
 *   - 客户回头率 24.4%：店铺公开回头率
 *   - 在售款式 20+：店铺在售商品 20 款
 * 以后更新数字：只改下面 NUMBERS 里的 value / label，保存即可。
 * ================================================================== */
(function () {
  'use strict';

  var NUMBERS = {
    shipped: {
      value: '100,000+',
      label: {
        zh: '累计出货（只）',
        en: 'Units shipped',
        ru: 'Отгружено, шт.',
        ar: 'قطعة تم شحنها'
      }
    },
    rating: {
      value: '5.0',
      label: {
        zh: '商品体验评分（5分制）',
        en: 'Product experience (out of 5)',
        ru: 'Оценка товара (из 5)',
        ar: 'تقييم المنتج (من 5)'
      }
    },
    repeat: {
      value: '24.4%',
      label: {
        zh: '客户回头率',
        en: 'Repeat order rate',
        ru: 'Повторных заказов',
        ar: 'معدل إعادة الطلب'
      }
    },
    styles: {
      value: '20+',
      label: {
        zh: '在售款式',
        en: 'Ready styles',
        ru: 'Готовых моделей',
        ar: 'موديلات جاهزة'
      }
    }
  };

  function currentLang() {
    var l = (document.documentElement.lang || 'zh').toLowerCase();
    if (l.indexOf('zh') === 0) return 'zh';
    if (l.indexOf('ru') === 0) return 'ru';
    if (l.indexOf('ar') === 0) return 'ar';
    return 'en';
  }

  function apply() {
    var lang = currentLang();
    var nodes = document.querySelectorAll('[data-stat]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var cfg = NUMBERS[el.getAttribute('data-stat')];
      if (!cfg) continue;
      var b = el.querySelector('b');
      var s = el.querySelector('span');
      if (b && cfg.value) b.textContent = cfg.value;
      if (s && cfg.label && cfg.label[lang]) s.textContent = cfg.label[lang];
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply);
  } else {
    apply();
  }
})();
