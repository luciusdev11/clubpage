// ===== CONFIG =====
const CONFIG = {
    DURATION: 1000,
    THRESHOLD: 0.6,
    KEY: 'hsg_language',
    LANG: 'en',
    FALLBACK: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=800&fit=crop'
  };
  
  // ===== TRANSLATIONS =====
  const translations = {
    en: {
      hero: {
        title: 'JOIN THE BATTLE',
        subtitle:
          'We compete, create, and build community across titles like League of Legends, Valorant, and Teamfight Tactics.',
        join: 'Join Discord',
        facebook: 'Facebook'
      },
      club: {
        title: 'Lotus Warriors Esports',
        teams: 'Teams:',
        when: 'When:',
        where: 'Where:',
        register: 'Register'
      },
      about: {
        title: 'About the Club',
        description:
          'We welcome all skill levels—from casual to varsity. Practice with teammates, produce broadcasts, and run campus tournaments.'
      },
      stats: { members: 'Members', teams: 'Teams', events: 'Events / Year' },
      footer: { backtop: 'Back to Top' }
    },
    vi: {
      hero: {
        title: 'THAM GIA CHIẾN TRƯỜNG',
        subtitle:
          'Chúng tôi thi đấu, sáng tạo và xây dựng cộng đồng qua các tựa game như Liên Minh Huyền Thoại, Valorant và Đấu Trường Chân Lý.',
        join: 'Tham gia Discord',
        facebook: 'Facebook'
      },
      club: {
        title: 'Đội Tuyển Lotus Warriors',
        teams: 'Đội tuyển:',
        when: 'Thời gian:',
        where: 'Địa điểm:',
        register: 'Đăng ký'
      },
      about: {
        title: 'Về Câu Lạc Bộ',
        description:
          'Chào đón mọi trình độ—từ giải trí đến tuyển. Luyện tập cùng đồng đội, sản xuất chương trình và tổ chức giải đấu trong trường.'
      },
      stats: { members: 'Thành viên', teams: 'Đội', events: 'Sự kiện/năm' },
      footer: { backtop: 'Lên đầu trang' }
    }
  };
  
  // ===== UTILS =====
  const $ = s => document.querySelector(s);
  const $$ = s => document.querySelectorAll(s);
  
  // ===== LANGUAGE MANAGER =====
  class LanguageManager {
    constructor() {
      this.lang = CONFIG.LANG;
      this.buttons = $$('.lang-btn');
      this.init();
    }
  
    init() {
      this.loadLang();
      this.buttons.forEach(btn =>
        btn.addEventListener('click', () => this.setLang(btn.dataset.lang))
      );
    }
  
    loadLang() {
      const saved = localStorage.getItem(CONFIG.KEY);
      if (saved && translations[saved]) this.setLang(saved);
      else this.detectLang();
    }
  
    detectLang() {
      const lang = navigator.language.startsWith('vi') ? 'vi' : 'en';
      this.setLang(lang);
    }
  
    setLang(lang) {
      if (!translations[lang]) return;
      this.lang = lang;
      localStorage.setItem(CONFIG.KEY, lang);
      document.documentElement.lang = lang;
      this.updateUI();
    }
  
    updateUI() {
      this.buttons.forEach(btn => {
        const active = btn.dataset.lang === this.lang;
        btn.classList.toggle('active', active);
        btn.setAttribute('aria-pressed', active);
      });
      $$('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n.split('.');
        let val = translations[this.lang];
        key.forEach(k => (val = val?.[k]));
        if (val) el.textContent = val;
      });
    }
  }
  
  // ===== STATS COUNTER =====
  class StatsCounter {
    constructor() {
      this.items = $$('.stat-number');
      if (!this.items.length) return;
      this.observer = new IntersectionObserver(e => this.animate(e), {
        threshold: CONFIG.THRESHOLD
      });
      this.items.forEach(el => this.observer.observe(el));
    }
  
    animate(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) this.run(entry.target);
      });
    }
  
    run(el) {
      const target = +el.dataset.count || 0;
      const plus = el.textContent.includes('+');
      const start = performance.now();
      const step = now => {
        const p = Math.min((now - start) / CONFIG.DURATION, 1);
        el.textContent = Math.floor(target * p) + (plus ? '+' : '');
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
  }
  
  // ===== IMAGE HANDLER =====
  class ImageLoader {
    constructor() {
      $$('img[loading="lazy"]').forEach(img =>
        img.addEventListener('error', () => {
          img.src = CONFIG.FALLBACK;
          img.alt = 'Image unavailable';
        })
      );
    }
  }
  
  // ===== SMOOTH SCROLL =====
  class SmoothScroll {
    constructor() {
      $$('a[href^="#"]').forEach(a =>
        a.addEventListener('click', e => this.scroll(e))
      );
    }
    scroll(e) {
      const id = e.currentTarget.getAttribute('href');
      if (!id || id === '#') return;
      const t = $(id);
      if (!t) return;
      e.preventDefault();
      window.scrollTo({ top: t.offsetTop - 70, behavior: 'smooth' });
    }
  }
  
  // ===== APP =====
  class App {
    constructor() {
      $('#year').textContent = new Date().getFullYear();
      new LanguageManager();
      new StatsCounter();
      new ImageLoader();
      new SmoothScroll();
      console.log('✓ HSG Website Initialized');
    }
  }
  
  // ===== INIT =====
  document.addEventListener('DOMContentLoaded', () => new App());
  