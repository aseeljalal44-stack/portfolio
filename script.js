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
        siteTitle: document.getElementById('site-title'),
        heroName: document.getElementById('hero-name'),
        heroRole: document.getElementById('hero-role'),
        heroTagline: document.getElementById('hero-tagline'),
        servicesContainer: document.getElementById('services-container'),
        skillsContainer: document.getElementById('skills-container'),
        projectsContainer: document.getElementById('projects-container'),
        messageForm: document.getElementById('message-form'),
        formMessage: document.getElementById('form-message'),
        copyrightText: document.getElementById('copyright-text')
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
            // استخدام بيانات افتراضية في حالة الخطأ
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
        
        // تحديث جميع النصوص بناءً على اللغة الحالية
        updateAllTexts();
        
        // تحميل المحتوى الديناميكي
        loadDynamicContent();
        
        // تهيئة نموذج الاتصال
        initContactForm();
        
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
        
        // تحديث العنوان
        if (elements.siteTitle) {
            elements.siteTitle.textContent = user[`name_${lang}`];
        }
        
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
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = t[key];
                } else if (element.tagName === 'LABEL') {
                    element.textContent = t[key];
                } else {
                    element.textContent = t[key];
                }
            }
        });
        
        // تحديث نص حقوق النشر
        if (elements.copyrightText) {
            const year = new Date().getFullYear();
            elements.copyrightText.textContent = lang === 'ar' 
                ? `© ${year} أسيل الزواهرة. جميع الحقوق محفوظة.`
                : `© ${year} Aseel Alzawahreh. All rights reserved.`;
        }
    }
    
    // ============ تحميل المحتوى الديناميكي ============
    function loadDynamicContent() {
        loadServices();
        loadSkills();
        loadProjects();
    }
    
    function updateDynamicContent() {
        updateServices();
        updateSkills();
        updateProjects();
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
    
    function updateServices() {
        loadServices(); // إعادة تحميل الخدمات باللغة الجديدة
    }
    
    function loadSkills() {
        if (!elements.skillsContainer || !appData.skills) return;
        
        const lang = appState.currentLang;
        elements.skillsContainer.innerHTML = '';
        
        // التحقق من وجود بيانات المهارات
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
                <h3>${category[`title_${lang}`]}</h3>
                ${skillsHTML}
            `;
            
            elements.skillsContainer.appendChild(skillCategory);
        });
    }
    
    function updateSkills() {
        loadSkills(); // إعادة تحميل المهارات باللغة الجديدة
    }
    
    function loadProjects() {
        if (!elements.projectsContainer || !appData.projects) return;
        
        const lang = appState.currentLang;
        const t = appData.translations[lang];
        elements.projectsContainer.innerHTML = '';
        
        // التحقق من وجود بيانات المشاريع
        if (!appData.projects || appData.projects.length === 0) {
            elements.projectsContainer.innerHTML = '<p style="text-align:center; color:var(--muted);">جاري تحميل المشاريع...</p>';
            return;
        }
        
        appData.projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            
            // إنشاء العلامات
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
    
    function updateProjects() {
        loadProjects(); // إعادة تحميل المشاريع باللغة الجديدة
    }
    
    // ============ نموذج الاتصال ============
    function initContactForm() {
        if (!elements.messageForm) return;
        
        elements.messageForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const lang = appState.currentLang;
            const t = appData.translations[lang];
            
            // الحصول على قيم الحقول
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            
            // التحقق من الحقول
            if (!name || !email || !message) {
                showFormMessage(t.fill_fields || '⚠️ يرجى ملء جميع الحقول.', 'error');
                return;
            }
            
            // في موقع حقيقي، هنا ترسل البيانات إلى الخادم
            // لكن في النسخة الثابتة، نعرض رسالة نجاح فقط
            
            // عرض رسالة النجاح
            showFormMessage(t.message_sent || '✅ تم إرسال الرسالة. سأعاود التواصل معك قريبًا.', 'success');
            
            // إعادة تعيين النموذج
            elements.messageForm.reset();
            
            // إخفاء الرسالة بعد 5 ثوان
            setTimeout(() => {
                elements.formMessage.style.display = 'none';
            }, 5000);
        });
    }
    
    function showFormMessage(text, type) {
        if (!elements.formMessage) return;
        
        elements.formMessage.textContent = text;
        elements.formMessage.className = `form-message ${type}`;
        elements.formMessage.style.display = 'block';
        
        // التمرير إلى الرسالة
        elements.formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
                    const offset = 80; // تعويض لشريط التنقل الثابت
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
