// ========================================
// ARCHER-STYLE ANIMATIONS WITH GSAP & LENIS
// Cinematic, High-Performance Interactions
// ========================================

(function() {
    'use strict';

    // ========================================
    // LENIS SMOOTH SCROLL INITIALIZATION
    // ========================================
    const lenis = new Lenis({
        duration: 1.0, // Reduced from 1.2 for snappier feel
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        smoothTouch: false, // Keep false to let mobile/touchpad handle native momentum naturally where possible
        touchMultiplier: 1.5, // Reduced from 2 to prevent over-scrolling sensitivity
        mouseMultiplier: 0.8, // Slightly reduced to prevent "heavy" feel
        infinite: false,
    });

    // OPTIMIZATION: Use GSAP Ticker for Lenis to prevent RAF conflicts
    /* 
       Removing the manual RAF loop because it fights with GSAP's ticker.
       This fixes the "janky" or "stuck" scrolling on high-refresh rate monitors and trackpads.
    */
    lenis.on('scroll', ScrollTrigger.update);
    
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000); // GSAP passes time in seconds, Lenis needs ms
    });
    
    // Disable lag smoothing to prevent jumps
    gsap.ticker.lagSmoothing(0);

    // ========================================
    // GSAP SETUP
    // ========================================
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // ===========================================
    // TRANSITION CANVAS (HALFTONE EFFECT CLASS)
    // ===========================================
    class HalftoneTransition {
        constructor() {
            this.canvas = document.getElementById('transition-canvas');
            if (!this.canvas) return;
            
            this.ctx = this.canvas.getContext('2d', { alpha: true }); // optimize
            this.spacing = 60; // SIGNIFICANT OPTIMIZATION: Increased from 30 to 60 (4x fewer dots)
            this.state = { radius: 0 }; 
            this.color = '#3B2E73'; 
            this.wasVisible = false;
            
            this.cols = 0;
            this.rows = 0;
            
            // Bind methods
            this.resize = this.resize.bind(this);
            this.draw = this.draw.bind(this);
            
            // Init
            this.resize();
            window.addEventListener('resize', this.resize);
            
            // Add to GSAP ticker for performance
            gsap.ticker.add(this.draw);
            
            // Setup Triggers
            this.initScrollTriggers();
        }
        
        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.cols = Math.ceil(this.canvas.width / this.spacing) + 1; // +1 to cover edges
            this.rows = Math.ceil(this.canvas.height / this.spacing) + 1;
            this.maxRadius = this.spacing * 0.8;
        }
        
        draw() {
            // Optimization: Don't draw if invisible
            if (this.state.radius <= 0.5) {
                if (this.wasVisible) {
                    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                    this.wasVisible = false;
                }
                return;
            }
            
            this.wasVisible = true;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = this.color;
            this.ctx.beginPath();
            
            // Only calculate loop boundaries once
            const rows = this.rows;
            const cols = this.cols;
            const spacing = this.spacing;
            const radius = this.state.radius;
            const twoPi = Math.PI * 2;
            
            for (let r = 0; r < rows; r++) {
                const y = r * spacing;
                const offsetX = (r % 2 === 0) ? 0 : spacing / 2;
                
                for (let c = 0; c < cols; c++) {
                    const x = c * spacing + offsetX;
                    this.ctx.moveTo(x + radius, y);
                    this.ctx.arc(x, y, radius, 0, twoPi);
                }
            }
            this.ctx.fill();
        }
        
        initScrollTriggers() {
            // 1. Hero -> Concept
            this.createTransitionTrigger('#hero', 'bottom bottom', '+=50vh');
            
            // 2. Concept -> Tech Specs (HUD)
            this.createTransitionTrigger('.archer-concept', 'bottom bottom', '+=50vh');
             
            // 3. Tech Specs -> Roadmap
            this.createTransitionTrigger('.archer-hud', 'bottom bottom', '+=50vh');
        }
        
        createTransitionTrigger(triggerElement, startPosition, distance) {
            gsap.to(this.state, {
                radius: this.maxRadius, 
                ease: "power2.inOut",
                yoyo: true, // Go back to 0
                repeat: 1,  // Do it once (0 -> Max -> 0)
                scrollTrigger: {
                    trigger: triggerElement,
                    start: startPosition,
                    end: distance, // Distance of the transition effect
                    scrub: 0.1,    // Smooth scrubbing
                }
            });
        }
    }

    // Init Transition
    new HalftoneTransition();

    // ========================================
    // SECTION 1: HERO ANIMATIONS
    // ========================================
    function initHeroAnimations() {
        const heroWords = document.querySelectorAll('.hero-word');
        const heroSubtitle = document.querySelector('.archer-hero-subtitle');
        const heroCta = document.querySelector('.archer-hero-cta');
        const scrollIndicator = document.querySelector('.archer-scroll-indicator');

        // Hero Timeline
        const heroTL = gsap.timeline({
            defaults: { ease: 'power3.out' }
        });

        // Words stagger animation
        heroTL.to(heroWords, {
            y: 0,
            opacity: 1,
            duration: 1.2,
            stagger: 0.2,
        })
        .to(heroSubtitle, {
            y: 0,
            opacity: 1,
            duration: 0.8,
        }, '-=0.6')
        .to(heroCta, {
            y: 0,
            opacity: 1,
            duration: 0.8,
        }, '-=0.5')
        .to(scrollIndicator, {
            opacity: 0.6,
            duration: 0.6,
        }, '-=0.4');

        // Magnetic Button Effect
        const magneticBtn = document.querySelector('.magnetic-btn');
        if (magneticBtn) {
            magneticBtn.addEventListener('mousemove', (e) => {
                const rect = magneticBtn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                gsap.to(magneticBtn, {
                    x: x * 0.3,
                    y: y * 0.3,
                    duration: 0.4,
                    ease: 'power2.out'
                });
            });

            magneticBtn.addEventListener('mouseleave', () => {
                gsap.to(magneticBtn, {
                    x: 0,
                    y: 0,
                    duration: 0.6,
                    ease: 'elastic.out(1, 0.5)'
                });
            });
        }
    }

    // ========================================
    // SECTION 2: SCROLLYTELLING CONCEPT
    // ========================================
    function initConceptScrollytelling() {
        const conceptBlocks = document.querySelectorAll('.concept-block');
        const droneBgs = document.querySelectorAll('.concept-drone-bg');

        // Scrollytelling Logic (Text highlighting & Image Switching)
        conceptBlocks.forEach((block, index) => {
            ScrollTrigger.create({
                trigger: block,
                start: 'top 60%',
                end: 'bottom 60%',
                onEnter: () => {
                    // Switch Text
                    conceptBlocks.forEach(b => b.classList.remove('active'));
                    block.classList.add('active');
                    
                    // Switch Image
                    if (droneBgs[index]) {
                        droneBgs.forEach(bg => bg.classList.remove('active'));
                        droneBgs[index].classList.add('active');
                    }
                },
                onEnterBack: () => {
                    // Switch Text
                    conceptBlocks.forEach(b => b.classList.remove('active'));
                    block.classList.add('active');
                    
                    // Switch Image
                    if (droneBgs[index]) {
                        droneBgs.forEach(bg => bg.classList.remove('active'));
                        droneBgs[index].classList.add('active');
                    }
                }
            });
        });

        // Parallax / Scroll Logic for the Images
        // Image "goes with scroll" means it moves UP as the user scrolls DOWN
        if (droneBgs.length > 0) {
             gsap.to(droneBgs, {
                y: '-20%', // Adjusted for 130% height (moves ~26vh up)
                ease: 'none',
                scrollTrigger: {
                    trigger: '.archer-concept',
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 0 // Direct link to scrollbar
                }
            });
        }
    }

    // ========================================
    // SECTION 3: HUD TECH SPECS ANIMATIONS
    // ========================================
    function initHudAnimations() {
        const hudCards = document.querySelectorAll('.hud-card');
        const hudValues = document.querySelectorAll('.hud-value');

        // Parallax background (Corrected to avoid gaps)
        // Background is 150% height, centered via CSS top: -25%
        // We move it slightly to create depth without exposing edges
        gsap.to('.hud-parallax-bg', {
            y: '10%', // Move down slightly (relative to height)
            ease: 'none',
            scrollTrigger: {
                trigger: '.archer-hud',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            }
        });

        // Cards animation
        hudCards.forEach((card, index) => {
            gsap.from(card, {
                opacity: 0,
                y: 80,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 80%',
                }
            });
        });

        // Counter animation for values
        hudValues.forEach((value) => {
            const target = parseInt(value.getAttribute('data-target'));
            
            ScrollTrigger.create({
                trigger: value,
                start: 'top 80%',
                onEnter: () => {
                    gsap.to(value, {
                        innerText: target,
                        duration: 2,
                        ease: 'power2.out',
                        snap: { innerText: 1 },
                        onUpdate: function() {
                            value.innerText = Math.ceil(value.innerText);
                        }
                    });
                }
            });
        });
    }

    // ========================================
    // SECTION 4: HORIZONTAL ROADMAP SCROLL (REFINED)
    // ========================================
    function initRoadmapScroll() {
        const roadmapWrapper = document.querySelector('.roadmap-wrapper');
        const roadmapScroll = document.querySelector('.roadmap-scroll');
        const roadmapItems = document.querySelectorAll('.roadmap-item');
        const fillLine = document.querySelector('.roadmap-progress-fill');

        if (!roadmapWrapper || !roadmapScroll) return;

        // Calculate scroll amount: Total width of content minus viewport width
        // Added generous padding to ensure last item is fully visible
        const getScrollAmount = () => {
            const scrollWidth = roadmapScroll.scrollWidth;
            const containerWidth = roadmapWrapper.clientWidth;
            // Scroll until the end + padding relative to viewport width
            return -(scrollWidth - window.innerWidth + 200); 
        };

        // Main Horizontal Scroll Animation
        const scrollTween = gsap.to(roadmapScroll, {
            x: getScrollAmount,
            ease: 'none',
            scrollTrigger: {
                trigger: '.archer-roadmap', // Trigger on the whole section container
                start: 'top top',
                end: () => `+=${Math.abs(getScrollAmount()) * 1.5 + 1000}`, // Extended scroll distance for slower speed
                pin: true,
                scrub: 1, // Smooth interaction
                invalidateOnRefresh: true,
                anticipatePin: 1
            }
        });

        // 2. Progress Line Animation (Synced with Scroll)
        // It fills up as we scroll through headers
        if (fillLine) {
            gsap.fromTo(fillLine, { width: '0%' }, {
                width: '100%',
                ease: 'none',
                scrollTrigger: {
                    trigger: '.archer-roadmap',
                    start: 'top top',
                    end: () => `+=${Math.abs(getScrollAmount()) * 1.5 + 1000}`,
                    scrub: 1
                }
            });
        }

        // 3. Item Activation Loop
        roadmapItems.forEach((item, index) => {
            // Force first item to be active immediately to avoid initial blur
            if (index === 0) item.classList.add('active');

            // Ignore spacer
            if (item.classList.contains('spacer')) return;

            // Highlight active item when it comes into "Focus Zone" (center of screen)
            ScrollTrigger.create({
                trigger: item,
                containerAnimation: scrollTween, // Link to horizontal scroll
                start: 'left center',
                end: 'right center',
                onToggle: self => {
                    if (self.isActive) {
                        // Activate current
                        item.classList.add('active');
                        // Deactivate siblings
                        roadmapItems.forEach(sib => {
                            if (sib !== item) sib.classList.remove('active');
                        });
                    }
                }
            });
        });
    }

    // ========================================
    // SECTION 5: TEAM MARQUEE ANIMATIONS
    // ========================================
    function initTeamAnimations() {
        const teamMarquee = document.getElementById('team-marquee');
        const teamItems = document.querySelectorAll('.team-marquee-item');

        if (teamMarquee) {
            // Pause on hover
            teamMarquee.addEventListener('mouseenter', () => {
                teamMarquee.classList.add('paused');
            });

            teamMarquee.addEventListener('mouseleave', () => {
                teamMarquee.classList.remove('paused');
            });

            // Individual item hover effects with GSAP
            teamItems.forEach((item) => {
                const photo = item.querySelector('.team-circle-photo');
                const firstName = item.querySelector('.team-first-name');
                const lastName = item.querySelector('.team-last-name');

                item.addEventListener('mouseenter', () => {
                    gsap.to(photo, {
                        scale: 1.05,
                        duration: 0.4,
                        ease: 'power2.out'
                    });

                    gsap.to([firstName, lastName], {
                        y: -5,
                        duration: 0.3,
                        ease: 'power2.out',
                        stagger: 0.05
                    });
                });

                item.addEventListener('mouseleave', () => {
                    gsap.to(photo, {
                        scale: 1,
                        duration: 0.4,
                        ease: 'power2.out'
                    });

                    gsap.to([firstName, lastName], {
                        y: 0,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                });
            });
        }

        // Fade in animation on scroll
        gsap.from('.team-marquee-wrapper', {
            opacity: 0,
            y: 60,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.archer-team',
                start: 'top 70%',
            }
        });
    }

    // ========================================
    // HEADER BEHAVIOR
    // ========================================
    function initHeaderBehavior() {
        const header = document.querySelector('.archer-header');
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            // Add scrolled class
            if (currentScroll > 100) {
                header.classList.add('header-scrolled');
            } else {
                header.classList.remove('header-scrolled');
            }

            // Hide/show on scroll
            if (currentScroll > lastScroll && currentScroll > 300) {
                header.classList.add('header-hidden');
            } else {
                header.classList.remove('header-hidden');
            }

            lastScroll = currentScroll;
        });
    }

    // ========================================
    // MOBILE MENU
    // ========================================
    function initMobileMenu() {
        const mobileBtn = document.getElementById('mobile-menu-btn');
        const mobileOverlay = document.getElementById('mobile-overlay');
        const navbar = document.getElementById('navbar-nav');

        if (mobileBtn && mobileOverlay && navbar) {
            mobileBtn.addEventListener('click', () => {
                navbar.classList.toggle('active');
                mobileOverlay.classList.toggle('active');
                document.body.style.overflow = navbar.classList.contains('active') ? 'hidden' : '';
            });

            mobileOverlay.addEventListener('click', () => {
                navbar.classList.remove('active');
                mobileOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
    }

    // ========================================
    // SEARCH OVERLAY
    // ========================================
    function initSearchOverlay() {
        const searchBtn = document.getElementById('search-btn');
        const searchOverlay = document.getElementById('search-overlay');
        const searchClose = document.getElementById('search-close');
        const searchInput = document.querySelector('.search-input');

        if (searchBtn && searchOverlay) {
            searchBtn.addEventListener('click', () => {
                searchOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
                setTimeout(() => searchInput && searchInput.focus(), 300);
            });

            if (searchClose) {
                searchClose.addEventListener('click', () => {
                    searchOverlay.classList.remove('active');
                    document.body.style.overflow = '';
                });
            }

            // Handle Search Submit
            if (searchInput) {
                searchInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter' && searchInput.value.trim() !== '') {
                        window.location.href = `search.html?q=${encodeURIComponent(searchInput.value.trim())}`;
                    }
                });
            }

            searchOverlay.addEventListener('click', (e) => {
                if (e.target === searchOverlay) {
                    searchOverlay.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }
    }

    // ========================================
    // LANGUAGE & I18N
    // ========================================
    const TRANSLATIONS = {
        RU: {
            "nav-about": "О проекте",
            "nav-solutions": "Решения",
            "nav-roadmap": "Этапы",
            "nav-invest": "Инвесторам",
            "nav-contacts": "Контакты",
            "nav-news": "Новости",
            "search-ph": "Поиск...",
            "contact-btn": "Связаться",
            "font-size": "Размер шрифта:",
            "hero-word-1": "ГОРОДСКАЯ",
            "hero-word-2": "АЭРОМОБИЛЬНОСТЬ",
            "scroll-ctl": "ПРОКРУТИТЕ",
            "hero-desc": "Alatau Advance Air Group создает инфраструктуру для электрических аппаратов вертикального взлета (eVTOL)",
            "hero-explore": "ИССЛЕДОВАТЬ",
            
            // Concept
            "conc-safe-title": "БЕЗОПАСНОСТЬ",
            "conc-safe-desc": "Нет единой точки отказа. 6 независимых двигателей обеспечивают полет даже при отказе одного. Каждая батарея и система зарезервированы.",
            "conc-eco-title": "ЭКОЛОГИЧНОСТЬ",
            "conc-eco-desc": "Нулевые выбросы CO₂. Полностью электрическая силовая установка делает полеты абсолютно чистыми для окружающей среды.",
            "conc-comf-title": "КОМФОРТ",
            "conc-comf-desc": "Менее 65 дБ при взлете — уровень обычного разговора. На высоте 500 м аппарат практически беззвучен благодаря низкочастотным винтам.",

            // Internal Pages
            "press-center": "ПРЕСС-ЦЕНТР",
            "news-title": "ПОСЛЕДНИЕ НОВОСТИ",
            "news-subtitle": "Следите за развитием проекта Alatau City и внедрением технологий городской аэромобильности.",
            "search-sys": "ПОИСКОВАЯ СИСТЕМА",
            "search-title": "ПОИСК AAAG",
            "search-subtitle": "Найдите интересующую вас информацию о проекте, технологиях и новостях.",
            "search-info-init": "Введите запрос для поиска...",

            // HUD / Tech Specs
            "hud-subtitle": "ТЕХНИЧЕСКИЕ ХАРАКТЕРИСТИКИ",
            "hud-title": "ДАННЫЕ ПРОИЗВОДИТЕЛЬНОСТИ",
            "stat-speed-lbl": "МАКСИМАЛЬНАЯ СКОРОСТЬ",
            "unit-speed": "КМ/Ч",
            "stat-noise-lbl": "УРОВЕНЬ ШУМА",
            "unit-noise": "дБ",
            "stat-range-lbl": "ЗАПАС ХОДА",
            "unit-range": "КМ",

            // Roadmap
            "road-lbl": "ГРАФИК",
            "road-title": "СТРАТЕГИЯ 2028",
            "road-desc": "Поэтапный план развертывания городской аэромобильности",
            
            // Roadmap Page (Full)
            "rp-25-title": "ИССЛЕДОВАНИЕ И ФУНДАМЕНТ",
            "rp-25-desc-1": "Исследование территории и цифровая карта Алматы.",
            "rp-25-desc-2": "Оценка потенциала пассажирских перевозок и маршрутной сети.",

            "rp-26-title": "СТРОИТЕЛЬСТВО И ТЕСТЫ",
            "rp-26-desc-1": "Строительство тестового центра в Алатау-Сити (ангар, терминал).",
            "rp-26-desc-2": "Первый тестовый полет аэромобиля (4 сезона испытаний).",

            "rp-27-title": "ЗАКОНЫ И ИНФРАСТРУКТУРА",
            "rp-27-desc-1": "Разработка закона о UAM и стандартов эксплуатации.",
            "rp-27-desc-2": "Проектирование центрального верти-порта и сети остановок.",

            "rp-28-title": "ЗАПУСК",
            "rp-28-desc-1": "Коммерческий запуск авиалинии Alatau UAM.",
            
            // Team
            "team-khegay-fname": "Сергей", "team-khegay-lname": "Хегай",
            "team-alma-fname": "Алма", "team-alma-lname": "Алигужинова",
            "team-roman-fname": "Роман", "team-roman-lname": "Богдашкин",
            "team-uteulin-fname": "Данияр", "team-uteulin-lname": "Утеулин",
            "team-aigul-fname": "Айгуль", "team-aigul-lname": "Андабекова",
            "team-yulia-fname": "Юлия", "team-yulia-lname": "Бедельбаева",
            "team-kabdelova-fname": "Улжан", "team-kabdelova-lname": "Кабделова",
            "team-asem-fname": "Асем", "team-asem-lname": "Биболова",

            "road-25-title": "ЗАПУСК & СЕРТИФИКАЦИЯ",
            "road-25-li1": "Демонстрационные полеты в Алматы",
            "road-25-li2": "Сертификация первых вертипортов",
            "road-25-li3": "Подписание соглашений с Joby Aviation",
            
            "road-26-title": "КОММЕРЧЕСКИЙ СТАРТ",
            "road-26-li1": "Запуск маршрута: Аэропорт ↔ Центр",
            "road-26-li2": "Парк из 5 eVTOL аппаратов",
            "road-26-li3": "Интеграция с городскими сервисами такси",
            
            "road-27-title": "МАСШТАБИРОВАНИЕ СЕТИ",
            "road-27-li1": "Строительство 10 новых вертипортов",
            "road-27-li2": "Запуск грузовой автономной доставки",
            "road-27-li3": "Снижение стоимости полета на 30%",
            
            "road-28-title": "РЕГИОНАЛЬНАЯ ЭКСПАНСИЯ",
            "road-28-li1": "Выход на маршруты Алматы ↔ Конаев",
            "road-28-li2": "Хаб для Центральной Азии",
            "road-28-li3": "Полная автоматизация управления трафиком",

            "team-title": "КОМАНДА AAAG GROUP",
            "team-subtitle": "Профессионалы, создающие будущее аэромобильности",
            "footer-desc": "Революция в городской мобильности. Безопасные, тихие и экологичные авиаперевозки для жителей Alatau City.",
            "foot-nav": "Навигация",
            "foot-addr-1": "г. Алматы, ул. Толе Би, 101",
            "foot-addr-2": "7 этаж, офис AAAG",
            "form-title": "Есть вопросы?",
            "form-desc": "Отправьте почту и мы свяжемся с вами!",
            "form-ph": "Ваш email",
            "form-btn": "Отправить",
            "social-follow": "Следите за нами:",
            "toast-succ": "Заявка успешно отправлена",
            "modal-title": "Связаться с нами",
            "modal-subtitle": "Оставьте свои данные, и мы свяжемся с вами в ближайшее время",
            "modal-name": "Ваше имя",
            "modal-phone": "Телефон / Email",
            "modal-msg": "Сообщение",
            "modal-send": "Отправить заявку",
            "modal-policy": "Нажимая кнопку, вы соглашаетесь с политикой обработки персональных данных",
            "foot-copy": "© 2026 Alatau City Project. Все права защищены."
        },
        EN: {
            "nav-about": "About",
            "nav-solutions": "Solutions",
            "nav-roadmap": "Roadmap",
            "nav-invest": "Investors",
            "nav-contacts": "Contacts",
            "nav-news": "News",
            "search-ph": "Search...",
            "contact-btn": "Contact Us",
            "font-size": "Font Size:",
            "hero-word-1": "URBAN",
            "hero-word-2": "AIR MOBILITY",
            "scroll-ctl": "SCROLL",
            "hero-desc": "Alatau Advance Air Group is building infrastructure for electric vertical takeoff and landing (eVTOL) aircraft",
            "hero-explore": "EXPLORE",
            
            // Concept
            "conc-safe-title": "SAFETY",
            "conc-safe-desc": "No single point of failure. 6 independent motors ensure flight even if one fails. Every battery and system is redundant.",
            "conc-eco-title": "ECOLOGY",
            "conc-eco-desc": "Zero CO₂ emissions. Fully electric propulsion makes flights completely clean for the environment.",
            "conc-comf-title": "COMFORT",
            "conc-comf-desc": "Less than 65 dB at takeoff — the level of normal conversation. At 500m virtually silent thanks to low-frequency rotors.",

            // Internal Pages
            "press-center": "PRESS CENTER",
            "news-title": "LATEST NEWS",
            "news-subtitle": "Follow the development of the Alatau City project and the implementation of urban air mobility technologies.",
            "search-sys": "SEARCH SYSTEM",
            "search-title": "SEARCH AAAG",
            "search-subtitle": "Find the information you are interested in about the project, technologies and news.",
            "search-info-init": "Enter a query to search...",

            // HUD / Tech Specs
            "hud-subtitle": "TECHNICAL SPECS",
            "hud-title": "PERFORMANCE DATA",
            "stat-speed-lbl": "MAX SPEED",
            "unit-speed": "KM/H",
            "stat-noise-lbl": "NOISE LEVEL",
            "unit-noise": "dB",
            "stat-range-lbl": "RANGE",
            "unit-range": "KM",

            // Roadmap
            "road-lbl": "TIMELINE",
            "road-title": "STRATEGY 2028",
            "road-desc": "Phased deployment plan for urban air mobility",
            
            // Roadmap Page (Full)
            "rp-25-title": "RESEARCH & FOUNDATION",
            "rp-25-desc-1": "Territory research and digital map of Almaty.",
            "rp-25-desc-2": "Assessment of passenger traffic potential and route network.",

            "rp-26-title": "CONSTRUCTION & TRIALS",
            "rp-26-desc-1": "Construction of test center in Alatau City (hangar, terminal).",
            "rp-26-desc-2": "First test flight of the air vehicle (4 seasons of trials).",

            "rp-27-title": "LAWS & INFRASTRUCTURE",
            "rp-27-desc-1": "Development of UAM law and operation standards.",
            "rp-27-desc-2": "Design of the central vertiport and stop network.",

            "rp-28-title": "LAUNCH",
            "rp-28-desc-1": "Commercial launch of Alatau UAM airline.",
            
            // Team
            "team-khegay-fname": "Sergey", "team-khegay-lname": "Khegay",
            "team-alma-fname": "Alma", "team-alma-lname": "Aliguzhinova",
            "team-roman-fname": "Roman", "team-roman-lname": "Bogdashkin",
            "team-uteulin-fname": "Daniyar", "team-uteulin-lname": "Uteulin",
            "team-aigul-fname": "Aigul", "team-aigul-lname": "Andabekova",
            "team-yulia-fname": "Yulia", "team-yulia-lname": "Bedelbayeva",
            "team-kabdelova-fname": "Ulzhan", "team-kabdelova-lname": "Kabdelova",
            "team-asem-fname": "Asem", "team-asem-lname": "Bibolova",

            "road-25-title": "LAUNCH & CERTIFICATION",
            "road-25-li1": "Demonstration flights in Almaty",
            "road-25-li2": "Certification of first vertiports",
            "road-25-li3": "Signing agreements with Joby Aviation",
            
            "road-26-title": "COMMERCIAL LAUNCH",
            "road-26-li1": "Route launch: Airport ↔ Center",
            "road-26-li2": "Fleet of 5 eVTOL aircraft",
            "road-26-li3": "Integration with city taxi services",
            
            "road-27-title": "NETWORK SCALING",
            "road-27-li1": "Construction of 10 new vertiports",
            "road-27-li2": "Launch of autonomous cargo delivery",
            "road-27-li3": "Flight cost reduction by 30%",
            
            "road-28-title": "REGIONAL EXPANSION",
            "road-28-li1": "Expansion to Almaty ↔ Konaev routes",
            "road-28-li2": "Hub for Central Asia",
            "road-28-li3": "Full traffic management automation",

            "team-title": "AAAG GROUP TEAM",
            "team-subtitle": "Professionals creating the future of air mobility",
            "footer-desc": "Revolution in urban mobility. Safe, quiet, and eco-friendly air transport for Alatau City residents.",
            "foot-nav": "Navigation",
            "foot-addr-1": "Almaty, Tole Bi str., 101",
            "foot-addr-2": "7th floor, AAAG office",
            "form-title": "Have questions?",
            "form-desc": "Send us an email and we will contact you!",
            "form-ph": "Your email",
            "form-btn": "Send",
            "social-follow": "Follow us:",
            "toast-succ": "Request sent successfully",
            "modal-title": "Contact Us",
            "modal-subtitle": "Leave your details and we will contact you shortly",
            "modal-name": "Your Name",
            "modal-phone": "Phone / Email",
            "modal-msg": "Message",
            "modal-send": "Send Request",
            "modal-policy": "By clicking the button, you agree to the personal data processing policy",
            "foot-copy": "© 2026 Alatau City Project. All rights reserved."
        },
        KK: {
            "nav-about": "Жоба туралы",
            "nav-solutions": "Шешімдер",
            "nav-roadmap": "Кезеңдер",
            "nav-invest": "Инвесторларға",
            "nav-contacts": "Байланыс",
            "nav-news": "Жаңалықтар",
            "search-ph": "Іздеу...",
            "contact-btn": "Байланысу",
            "font-size": "Қаріп өлшемі:",
            "hero-word-1": "ҚАЛАЛЫҚ",
            "hero-word-2": "АЭРОҰТҚЫРЛЫҚ",
            "scroll-ctl": "ЖЫЛЖЫТУ",
            "hero-desc": "Alatau Advance Air Group тік ұшып-қонатын электрлі аппараттар (eVTOL) үшін инфрақұрылым жасайды",
            "hero-explore": "ЗЕРТТЕУ",
            
            // Concept
            "conc-safe-title": "ҚАУІПСІЗДІК",
            "conc-safe-desc": "Бірыңғай істен шығу нүктесі жоқ. 6 тәуелсіз қозғалтқыш біреуі істен шыққанда да ұшуды қамтамасыз етеді. Әр батарея мен жүйе резервтелген.",
            "conc-eco-title": "ЭКОЛОГИЯЛЫҚ",
            "conc-eco-desc": "CO₂ шығарындылары нөлдік. Толық электрлі күш қондырғысы ұшуларды қоршаған орта үшін мүлдем таза етеді.",
            "conc-comf-title": "ЖАЙЛЫЛЫҚ",
            "conc-comf-desc": "Ұшу кезінде 65 дБ-ден аз — кәдімгі сөйлесу деңгейі. 500 м биіктікте төмен жиілікті винттердің арқасында аппарат іс жүзінде дыбыссыз.",

            // Internal Pages
            "press-center": "БАСПАСӨЗ ОРТАЛЫҒЫ",
            "news-title": "СОҢҒЫ ЖАҢАЛЫҚТАР",
            "news-subtitle": "Alatau City жобасының дамуын және қалалық аэроұтқырлық технологияларын енгізуді қадағалаңыз.",
            "search-sys": "ІЗДЕУ ЖҮЙЕСІ",
            "search-title": "AAAG ІЗДЕУ",
            "search-subtitle": "Жоба, технологиялар және жаңалықтар туралы өзіңізді қызықтыратын ақпаратты табыңыз.",
            "search-info-init": "Іздеу үшін сұрау енгізіңіз...",

            // HUD / Tech Specs
            "hud-subtitle": "ТЕХНИКАЛЫҚ ҚАСИЕТТЕРІ",
            "hud-title": "ӨНІМДІЛІК ДЕРЕКТЕРІ",
            "stat-speed-lbl": "МАКС. ЖЫЛДАМДЫҚ",
            "unit-speed": "КМ/САҒ",
            "stat-noise-lbl": "ШУ ДЕҢГЕЙІ",
            "unit-noise": "дБ",
            "stat-range-lbl": "ЖҮРІС ҚОРЫ",
            "unit-range": "КМ",

            // Roadmap
            "road-lbl": "КЕСТЕ",
            "road-title": "СТРАТЕГИЯ 2028",
            "road-desc": "Қалалық аэроұтқырлықты кезең-кезеңмен енгізу жоспары",
            
            // Roadmap Page (Full)
            "rp-25-title": "ЗЕРТТЕУ ЖӘНЕ ІРГЕТАС",
            "rp-25-desc-1": "Аумақты зерттеу және Алматының цифрлық картасы.",
            "rp-25-desc-2": "Жолаушылар тасымалы мен маршруттық желінің әлеуетін бағалау.",

            "rp-26-title": "ҚҰРЫЛЫС ЖӘНЕ СЫНАҚТАР",
            "rp-26-desc-1": "Alatau City-де сынақ орталығын салу (ангар, терминал).",
            "rp-26-desc-2": "Әуе көлігінің алғашқы сынақ ұшуы (4 сынақ маусымы).",

            "rp-27-title": "ЗАҢДАР ЖӘНЕ ИНФРАҚҰРЫЛЫМ",
            "rp-27-desc-1": "UAM туралы заң мен пайдалану стандарттарын әзірлеу.",
            "rp-27-desc-2": "Орталық вертипорт пен аялдамалар желісін жобалау.",

            "rp-28-title": "ІСКЕ ҚОСУ",
            "rp-28-desc-1": "Alatau UAM әуе желісін коммерциялық іске қосу.",
            
            "road-25-title": "ІСКЕ ҚОСУ & СЕРТИФИКАТТАУ",
            "road-25-li1": "Алматыдағы демонстрациялық ұшулар",
            "road-25-li2": "Алғашқы вертипорттарды сертификаттау",
            "road-25-li3": "Joby Aviation-мен келісімдерге қол қою",
            
            "road-26-title": "КОММЕРЦИЯЛЫҚ БАСТАУ",
            "road-26-li1": "Маршрутты іске қосу: Әуежай ↔ Орталық",
            "road-26-li2": "5 eVTOL аппаратынан тұратын парк",
            "road-26-li3": "Қалалық такси сервистерімен интеграция",
            
            "road-27-title": "ЖЕЛІНІ КЕҢЕЙТУ",
            "road-27-li1": "10 жаңа вертипорт салу",
            "road-27-li2": "Жүктерді автономды жеткізуді іске қосу",
            "road-27-li3": "Ұшу құнын 30%-ға төмендету",
            
            "road-28-title": "АЙМАҚТЫҚ ЭКСПАНСИЯ",
            "road-28-li1": "Алматы ↔ Қонаев маршруттарына шығу",
            "road-28-li2": "Орталық Азия үшін хаб",
            "road-28-li3": "Трафикті басқаруды толық автоматтандыру",

            "team-title": "AAAG GROUP КОМАНДАСЫ",
            "team-subtitle": "Аэроұтқырлық болашағын жасайтын мамандар",
            "footer-desc": "Қалалық ұтқырлықтағы революция. Alatau City тұрғындары үшін қауіпсіз, тыныш және экологиялық тасымалдар.",
            "foot-nav": "Навигация",
            "foot-addr-1": "Алматы қ., Төле би к-сі, 101",
            "foot-addr-2": "7 қабат, AAAG кеңсесі",
            "form-title": "Сұрақтарыңыз бар ма?",
            "form-desc": "Поштаңызды қалдырыңыз, біз сізбен байланысамыз!",
            "form-ph": "Сіздің email",
            "form-btn": "Жіберу",
            "social-follow": "Бізге жазылыңыз:",
            "toast-succ": "Өтінім сәтті жіберілді",
            "modal-title": "Бізбен байланысу",
            "modal-subtitle": "Деректеріңізді қалдырыңыз, біз жақын арада сізбен байланысамыз",
            "modal-name": "Сіздің атыңыз",
            "modal-phone": "Телефон / Email",
            "modal-msg": "Хабарлама",
            "modal-send": "Өтінім жіберу",
            "modal-policy": "Түймені басу арқылы сіз дербес деректерді өңдеу саясатымен келісесіз",
            "foot-copy": "© 2026 Alatau City Project. Барлық құқықтар қорғалған."
        }
    };

    function switchLanguage(lang) {
        if (!TRANSLATIONS[lang]) return;
        
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (TRANSLATIONS[lang][key]) {
                el.innerText = TRANSLATIONS[lang][key];
            }
        });

        // Placeholders
        const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
        placeholders.forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (TRANSLATIONS[lang][key]) {
                el.setAttribute('placeholder', TRANSLATIONS[lang][key]);
            }
        });

        // Update button text
        const currLangText = document.getElementById('curr-lang-text');
        if (currLangText) currLangText.textContent = lang;

        // Save to localStorage
        localStorage.setItem('archer_lang', lang);

        // Dispatch Event for other scripts
        document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: lang } }));
    }

    function initLanguageDropdown() {
        const langBtn = document.getElementById('lang-btn');
        const langDropdown = document.getElementById('lang-dropdown');

        if (langBtn && langDropdown) {
            langBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                langDropdown.classList.toggle('active');
            });

            document.addEventListener('click', () => {
                langDropdown.classList.remove('active');
            });

            const langLinks = langDropdown.querySelectorAll('a');
            langLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const lang = link.getAttribute('data-lang');
                    switchLanguage(lang);
                    langDropdown.classList.remove('active');
                });
            });

            // Initialize from Storage or default
            const savedLang = localStorage.getItem('archer_lang') || 'RU';
            switchLanguage(savedLang);
        }
    }

    // ========================================
    // ACCESSIBILITY & ZOOM
    // ========================================
    function setSiteScale(scale) {
        // Use Zoom for Webkit/Blink (best layout preservation)
        document.body.style.zoom = scale;
        
        // For Firefox, we might need transform scale on body, 
        // but 'zoom' is the requested feature style behavior (reflows text if possible or scales layout).
        // Actually, 'zoom' scales the layout, so it behaves like browser zoom.
        // To prevent overlapping, this is safer than increasing font-size alone.
        
        // Fallback or specific visual ajustments
        if (window.gsap && ScrollTrigger) {
            ScrollTrigger.refresh(); // Recalculate GSAP positions
        }
        
        localStorage.setItem('archer_scale', scale);
    }

    function initAccessibilityPanel() {
        const accessBtn = document.getElementById('access-btn');
        const accessPanel = document.getElementById('access-panel');
        const fontBtns = document.querySelectorAll('.font-btn');

        if (accessBtn && accessPanel) {
            accessBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                accessPanel.classList.toggle('active');
            });

            document.addEventListener('click', () => {
                accessPanel.classList.remove('active');
            });

            accessPanel.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }

        fontBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                fontBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const scale = parseFloat(btn.getAttribute('data-scale'));
                setSiteScale(scale);
            });
        });

        // Init from storage
        const savedScale = localStorage.getItem('archer_scale') || 1;
        setSiteScale(savedScale);
        
        // Set active button
        const activeBtn = Array.from(fontBtns).find(b => parseFloat(b.getAttribute('data-scale')) == savedScale);
        if (activeBtn) {
            fontBtns.forEach(b => b.classList.remove('active'));
            activeBtn.classList.add('active');
        }
    }

    // ========================================
    // SCROLL TO TOP BUTTON
    // ========================================
    function initScrollToTop() {
        const scrollTopBtn = document.getElementById('scroll-top-btn');

        if (scrollTopBtn) {
            window.addEventListener('scroll', () => {
                if (window.pageYOffset > 500) {
                    scrollTopBtn.classList.add('visible');
                } else {
                    scrollTopBtn.classList.remove('visible');
                }
            });

            scrollTopBtn.addEventListener('click', () => {
                lenis.scrollTo(0, { duration: 2 });
            });
        }
    }

    // ========================================
    // CONTACT MODAL
    // ========================================
    function initContactModal() {
        const openBtn = document.getElementById('open-contact');
        const modal = document.getElementById('contact-modal');
        const closeBtn = document.getElementById('contact-close');

        if (openBtn && modal) {
            openBtn.addEventListener('click', (e) => {
                e.preventDefault();
                modal.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
            });

            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    modal.setAttribute('aria-hidden', 'true');
                    document.body.style.overflow = '';
                });
            }

            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.setAttribute('aria-hidden', 'true');
                    document.body.style.overflow = '';
                }
            });
        }
    }

    // ========================================
    // VIDEO MODAL (Updated)
    // ========================================
    function initVideoModal() {
        const videoId = 'cuJEf4v05Z0';
        const modal = document.getElementById('video-modal');
        const iframe = document.getElementById('video-iframe');
        const closeBtn = document.getElementById('video-close');
        // Updated ID to match HTML
        const openBtn = document.getElementById('open-video-btn');
        
        if (!modal || !iframe || !closeBtn || !openBtn) return;
        
        openBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Updated with user specific SI parameter
            iframe.src = `https://www.youtube.com/embed/${videoId}?si=c1L1a1DtBTk72V8h&autoplay=1`;
            modal.classList.add('open');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        });
        
        closeBtn.addEventListener('click', closeVideo);
        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeVideo();
        });
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('open')) closeVideo();
        });
        
        function closeVideo() {
            iframe.src = '';
            modal.classList.remove('open');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    }

    // ========================================
    // FOOTER FORM
    // ========================================
    function initFooterForm() {
        const form = document.getElementById('footer-contact-form');
        const toast = document.getElementById('success-toast');

        if (form && toast) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Show success toast
                toast.classList.add('show');
                
                // Reset form
                form.reset();
                
                // Hide toast after 3 seconds
                setTimeout(() => {
                    toast.classList.remove('show');
                }, 3000);
            });
        }
    }

    // ========================================
    // SMOOTH ANCHOR LINKS
    // ========================================
    function initSmoothAnchors() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        
        anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href === '#' || href === '') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    lenis.scrollTo(target, { duration: 1.5 });
                }
            });
        });
    }

    // ========================================
    // INITIALIZE ALL
    // ========================================
    function init() {
        // Wait for DOM and GSAP to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        // Initialize all modules
        initHeroAnimations();
        initConceptScrollytelling();
        initHudAnimations();
        initRoadmapScroll();
        initTeamAnimations();
        initHeaderBehavior();
        initMobileMenu();
        initSearchOverlay();
        initLanguageDropdown();
        initAccessibilityPanel();
        initScrollToTop();
        initContactModal();
        initVideoModal();
        initFooterForm();
        initSmoothAnchors();

        console.log('🚀 Archer-style AAAG website initialized with GSAP & Lenis');
    }

    // Start initialization
    init();

})();
