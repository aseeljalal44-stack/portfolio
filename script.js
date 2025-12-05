// ============ تهيئة التطبيق ============
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة حالة التطبيق
    const appState = {
        currentLang: 'ar', // اللغة الافتراضية
        isMenuOpen: false
    };
    
    // عناصر DOM المهمة
    const elements = {
        langToggle: document.getElementById('lang-toggle'),
        hamburger: document.getElementById('hamburger'),
        navMenu: document.getElementById('nav-menu'),
        heroName: document.getElementById('hero-name'),
        heroRole: document.getElementById('hero-role'),
        heroTagline: document.getElementById('hero-tagline'),
        servicesContainer: document.getElementById('services-container'),
        skillsContainer: document.getElementById('skills-container'),
        projectsContainer: document.getElementById('projects-container'),
        copyrightText: document.getElementById('copyright-text'),
        profileImg: document.getElementById('profile-img'),
        cvDownload: document.getElementById('cv-download')
    };
    
    // ============ تحميل البيانات ============
    let appData = {};
    
    async function loadData() {
        try {
            const response = await fetch('data.json');
            appData = await response.json();
            initializeApp();
        } catch (error) {
            console.error('خطأ في تحميل البيانات:', error);
            appData = getDefaultData();
            initializeApp();
        }
    }
    
    function getDefaultData() {
        return {
            user: {
                name_ar: "أسيل الزواهرة",
                name_en: "Aseel Alzawahreh",
                role_ar: "مطور لوحات تحكّم تفاعلية",
                role_en: "Interactive Dashboard Developer",
                tagline_ar: "تحويل البيانات إلى تطبيقات ذكية وسهلة الاستخدام",
                tagline_en: "Transforming data into smart, usable web apps"
            },
            projects: [],
            skills: {},
            services: { ar: [], en: [] },
            translations: { ar: {}, en: {} }
        };
    }
    
    // ============ تهيئة التطبيق بعد تحميل البيانات ============
    function initializeApp() {
        // تهيئة القائمة المتحركة
        initMobileMenu();
        
        // تهيئة تبديل اللغة
        initLanguageToggle();
        
        // تهيئة الصورة الشخصية
        initProfileImage();
        
        // تهيئة زر تحميل السيرة الذاتية
        initCvDownload();
        
        // تحديث جميع النصوص بناءً على اللغة الحالية
        updateAllTexts();
        
        // تحميل المحتوى الديناميكي
        loadDynamicContent();
        
        // إعداد حدث التمرير للنافذة
        setupScrollEvents();
    }
    
    // ============ القائمة المتحركة للأجهزة المحمولة ============
    function initMobileMenu() {
        if (elements.hamburger && elements.navMenu) {
            elements.hamburger.addEventListener('click', function() {
                appState.isMenuOpen = !appState.isMenuOpen;
                elements.navMenu.classList.toggle('active');
                
                // تغيير أيقونة القائمة
                const icon = elements.hamburger.querySelector('i');
                if (appState.isMenuOpen) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
            
            // إغلاق القائمة عند النقر على رابط
            const navLinks = elements.navMenu.querySelectorAll('a');
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    if (window.innerWidth <= 768) {
                        appState.isMenuOpen = false;
                        elements.navMenu.classList.remove('active');
                        const icon = elements.hamburger.querySelector('i');
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                });
            });
        }
    }
    
    // ============ تبديل اللغة ============
    function initLanguageToggle() {
        if (elements.langToggle) {
            elements.langToggle.addEventListener('click', function() {
                // تبديل اللغة
                appState.currentLang = appState.currentLang === 'ar' ? 'en' : 'ar';
                
                // تحديث النصوص
                updateAllTexts();
                
                // تحديث اتجاه الصفحة
                document.documentElement.dir = appState.currentLang === 'ar' ? 'rtl' : 'ltr';
                document.documentElement.lang = appState.currentLang;
                
                // تحديث نص زر تبديل اللغة
                const langText = elements.langToggle.querySelector('.lang-text');
                langText.textContent = appState.currentLang === 'ar' ? 'EN' : 'عربي';
                
                // إغلاق القائمة المتحركة إذا كانت مفتوحة
                if (window.innerWidth <= 768 && appState.isMenuOpen) {
                    appState.isMenuOpen = false;
                    elements.navMenu.classList.remove('active');
                    const icon = elements.hamburger.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        }
    }
    
    // ============ تهيئة الصورة الشخصية ============
    function initProfileImage() {
        if (elements.profileImg) {
            // إضافة حدث عند فشل تحميل الصورة
            elements.profileImg.addEventListener('error', function() {
                // إذا فشل تحميل الصورة، اعرض أيقونة بديلة
                this.parentElement.innerHTML = `
                    <div class="avatar-fallback">
                        <i class="fas fa-user"></i>
                        <span>أضف صورتك</span>
                    </div>
                `;
                
                // أضف أنماط الأيقونة البديلة
                const style = document.createElement('style');
                style.textContent = `
                    .avatar-fallback {
                        width: 100%;
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        background: linear-gradient(135deg, var(--primary), var(--secondary));
                        color: white;
                    }
                    .avatar-fallback i {
                        font-size: 4rem;
                        margin-bottom: 1rem;
                    }
                    .avatar-fallback span {
                        font-size: 0.9rem;
                        font-weight: 600;
                    }
                `;
                document.head.appendChild(style);
            });
        }
    }
    
    // ============ تهيئة زر تحميل السيرة الذاتية ============
    function initCvDownload() {
        if (elements.cvDownload) {
            elements.cvDownload.addEventListener('click', function(e) {
                e.preventDefault();
                
                const lang = appState.currentLang;
                const message = lang === 'ar' 
                    ? 'سيتم إضافة رابط تحميل السيرة الذاتية قريبًا.'
                    : 'CV download link will be added soon.';
                
                alert(message);
            });
        }
    }
    
    // ============ تحديث جميع النصوص ============
    function updateAllTexts() {
        // تحديث النصوص الأساسية
        updateBasicTexts();
        
        // تحديث المحتوى الديناميكي
        updateDynamicContent();
    }
    
    function updateBasicTexts() {
        const lang = appState.currentLang;
        const t = appData.translations[lang];
        const user = appData.user;
        
        // تحديث قسم البطل
        if (elements.heroName) {
            elements.heroName.textContent = user[`name_${lang}`];
            elements.heroName.className = lang === 'ar' ? 'arabic-name' : '';
        }
        
        if (elements.heroRole) {
            elements.heroRole.textContent = user[`role_${lang}`];
        }
        
        if (elements.heroTagline) {
            elements.heroTagline.textContent = user[`tagline_${lang}`];
        }
        
        // تحديث النصوص المترجمة
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (t && t[key]) {
                element.textContent = t[key];
            }
        });
        
        // تحديث نص حقوق النشر
        if (elements.copyrightText) {
            const year = new Date().getFullYear();
            elements.copyrightText.textContent = lang === 'ar' 
                ? `© ${year} Dashboard Pro Portfolio. جميع الحقوق محفوظة.`
                : `© ${year} Dashboard Pro Portfolio. All rights reserved.`;
        }
    }
    
    // ============ تحميل المحتوى الديناميكي ============
    function loadDynamicContent() {
        loadServices();
        loadSkills();
        loadProjects();
    }
    
    function updateDynamicContent() {
        loadServices();
        loadSkills();
        loadProjects();
    }
    
    function loadServices() {
        if (!elements.servicesContainer || !appData.services) return;
        
        const lang = appState.currentLang;
        const services = appData.services[lang] || [];
        
        elements.servicesContainer.innerHTML = '';
        
        services.forEach(service => {
            const serviceCard = document.createElement('div');
            serviceCard.className = 'service-card';
            serviceCard.innerHTML = `
                <div class="service-icon">
                    <i class="fas fa-chart-line"></i>
                </div>
                <h4>${service.title}</h4>
                <p>${service.description}</p>
            `;
            elements.servicesContainer.appendChild(serviceCard);
        });
    }
    
    function loadSkills() {
        if (!elements.skillsContainer || !appData.skills) return;
        
        const lang = appState.currentLang;
        elements.skillsContainer.innerHTML = '';
        
        if (Object.keys(appData.skills).length === 0) {
            elements.skillsContainer.innerHTML = '<p style="text-align:center; color:var(--muted);">جاري تحميل المهارات...</p>';
            return;
        }
        
        Object.keys(appData.skills).forEach(categoryKey => {
            const category = appData.skills[categoryKey];
            
            const skillCategory = document.createElement('div');
            skillCategory.className = 'skill-category';
            
            let skillsHTML = '';
            category.items.forEach(skill => {
                skillsHTML += `
                    <div class="skill-item">
                        <span class="skill-name">${skill.name}</span>
                        <span class="skill-desc">${skill[`desc_${lang}`]}</span>
                    </div>
                `;
            });
            
            skillCategory.innerHTML = `
                <h3><i class="${category.icon || 'fas fa-star'}"></i> ${category[`title_${lang}`]}</h3>
                ${skillsHTML}
            `;
            
            elements.skillsContainer.appendChild(skillCategory);
        });
    }
    
    function loadProjects() {
        if (!elements.projectsContainer || !appData.projects) return;
        
        const lang = appState.currentLang;
        const t = appData.translations[lang];
        elements.projectsContainer.innerHTML = '';
        
        if (!appData.projects || appData.projects.length === 0) {
            elements.projectsContainer.innerHTML = '<p style="text-align:center; color:var(--muted);">جاري تحميل المشاريع...</p>';
            return;
        }
        
        appData.projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            
            let tagsHTML = '';
            if (project.tags && project.tags.length > 0) {
                tagsHTML = '<div class="project-tags">';
                project.tags.forEach(tag => {
                    tagsHTML += `<span class="project-tag">${tag}</span>`;
                });
                tagsHTML += '</div>';
            }
            
            projectCard.innerHTML = `
                <div class="project-icon">${project.icon}</div>
                <h4>${project[`title_${lang}`]}</h4>
                <p>${project[`desc_${lang}`]}</p>
                ${tagsHTML}
                <div class="project-links">
                    <a href="${project.url}" target="_blank" class="project-link primary">
                        ${t.view_live || 'عرض التطبيق'}
                    </a>
                    <a href="${project.github_url || appData.user.github}" target="_blank" class="project-link secondary">
                        ${t.view_code || 'عرض الكود'}
                    </a>
                </div>
            `;
            
            elements.projectsContainer.appendChild(projectCard);
        });
    }
    
    // ============ أحداث التمرير ============
    function setupScrollEvents() {
        // تحديث الرابط النشط في شريط التنقل أثناء التمرير
        window.addEventListener('scroll', function() {
            updateActiveNavLink();
        });
        
        // التمرير السلس عند النقر على الروابط
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                if (href === '#') return;
                
                e.preventDefault();
                const targetElement = document.querySelector(href);
                
                if (targetElement) {
                    const offset = 80;
                    const targetPosition = targetElement.offsetTop - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
        
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }
    
    // ============ بدء تحميل البيانات ============
    loadData();
});