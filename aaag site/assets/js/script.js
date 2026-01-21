// Simple video modal with instant YouTube playback
(function() {
    'use strict';
    
    const videoId = 'cuJEf4v05Z0';
    let modal, iframe, closeBtn, openBtn;
    
    function init() {
        modal = document.getElementById('video-modal');
        iframe = document.getElementById('video-iframe');
        closeBtn = document.getElementById('video-close');
        openBtn = document.getElementById('open-video');
        
        if (!modal || !iframe || !closeBtn || !openBtn) return;
        
        // Open video modal
        openBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openVideo();
        });
        
        // Close button
        closeBtn.addEventListener('click', closeVideo);
        
        // Click outside to close
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeVideo();
            }
        });
        
        // Escape key to close
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('open')) {
                closeVideo();
            }
        });
    }
    
    function openVideo() {
        // Set iframe src with YouTube's embed URL and autoplay
        iframe.src = `https://www.youtube.com/embed/${videoId}?si=e8Ilms7dsQYMFDeY&autoplay=1`;
        
        // Show modal
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }
    
    function closeVideo() {
        // Stop video by clearing src
        iframe.src = '';
        
        // Hide modal
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        
        // Restore body scroll
        document.body.style.overflow = '';
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

// Scroll animations - fade in elements on viewport entry
(function() {
    'use strict';
    
    function initScrollAnimations() {
        const elements = document.querySelectorAll('.feature-card, .service-item, .roadmap-item, .team-member, .section-header');
        
        // Add fade-in-element class to all target elements
        elements.forEach(el => {
            el.classList.add('fade-in-element');
        });
        
        // Create intersection observer
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // Optional: stop observing after animation
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe all elements
        elements.forEach(el => observer.observe(el));
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScrollAnimations);
    } else {
        initScrollAnimations();
    }
})();

// Contact Modal Logic
(function() {
    'use strict';
    
    let modal, closeBtn, openBtn;
    
    function init() {
        modal = document.getElementById('contact-modal');
        closeBtn = document.getElementById('contact-close');
        openBtn = document.getElementById('open-contact');
        
        if (!modal || !closeBtn || !openBtn) return;
        
        openBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openModal();
        });
        
        closeBtn.addEventListener('click', closeModal);
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('open')) {
                closeModal();
            }
        });
    }
    
    function openModal() {
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }
    
    function closeModal() {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

// Header Controls (Language, Translations & Font Size)
(function() {
    'use strict';
    
    // --- Translations Dictionary ---
    const translations = {
        RU: {
            'nav-about': 'О проекте',
            'nav-solutions': 'Преимущества',
            'nav-roadmap': 'Этапы',
            'nav-invest': 'Инвесторам',
            'nav-contacts': 'Контакты',
            'search-ph': 'Поиск...',
            'font-size': 'Размер шрифта:',
            'contact-btn': 'Связаться',
            'hero-title': 'Городская аэромобильность<br>на базе Joby S4',
            'hero-desc': 'Alatau Advance Air Group внедряет передовые электрические конвертопланы для воздушного такси. Эффективность самолета, удобство вертолета.',
            'hero-more': 'Характеристики',
            'hero-video': 'Смотреть видео',
            'about-title': 'Флагман UAM — Joby S4',
            'about-subtitle': 'Технические характеристики eVTOL',
            'about-text-1': '<strong>Joby S4</strong> — это электрический конвертоплан (Tilt-rotor) вместимостью 5 человек (1 пилот + 4 пассажира). Максимальная скорость достигает <strong>322 км/ч</strong>, а дальность полета — до 240 км на одном заряде. Также тестируется водородная версия с дальностью более 840 км.',
            'about-text-2': 'Главная особенность — 6 поворотных винтов. При взлете они смотрят вверх (как у дрона), а в полете поворачиваются вперед, позволяя аппарату лететь как самолет, используя подъемную силу крыла.',
            'about-link': 'Узнать статус проекта',
            'stat-co2': 'Литий-ионные батареи',
            'stat-time-val': '322 км/ч',
            'stat-time-desc': 'Максимальная скорость',
            'stat-noise': 'Тише 65 дБ',
            'stat-jobs': '5 Мест',
            'adv-title': 'Главные преимущества',
            'adv-subtitle': 'Почему это станет массовым транспортом',
            'feat-1-title': 'Экстремально низкий шум',
            'feat-1-desc': 'Менее 65 дБ при взлете (уровень разговора). В полете на высоте 500 м аппарат почти не слышен ("шелест листвы") благодаря низкочастотному звуку 6 винтов.',
            'feat-2-title': 'Абсолютная безопасность',
            'feat-2-desc': 'Нет единой точки отказа. Аппарат продолжает полет даже при отказе двигателя. Каждая батарея и мотор зарезервированы.',
            'feat-3-title': 'Экономичность Uber Black',
            'feat-3-desc': 'За счет электродвигателей эксплуатация в разы дешевле вертолетов. Это позволит снизить цену билета до уровня такси комфорт-класса.',
            'srv-title': 'Направления деятельности',
            'srv-1-title': 'Пассажирские перевозки',
            'srv-1-desc': 'Аэропорт  Центр  Алатау. Скорость бизнес-джета по цене такси комфорт-класса.',
            'srv-2-title': 'Грузовая логистика',
            'srv-2-desc': 'Срочная доставка грузов до 10 кг за 30 минут по выделенным воздушным коридорам.',
            'map-title': 'Текущий статус и Планы',
            'map-subtitle': 'Путь к коммерческому запуску',
            'map-25-title': 'Сертификация FAA',
            'map-25-desc': 'Joby Aviation активно работает с Федеральным управлением гражданской авиации США. Первыми прошли критические этапы сертификации.',
            'map-26-title': 'Стратегические Партнеры',
            'map-26-desc': 'Toyota помогает с производством и контролем качества. Uber интегрирует сервис в свое приложение для бесшовных поездок.',
            'map-27-title': 'Запуск 2025-2026',
            'map-27-desc': 'Коммерческие рейсы стартуют в Дубае и городах США (Нью-Йорк, Лос-Анджелес).',
            'map-28-title': 'Масштабирование',
            'map-28-desc': 'Расширение географии полетов и выход на рынки Азии и Казахстана (Alatau City).',
            'foot-desc': 'Мы строим будущее городской мобильности сегодня. Первый аэрокластер Центральной Азии.',
            'foot-nav': 'Навигация',
            'nav-news': 'Новости',
            'foot-addr-1': 'г. Алматы, ул. Достык 291/23',
            'foot-addr-2': '3 этаж, офис AAAG',
            'form-title': 'Есть вопросы или предложения?',
            'form-desc': 'Отправьте почту и мы свяжемся с вами в ближайшее время!',
            'form-ph': 'Ваш email',
            'form-btn': 'Отправить',
            'social-follow': 'Следите за нами в соцсетях:',
            'foot-copy': ' 2026 Alatau City Project. Все права защищены.',
            'toast-succ': 'Заявка успешно отправлена',
            'modal-title': 'Связаться с нами',
            'modal-subtitle': 'Оставьте свои данные, и мы свяжемся с вами в ближайшее время',
            'modal-name': 'Ваше имя',
            'modal-phone': 'Телефон / Email',
            'modal-msg': 'Сообщение',
            'modal-send': 'Отправить заявку',
            'modal-policy': 'Нажимая кнопку, вы соглашаетесь с политикой обработки персональных данных',
            'team-title': 'Команда AAAG Group',
            'team-subtitle': 'Профессионалы, создающие будущее аэромобильности',
            'team-uteulin-name': 'Данияр Утеулин',
            'team-uteulin-role': 'Проектный менеджер',
            'team-aigul-name': 'Айгуль Андабекова',
            'team-aigul-role': 'Юрист',
            'team-yulia-name': 'Юлия Бедельбаева',
            'team-yulia-role': 'Руководитель отдела снабжения, логистики и таможни',
            'team-kabdelova-name': 'Улжан Кабделова',
            'team-kabdelova-role': 'Менеджер по работе c инвесторами',
            'team-asem-name': 'Асем Биболова',
            'team-asem-role': 'Менеджер по административным вопросам',
            'team-roman-name': 'Роман Богдашкин',
            'team-roman-role': 'IT Директор',
            'team-khegay-name': 'Сергей Хегай',
            'team-khegay-role': 'Генеральный директор',
            'team-alma-name': 'Алма Алигужинова',
            'team-alma-role': 'Исполнительный директор'
        },
        EN: {
            'nav-about': 'About',
            'nav-solutions': 'Solutions',
            'nav-roadmap': 'Roadmap',
            'nav-invest': 'Investors',
            'nav-contacts': 'Contacts',
            'search-ph': 'Search...',
            'font-size': 'Font size:',
            'contact-btn': 'Contact Us',
            'hero-title': 'Next Generation<br>Urban Air Mobility',
            'hero-desc': 'Alatau Advance Air Group is building infrastructure for electric vertical take-off units (eVTOL). The future of transport is here.',
            'hero-more': 'Learn More',
            'hero-video': 'Watch Video',
            'about-title': 'Innovation in Motion',
            'about-subtitle': 'Alatau City Project',
            'about-text-1': '<strong>Urban Air Mobility (UAM)</strong> is a revolutionary urban transport system. We are introducing electric aircraft for passengers and cargo, connecting Almaty and Alatau.',
            'about-text-2': 'Our goal is to turn hour-long traffic jams into comfortable 15-minute flights, preserving the region\'s ecology thanks to zero CO2 emissions.',
            'about-link': 'See Technical Details',
            'stat-co2': 'CO2 Emissions',
            'stat-time-val': '15 min',
            'stat-time-desc': 'Flight time to Almaty',
            'stat-noise': 'Noise Level (Lower than car)',
            'stat-jobs': 'Jobs Created',
            'adv-title': 'Key Advantages',
            'adv-subtitle': 'Technology for comfort and safety',
            'feat-1-title': 'Acoustic Comfort',
            'feat-1-desc': 'Our units are designed to blend with the background noise of the city. 65 dB is the level of a calm conversation.',
            'feat-2-title': 'Triple Safety',
            'feat-2-desc': 'Redundant engines and three independent control circuits. Safe landing capability even with partial failure.',
            'feat-3-title': 'Eco-Friendly',
            'feat-3-desc': 'Fully electric propulsion. We keep the unique nature of the Alatau foothills clean.',
            'srv-title': 'Our Services',
            'srv-1-title': 'Passenger Flights',
            'srv-1-desc': 'Airport  Center  Alatau. Business jet speed at the price of comfort-class taxi.',
            'srv-2-title': 'Cargo Logistics',
            'srv-2-desc': 'Urgent cargo delivery up to 10 kg in 30 minutes via dedicated air corridors.',
            'map-title': 'Roadmap',
            'map-subtitle': 'AAAG Project Stages',
            'map-25-title': 'Research & Planning',
            'map-25-desc': 'Air corridor analysis, digital mapping of Almaty, design of test center and takeoff/landing zones.',
            'map-26-title': 'Construction & Tests',
            'map-26-desc': 'Building verti-stops in Alatau-City. First test flights of air vehicles in various weather conditions.',
            'map-27-title': 'Regulation',
            'map-27-desc': 'Developing UAM legislative framework. Designing the central vertiport. Integration into the city master plan.',
            'map-28-title': 'Commercial Launch',
            'map-28-desc': 'Start of regular passenger and cargo flights of Alatau UAM airline.',
            'foot-desc': 'We are building the future of urban mobility today. The first air cluster in Central Asia.',
            'foot-nav': 'Navigation',
            'nav-news': 'News',
            'foot-addr-1': 'Almaty, Dostyk Ave 291/23',
            'foot-addr-2': '3rd Floor, AAAG Office',
            'form-title': 'Questions or Proposals?',
            'form-desc': 'Send us an email and we will contact you shortly!',
            'form-ph': 'Your email',
            'form-btn': 'Send',
            'social-follow': 'Follow us:',
            'foot-copy': ' 2026 Alatau City Project. All rights reserved.',
            'toast-succ': 'Request sent successfully',
            'modal-title': 'Contact Us',
            'modal-subtitle': 'Leave your details and we will contact you shortly',
            'modal-name': 'Your Name',
            'modal-phone': 'Phone / Email',
            'modal-msg': 'Message',
            'modal-send': 'Send Request',
            'modal-send': 'Отправить заявку',
            'modal-policy': 'Нажимая кнопку, вы соглашаетесь с политикой обработки персональных данных',
            'news-page-title': 'Новости UAM',
            'news-page-subtitle': 'Последние события в мире городской аэромобильности и проекта Alatau City'
        },
        EN: {
            'nav-about': 'About',
            'nav-solutions': 'Solutions',
            'nav-roadmap': 'Roadmap',
            'nav-invest': 'Investors',
            'nav-contacts': 'Contacts',
            'search-ph': 'Search...',
            'font-size': 'Font size:',
            'contact-btn': 'Contact Us',
            'hero-title': 'Next Generation<br>Urban Air Mobility',
            'hero-desc': 'Alatau Advance Air Group is building infrastructure for electric vertical take-off units (eVTOL). The future of transport is here.',
            'hero-more': 'Learn More',
            'hero-video': 'Watch Video',
            'about-title': 'Innovation in Motion',
            'about-subtitle': 'Alatau City Project',
            'about-text-1': '<strong>Urban Air Mobility (UAM)</strong> is a revolutionary urban transport system. We are introducing electric aircraft for passengers and cargo, connecting Almaty and Alatau.',
            'about-text-2': 'Our goal is to turn hour-long traffic jams into comfortable 15-minute flights, preserving the region\'s ecology thanks to zero CO2 emissions.',
            'about-link': 'See Technical Details',
            'stat-co2': 'CO2 Emissions',
            'stat-time-val': '15 min',
            'stat-time-desc': 'Flight time to Almaty',
            'stat-noise': 'Noise Level (Lower than car)',
            'stat-jobs': 'Jobs Created',
            'adv-title': 'Key Advantages',
            'adv-subtitle': 'Technology for comfort and safety',
            'feat-1-title': 'Acoustic Comfort',
            'feat-1-desc': 'Our units are designed to blend with the background noise of the city. 65 dB is the level of a calm conversation.',
            'feat-2-title': 'Triple Safety',
            'feat-2-desc': 'Redundant engines and three independent control circuits. Safe landing capability even with partial failure.',
            'feat-3-title': 'Eco-Friendly',
            'feat-3-desc': 'Fully electric propulsion. We keep the unique nature of the Alatau foothills clean.',
            'srv-title': 'Our Services',
            'srv-1-title': 'Passenger Flights',
            'srv-1-desc': 'Airport  Center  Alatau. Business jet speed at the price of comfort-class taxi.',
            'srv-2-title': 'Cargo Logistics',
            'srv-2-desc': 'Urgent cargo delivery up to 10 kg in 30 minutes via dedicated air corridors.',
            'map-title': 'Roadmap',
            'map-subtitle': 'AAAG Project Stages',
            'map-25-title': 'Research & Planning',
            'map-25-desc': 'Air corridor analysis, digital mapping of Almaty, design of test center and takeoff/landing zones.',
            'map-26-title': 'Construction & Tests',
            'map-26-desc': 'Building verti-stops in Alatau-City. First test flights of air vehicles in various weather conditions.',
            'map-27-title': 'Regulation',
            'map-27-desc': 'Developing UAM legislative framework. Designing the central vertiport. Integration into the city master plan.',
            'map-28-title': 'Commercial Launch',
            'map-28-desc': 'Start of regular passenger and cargo flights of Alatau UAM airline.',
            'foot-desc': 'We are building the future of urban mobility today. The first air cluster in Central Asia.',
            'foot-nav': 'Navigation',
            'nav-news': 'News',
            'foot-addr-1': 'Almaty, Dostyk Ave 291/23',
            'foot-addr-2': '3rd Floor, AAAG Office',
            'form-title': 'Questions or Proposals?',
            'form-desc': 'Send us an email and we will contact you shortly!',
            'form-ph': 'Your email',
            'form-btn': 'Send',
            'social-follow': 'Follow us:',
            'foot-copy': ' 2026 Alatau City Project. All rights reserved.',
            'toast-succ': 'Request sent successfully',
            'modal-title': 'Contact Us',
            'modal-subtitle': 'Leave your details and we will contact you shortly',
            'modal-name': 'Your Name',
            'modal-phone': 'Phone / Email',
            'modal-msg': 'Message',
            'modal-send': 'Send Request',
            'modal-policy': 'By clicking the button you agree to the personal data processing policy',
            'news-page-title': 'UAM News',
            'news-page-subtitle': 'Latest updates on Urban Air Mobility and Alatau City Project',
            'team-title': 'AAAG Group Team',
            'team-subtitle': 'Professionals building the future of air mobility',
            'team-uteulin-name': 'Daniyar Uteulin',
            'team-uteulin-role': 'Project Manager',
            'team-aigul-name': 'Aigul Andabekova',
            'team-aigul-role': 'Lawyer',
            'team-yulia-name': 'Yulia Bedelbayeva',
            'team-yulia-role': 'Head of Supply, Logistics and Customs',
            'team-kabdelova-name': 'Ulzhan Kabdelova',
            'team-kabdelova-role': 'Investor Relations Manager',
            'team-asem-name': 'Asem Bibolova',
            'team-asem-role': 'Administrative Manager',
            'team-roman-name': 'Roman Bogdashkin',
            'team-roman-role': 'IT Director',
            'team-khegay-name': 'Sergey Khegay',
            'team-khegay-role': 'CEO',
            'team-alma-name': 'Alma Aliguzhinova',
            'team-alma-role': 'Executive Director'
        },
        KK: {
            'nav-about': 'Жоба туралы',
            'nav-solutions': 'Шешімдер',
            'nav-roadmap': 'Кезеңдер',
            'nav-invest': 'Инвесторларға',
            'nav-contacts': 'Байланыс',
            'search-ph': 'Іздеу...',
            'font-size': 'Қаріп өлшемі:',
            'contact-btn': 'Байланысу',
            'hero-title': 'Жаңа буынды<br>қалалық аэроұтқырлық',
            'hero-desc': 'Alatau Advance Air Group тік ұшатын электрлік аппараттар (eVTOL) инфрақұрылымын жасауда. Көлік болашағы осында.',
            'hero-more': 'Толығырақ',
            'hero-video': 'Бейнені көру',
            'about-title': 'Қозғалыстағы инновациялар',
            'about-subtitle': 'Alatau City жобасы',
            'about-text-1': '<strong>Urban Air Mobility (UAM)</strong>  бұл қалалық көліктің революциялық жүйесі. Біз Алматы мен Алатауды жалғайтын жолаушылар мен жүк тасымалдауға арналған электрлік ұшу аппараттарын енгіземіз.',
            'about-text-2': 'Біздің мақсатымыз  сағаттық кептелістерді жайлы 15 минуттық ұшуларға айналдыру және CO2 шығарындыларын нөлге теңестіру арқылы аймақ экологиясын сақтау.',
            'about-link': 'Техникалық мәліметтерді білу',
            'stat-co2': 'CO2 шығарындылары',
            'stat-time-val': '15 мин',
            'stat-time-desc': 'Алматыға ұшу уақыты',
            'stat-noise': 'Шу деңгейі (автокөліктен төмен)',
            'stat-jobs': 'Жұмыс орындары',
            'adv-title': 'Басты артықшылықтар',
            'adv-subtitle': 'Ыңғайлылық пен қауіпсіздік технологиялары',
            'feat-1-title': 'Акустикалық жайлылық',
            'feat-1-desc': 'Біздің аппараттар қаланың фондық шуымен біріктірілу үшін жобаланған. 65 дБ  бұл тыныш әңгіме деңгейі.',
            'feat-2-title': 'Үш есе қауіпсіздік',
            'feat-2-desc': 'Қосарланған қозғалтқыштар және үш тәуелсіз басқару контуры. Жартылай ақаулық кезінде де қауіпсіз қону мүмкіндігі.',
            'feat-3-title': 'Экологиялылық',
            'feat-3-desc': 'Толығымен электрлік тартым. Біз Алатау бөктерінің бірегей табиғатын таза сақтаймыз.',
            'srv-title': 'Қызмет бағыттары',
            'srv-1-title': 'Жолаушылар тасымалы',
            'srv-1-desc': 'Әуежай  Орталық  Алатау. Комфорт-класс такси бағасымен бизнес-джет жылдамдығы.',
            'srv-2-title': 'Жүк логистикасы',
            'srv-2-desc': 'Арнайы әуе дәліздері арқылы 10 кг-ға дейінгі жүкті 30 минут ішінде шұғыл жеткізу.',
            'map-title': 'Жол картасы',
            'map-subtitle': 'AAAG жобасын жүзеге асыру кезеңдері',
            'map-25-title': 'Зерттеу және Жоспарлау',
            'map-25-desc': 'Әуе дәліздерін талдау, Алматының цифрлық картасын жасау, сынақ орталығын және ұшу/қону аймақтарын жобалау.',
            'map-26-title': 'Құрылыс және Сынақтар',
            'map-26-desc': 'Алатау-Ситиде верти-стоптар құрылысының басталуы. Түрлі ауа райы жағдайында аэромобильдердің алғашқы сынақ ұшуларын өткізу.',
            'map-27-title': 'Реттеу',
            'map-27-desc': 'UAM заңнамалық базасын әзірлеу. Орталық вертипортты жобалау. Қаланың бас жоспарына интеграциялау.',
            'map-28-title': 'Коммерциялық іске қосу',
            'map-28-desc': 'Alatau UAM әуелінісінің тұрақты жолаушылар және жүк рейстерін бастау.',
            'foot-desc': 'Біз бүгін қалалық мобильділіктің болашағын құрудамыз. Орталық Азияның бірінші аэрокластері.',
            'foot-nav': 'Навигация',
            'nav-news': 'Жаңалықтар',
            'foot-addr-1': 'Алматы қ., Достық к-сі 291/23',
            'foot-addr-2': '3-қабат, AAAG кеңсесі',
            'form-title': 'Сұрақтарыңыз немесе ұсыныстарыңыз бар ма?',
            'form-desc': 'Пошта жіберіңіз, біз сізбен жақын арада байланысамыз!',
            'form-ph': 'Сіздің email',
            'form-btn': 'Жіберу',
            'social-follow': 'Әлеуметтік желілерде жазылыңыз:',
            'foot-copy': ' 2026 Alatau City Project. Барлық құқықтар қорғалған.',
            'toast-succ': 'Өтінім сәтті жіберілді',
            'modal-title': 'Бізбен байланысу',
            'modal-subtitle': 'Деректеріңізді қалдырыңыз, біз жақын арада хабарласамыз',
            'modal-name': 'Сіздің атыңыз',
            'modal-phone': 'Телефон / Email',
            'modal-msg': 'Хабарлама',
            'modal-send': 'Өтінім жіберу',
            'modal-policy': 'Түймені басу арқылы сіз дербес деректерді өңдеу саясатымен келісесіз',
            'news-page-title': 'UAM Жаңалықтары',
            'news-page-subtitle': 'Қалалық аэроұтқырлық әлемі мен Alatau City жобасының соңғы оқиғалары',
            'team-title': 'AAAG Group Командасы',
            'team-subtitle': 'Аэроұтқырлық болашағын құрушы кәсіби мамандар',
            'team-uteulin-name': 'Утеулин Данияр',
            'team-uteulin-role': 'Жоба менеджері',
            'team-aigul-name': 'Андабекова Айгуль',
            'team-aigul-role': 'Заңгер',
            'team-yulia-name': 'Бедельбаева Юлия',
            'team-yulia-role': 'Жабдықтау, логистика және кеден бөлімінің басшысы',
            'team-kabdelova-name': 'Кабделова Улжан',
            'team-kabdelova-role': 'Инвесторлармен жұмыс жөніндегі менеджер',
            'team-asem-name': 'Биболова Асем',
            'team-asem-role': 'Әкімшілік мәселелер жөніндегі менеджер',
            'team-roman-name': 'Богдашкин Роман',
            'team-roman-role': 'IT директоры',
            'team-khegay-name': 'Хегай Сергей',
            'team-khegay-role': 'Бас директор',
            'team-alma-name': 'Алигужинова Алма',
            'team-alma-role': 'Атқарушы директор'
        }
    };
    
    function initHeaderControls() {
        const accessBtn = document.getElementById('access-btn');
        const accessPanel = document.getElementById('access-panel');
        const fontBtns = document.querySelectorAll('.font-btn');
        
        const langBtn = document.getElementById('lang-btn');
        const langDropdown = document.getElementById('lang-dropdown');
        const currLangText = document.getElementById('curr-lang-text');
        const langLinks = document.querySelectorAll('.lang-dropdown a');
        
        // Function to apply translations
        function setLanguage(lang) {
            if (!translations[lang]) return;
            
            // Update UI text
            if (currLangText) currLangText.textContent = lang;
            
             // 1. Update text content (data-i18n)
            const textElements = document.querySelectorAll('[data-i18n]');
            textElements.forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (translations[lang][key]) {
                    // Start basic
                    if (el.innerHTML.includes('<br>') || translations[lang][key].includes('<')) {
                        el.innerHTML = translations[lang][key];
                    } else {
                        el.textContent = translations[lang][key];
                    }
                }
            });

            // 2. Update placeholders (data-i18n-placeholder)
            const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
            placeholderElements.forEach(el => {
                const key = el.getAttribute('data-i18n-placeholder');
                if (translations[lang][key]) {
                    el.placeholder = translations[lang][key];
                }
            });

            // 3. Save to local storage (optional, but good for UX)
            // localStorage.setItem('aaag-lang', lang); 
            
            // 4. Update html lang attribute
            document.documentElement.lang = lang.toLowerCase();

            // 5. Dispatch event for other scripts (e.g. news.html)
            document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: lang } }));
        }

        // --- Accessibility ---
        if (accessBtn && accessPanel) {
             accessBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                accessPanel.classList.toggle('show');
                if (langDropdown) langDropdown.classList.remove('show');
            });
            
            fontBtns.forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    fontBtns.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    const scale = this.getAttribute('data-scale');
                    document.documentElement.style.setProperty('--font-scale', scale);
                });
            });
        }
        
        // --- Language ---
        if (langBtn && langDropdown) {
             langBtn.addEventListener('click', function(e) {
                e.preventDefault(); 
                e.stopPropagation();
                langDropdown.classList.toggle('show');
                if (accessPanel) accessPanel.classList.remove('show');
            });

            langLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const lang = this.getAttribute('data-lang');
                    setLanguage(lang);
                    langDropdown.classList.remove('show');
                });
            });
        }
        
        // --- Outside Click ---
        document.addEventListener('click', function(e) {
            if (accessPanel && accessPanel.classList.contains('show')) {
                if (!accessPanel.contains(e.target) && e.target !== accessBtn && !accessBtn.contains(e.target)) {
                    accessPanel.classList.remove('show');
                }
            }
            if (langDropdown && langDropdown.classList.contains('show')) {
                if (!langDropdown.contains(e.target) && e.target !== langBtn && !langBtn.contains(e.target)) {
                    langDropdown.classList.remove('show');
                }
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHeaderControls);
    } else {
        initHeaderControls();
    }
})();

// Search Bar Logic
(function() {
    'use strict';

    function initSearch() {
        const searchBtn = document.getElementById('search-btn');
        const searchOverlay = document.getElementById('search-overlay');
        const searchClose = document.getElementById('search-close');
        const searchInput = searchOverlay ? searchOverlay.querySelector('input') : null;
        const navMenu = document.getElementById('nav-menu');

        if (!searchBtn || !searchOverlay || !searchClose || !navMenu) return;

        function openSearch() {
            searchOverlay.classList.add('active');
            navMenu.style.opacity = '0';
            navMenu.style.pointerEvents = 'none';
            if (searchInput) setTimeout(() => searchInput.focus(), 100);
        }

        function closeSearch() {
            searchOverlay.classList.remove('active');
            navMenu.style.opacity = '1';
            navMenu.style.pointerEvents = 'all';
        }

        searchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); // Prevent bubbling
            openSearch();
        });

        searchClose.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeSearch();
        });

        // Search Submit Logic
        if (searchInput) {
            searchInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    if (this.value.trim().length > 0) {
                        window.location.href = `search.html?q=${encodeURIComponent(this.value.trim())}`;
                    }
                }
            });
        }

        // Close on Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
                closeSearch();
            }
        });
        
        // Close on click outside (optional nicety)
        document.addEventListener('click', function(e) {
            if (searchOverlay.classList.contains('active')) {
                // If click is not inside the search overlay and not the search button
                if (!searchOverlay.contains(e.target) && !searchBtn.contains(e.target)) {
                    closeSearch();
                }
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSearch);
    } else {
        initSearch();
    }
})();

// Footer Form Handler
(function() {
    'use strict';
    
    function initFooterForm() {
        const form = document.getElementById('footer-contact-form');
        const toast = document.getElementById('success-toast');
        
        if (!form || !toast) return;
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const input = form.querySelector('input');
            
            // Validate (simple check)
            if (input && input.value.trim() !== '') {
                // Simulate sending
                const originalText = input.value;
                input.value = '';
                
                // Show toast
                toast.classList.add('show');
                
                // Hide after 3 seconds
                setTimeout(() => {
                    toast.classList.remove('show');
                }, 3000);
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFooterForm);
    } else {
        initFooterForm();
    }
})();

// Mobile Menu Logic
(function() {
    'use strict';

    function initMobileMenu() {
        const menuBtn = document.getElementById('mobile-menu-btn');
        const nav = document.getElementById('navbar-nav');
        const overlay = document.getElementById('mobile-overlay');
        // Select links inside the *actual* nav menu list
        const links = nav ? nav.querySelectorAll('a') : [];

        if (!menuBtn || !nav || !overlay) return;

        function toggleMenu() {
            const isActive = nav.classList.contains('active');
            
            if (isActive) {
                nav.classList.remove('active');
                overlay.classList.remove('active');
                menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
                document.body.style.overflow = '';
            } else {
                nav.classList.add('active');
                overlay.classList.add('active');
                menuBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
                document.body.style.overflow = 'hidden';
            }
        }

        menuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMenu();
        });

        overlay.addEventListener('click', function(e) {
            e.preventDefault();
            if (nav.classList.contains('active')) toggleMenu();
        });

        // Close menu when clicking a link
        links.forEach(link => {
            link.addEventListener('click', function() {
                if (nav.classList.contains('active')) toggleMenu();
            });
        });

        // Close on escape
        document.addEventListener('keydown', function(e) {
             if (e.key === 'Escape' && nav.classList.contains('active')) {
                toggleMenu();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileMenu);
    } else {
        initMobileMenu();
    }
})();


// Sticky Header Logic (Show on scroll up, hide on scroll down)
(function() {
    'use strict';
    
    let lastScrollY = window.scrollY;
    const header = document.querySelector('header');
    
    if (!header) return;

    function updateHeader() {
        const currentScrollY = window.scrollY;
        
        // At the very top (allow some buffer e.g. 50px)
        if (currentScrollY <= 50) {
            header.classList.remove('header-hidden');
            header.classList.remove('header-scrolled');
        } else {
            header.classList.add('header-scrolled');
            
            if (currentScrollY > lastScrollY) {
                // Scrolling DOWN -> Hide
                header.classList.add('header-hidden');
            } else {
                // Scrolling UP -> Show
                header.classList.remove('header-hidden');
            }
        }
        
        lastScrollY = currentScrollY;
    }

    // Throttling for better performance
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                updateHeader();
                ticking = false;
            });
            ticking = true;
        }
    });
})();


// Scroll To Top Button Logic
(function() {
    'use strict';
    
    const scrollBtn = document.getElementById('scroll-top-btn');
    
    if (!scrollBtn) return;
    
    // Show/Hide button on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            scrollBtn.classList.add('show');
        } else {
            scrollBtn.classList.remove('show');
        }
    });
    
    // Smooth scroll to top on click
    scrollBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
})();

