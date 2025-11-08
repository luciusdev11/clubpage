// Utilities
function clamp(value, min, max) {
	return Math.min(max, Math.max(min, value));
}

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Count-up animation for stats
const statEls = document.querySelectorAll('.stat .num');
if (statEls.length) {
	const statObserver = new IntersectionObserver((entries, obs) => {
		entries.forEach(entry => {
			if (!entry.isIntersecting) return;
			const el = entry.target;
			const target = parseInt(el.getAttribute('data-count') || '0', 10);
			let start = 0;
			const duration = 900;
			const t0 = performance.now();
			function frame(now) {
				const p = clamp((now - t0) / duration, 0, 1);
				el.textContent = Math.floor(start + (target - start) * p) + (el.textContent.includes('+') ? '+' : '');
				if (p < 1) requestAnimationFrame(frame);
			}
			requestAnimationFrame(frame);
			obs.unobserve(el);
		});
	}, { threshold: 0.6 });
	statEls.forEach(el => statObserver.observe(el));
}

// Scroll-driven slideshow
(function setupScrollSlideshow() {
	const waypoints = Array.from(document.querySelectorAll('.slide-waypoint'));
	const img = document.getElementById('active-slide');
	const caption = document.getElementById('active-caption');
	if (!waypoints.length || !img || !caption) return;

	let currentIndex = -1;
	const observer = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				const idx = waypoints.indexOf(entry.target);
				if (idx !== -1 && idx !== currentIndex) {
					currentIndex = idx;
					const src = entry.target.getAttribute('data-src');
					const text = entry.target.getAttribute('data-caption') || '';
					// pre-load next image for smoother transition
					const preload = new Image();
					preload.src = src;
					preload.onload = () => {
						img.style.opacity = '0';
						setTimeout(() => {
							img.src = src;
							caption.textContent = text;
							img.style.opacity = '1';
						}, 150);
					};
				}
			}
		});
	}, { threshold: 0.3 });

	waypoints.forEach(el => observer.observe(el));
})();

// Socials carousel controls
(function setupCarousel() {
    const track = document.getElementById('sponsors-track') || document.getElementById('socials-track');
    const prev = document.querySelector('.carousel .prev');
    const next = document.querySelector('.carousel .next');
    if (!track) return;

	function getCardWidth() {
		const first = track.querySelector('.carousel-card');
		if (!first) return 260;
		const style = getComputedStyle(first);
		return first.clientWidth + parseFloat(style.marginLeft) + parseFloat(style.marginRight) + 12;
	}

    if (prev && next) {
        prev.addEventListener('click', () => {
            track.scrollBy({ left: -getCardWidth(), behavior: 'smooth' });
        });
        next.addEventListener('click', () => {
            track.scrollBy({ left: getCardWidth(), behavior: 'smooth' });
        });
    }

	// Autoplay with page visibility handling
    if (next) {
        let autoplayInterval;
        
        function startAutoplay() {
            if (autoplayInterval) clearInterval(autoplayInterval);
            autoplayInterval = setInterval(() => next.click(), 3000);
        }
        
        function stopAutoplay() {
            if (autoplayInterval) clearInterval(autoplayInterval);
        }
        
        // Stop when page is hidden
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopAutoplay();
            } else {
                startAutoplay();
            }
        });
        
        track.addEventListener('mouseenter', stopAutoplay);
        track.addEventListener('mouseleave', startAutoplay);
        
        // Start initially if page is visible
        if (!document.hidden) {
            startAutoplay();
        }
    }
})();

// ============================================
// LANGUAGE TOGGLE - SIMPLIFIED AND WORKING
// ============================================
(function setupI18n() {
    const translations = {
        en: {
            hero: { 
                title: 'Join our team!', 
                subtitle: 'We compete, create, and build community across titles like League, Valorant, and Teamfight Tactics. Join scrims, events, and tournaments all semester long.', 
                join: 'Join Discord', 
                readBlog: 'Fanpage Facebook' 
            },
            club: { 
                teamsLabel: 'Teams:', 
                whenLabel: 'When:', 
                whereLabel: 'Where:' 
            },
            common: { 
                learnMore: 'Register' 
            },
            about: { 
                title: 'About the Club', 
                body: 'We welcome all skill levels—from casual to varsity. Practice with teammates, produce broadcasts, and run campus tournaments. Our leadership team partners with student orgs and sponsors to bring esports to everyone.' 
            },
            stats: { 
                membersLabel: 'Members', 
                teamsLabel: 'Teams', 
                eventsLabel: 'Events / yr' 
            },
            showcase: { 
                title: 'Highlights', 
                muted: 'Scroll to browse our latest match days, and community events.' 
            },
            blog: { 
                title: 'Blog' 
            },
            sponsors: { 
                title: 'Titles Sponsors', 
                muted: ' ' 
            },
            footer: { 
                backToTop: 'Back to top →' 
            }
        },
        vi: {
            hero: { 
                title: 'Gia nhập với chúng tôi!', 
                subtitle: 'Chúng tôi thi đấu, sáng tạo và xây dựng cộng đồng qua các tựa game như Liên Minh Huyền Thoại, Valorant và Đấu Trường Chân Lý. Tham gia scrim, sự kiện và giải đấu suốt học kỳ.', 
                join: 'Tham gia Discord', 
                readBlog: 'Trang Facebook' 
            },
            club: { 
                teamsLabel: 'Đội tuyển:', 
                whenLabel: 'Thời gian:', 
                whereLabel: 'Địa điểm:' 
            },
            common: { 
                learnMore: 'Đăng ký' 
            },
            about: { 
                title: 'Về Câu lạc bộ', 
                body: 'Chào đón mọi trình độ – từ giải trí đến tuyển. Luyện tập cùng đồng đội, sản xuất chương trình và tổ chức giải đấu trong trường. Ban điều hành hợp tác với các tổ chức sinh viên và nhà tài trợ để lan tỏa esports.' 
            },
            stats: { 
                membersLabel: 'Thành viên', 
                teamsLabel: 'Đội', 
                eventsLabel: 'Sự kiện/năm' 
            },
            showcase: { 
                title: 'Điểm nhấn', 
                muted: 'Cuộn để xem ngày thi đấu, sự kiện cộng đồng.' 
            },
            blog: { 
                title: 'Bài viết' 
            },
            sponsors: { 
                title: 'Nhà tài trợ chính', 
                muted: ' ' 
            },
            footer: { 
                backToTop: 'Lên đầu trang →' 
            }
        }
    };

    // Helper to get nested object value by path
    function get(obj, path) { 
        return path.split('.').reduce((o, k) => (o && o[k] != null ? o[k] : undefined), obj); 
    }

    // Apply language to all elements with data-i18n
    function applyLanguage(lang) {
        const dict = translations[lang] || translations.en;
        document.documentElement.setAttribute('lang', lang === 'vi' ? 'vi' : 'en');
        
        // Update all translatable elements
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            const value = get(dict, key);
            if (typeof value === 'string' && value.length > 0) {
                el.textContent = value;
            }
        });
        
        // Update toggle position WITHOUT triggering change event
        const toggle = document.getElementById('lang-switch');
        if (toggle) {
            // Remove event listener temporarily
            const oldListener = toggle._changeListener;
            if (oldListener) {
                toggle.removeEventListener('change', oldListener);
            }
            
            // Update checkbox state
            toggle.checked = (lang === 'vi');
            
            // Re-attach listener
            if (oldListener) {
                toggle.addEventListener('change', oldListener);
            }
        }
        
        // Save to localStorage
        localStorage.setItem('site_lang', lang);
        
        console.log('✓ Language applied:', lang);
    }

    // Detect language from browser/location
    async function detectLanguage() {
        try {
            // Check if user has saved preference
            const stored = localStorage.getItem('site_lang');
            if (stored && (stored === 'en' || stored === 'vi')) {
                console.log('✓ Using saved language:', stored);
                applyLanguage(stored);
                return;
            }
            
            // Check browser language
            const navLang = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
            let detectedLang = navLang.startsWith('vi') ? 'vi' : 'en';
            console.log('✓ Browser language detected:', detectedLang);
            
            // Try to detect location (optional, with timeout)
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 2000);
                
                const res = await fetch('https://ipapi.co/json/', { 
                    method: 'GET',
                    signal: controller.signal 
                });
                clearTimeout(timeoutId);
                
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.country_code === 'VN') {
                        detectedLang = 'vi';
                        console.log('✓ Location detected: Vietnam');
                    }
                }
            } catch (err) {
                console.log('⚠ Location detection skipped');
            }
            
            applyLanguage(detectedLang);
        } catch (error) {
            console.error('Language detection error:', error);
            applyLanguage('en');
        }
    }

    // Setup the toggle switch
    function setupToggle() {
        const toggle = document.getElementById('lang-switch');
        if (!toggle) {
            console.error('❌ Language toggle not found!');
            return;
        }
        
        console.log('✓ Setting up language toggle...');
        
        // Create the change handler
        const changeHandler = function(e) {
            const newLang = this.checked ? 'vi' : 'en';
            console.log('→ Toggle changed to:', newLang);
            applyLanguage(newLang);
        };
        
        // Store reference to the handler so we can remove it later if needed
        toggle._changeListener = changeHandler;
        
        // Attach the event listener
        toggle.addEventListener('change', changeHandler);
        
        console.log('✓ Language toggle ready!');
    }

    // Initialize everything
    function init() {
        console.log('=== Initializing Language System ===');
        setupToggle();
        detectLanguage();
    }

    // Run initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();