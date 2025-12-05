// ============ تهيئة التطبيق ============
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة حالة التطبيق
    const appState = {
        currentLang: 'ar' // اللغة الافتراضية
    };
    
    // عناصر DOM المهمة
    const elements = {
        heroName: document.getElementById('hero-name'),
        heroRole: document.getElementById('hero-role'),
        heroTagline: document.getElementById('hero-tagline'),
        servicesContainer: document.getElementById('services-container'),
        skillsContainer: document.getElementById('skills-container'),
        projectsContainer: document.getElementById('projects-container'),
        copyrightText: document.getElementById('copyright-text'),
        profileImg: document.getElementById('profile-img'),
        fallbackName: document.getElementById('fallback-name'),
        fallbackTitle: document.getElementById('fallback-title')
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
                role_ar: "خبير حلول البيانات التفاعلية",
                role_en: "Interactive Data Solutions Expert",
                tagline_ar: "أحول البيانات المعقدة إلى لوحات تحكم ذكية وقابلة للتنفيذ",
                tagline_en: "Transforming complex data into actionable, intelligent dashboards"
            },
            projects: [],
            skills: {},
            services: { ar: [], en: [] },
            translations: { ar: {}, en: {} }
        };
    }
    
    // ============ تهيئة التطبيق بعد تحميل البيانات ============
    function initializeApp() {
        // تهيئة تبديل اللغة
        initLanguageToggle();
        
        // تهيئة الصورة الشخصية
        initProfileImage();
        
        // تحديث جميع النصوص بناءً على اللغة الحالية
        updateAllTexts();
        
        // تحميل المحتوى الديناميكي
        loadDynamicContent();
        
        // إعداد حدث التمرير للنافذة
        setupScrollEvents();
    }
    
    // ============ تبديل اللغة ============
    function initLanguageToggle() {
        const langToggle = document.getElementById('lang-toggle-simple');
        
        if (langToggle) {
            langToggle.addEventListener('click', function() {
                // تبديل اللغة
                appState.currentLang = appState.currentLang === 'ar' ? 'en' : 'ar';
                
                // تحديث اتجاه الصفحة
                document.documentElement.dir = appState.currentLang === 'ar' ? 'rtl' : 'ltr';
                document.documentElement.lang = appState.currentLang;
                
                // تحديث جميع النصوص
                updateAllTexts();
                
                // تحديث المحتوى الديناميكي
                updateDynamicContent();
                
                // إعادة تحميل البيانات
                reloadDynamicData();
            });
        }
    }
    
    // ============ تهيئة الصورة الشخصية ============
    function initProfileImage() {
        if (elements.profileImg) {
            // بعد 2 ثانية، إذا لم تتحمل الصورة، أظهر البديل
            setTimeout(() => {
                if (elements.profileImg.naturalWidth === 0 || !elements.profileImg.complete) {
                    console.log('⚠️ الصورة لم تتحمل، عرض البديل');
                    elements.profileImg.style.display = 'none';
                    document.getElementById('avatar-fallback').style.display = 'flex';
                }
            }, 2000);
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
        
        // تحديث نص البديل للصورة
        if (elements.fallbackName) {
            elements.fallbackName.textContent = user[`name_${lang}`];
        }
        
        if (elements.fallbackTitle) {
            elements.fallbackTitle.textContent = user[`role_${lang}`];
        }
        
        // تحديث جميع النصوص المترجمة
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (t && t[key]) {
                element.textContent = t[key];
            }
        });
        
        // تحديث نص حقوق النشر
        if (elements.copyrightText) {
            const year = new Date().getFullYear();
            if (lang === 'ar') {
                elements.copyrightText.innerHTML = `© ${year} جميع الحقوق محفوظة. <strong>Aseel Alzawahreh</strong>`;
            } else {
                elements.copyrightText.innerHTML = `© ${year} All rights reserved. <strong>Aseel Alzawahreh</strong>`;
            }
        }
        
        // تحديث نص زر تبديل اللغة
        const langTextElement = document.getElementById('lang-text-simple');
        if (langTextElement) {
            langTextElement.textContent = lang === 'ar' ? 'EN' : 'عربي';
        }
    }
    
    // ============ تحميل المحتوى الديناميكي ============
    function loadDynamicContent() {
        loadServices();
        loadSkills();
        loadProjects();
    }
    
    function updateDynamicContent() {
        // إعادة تحميل كل المحتوى باللغة الجديدة
        loadServices();
        loadSkills();
        loadProjects();
    }
    
    function reloadDynamicData() {
        // إعادة تحميل البيانات من الملف
        loadData();
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
        // التمرير السلس عند النقر على الروابط
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                if (href === '#') return;
                
                e.preventDefault();
                const targetElement = document.querySelector(href);
                
                if (targetElement) {
                    const offset = 60;
                    const targetPosition = targetElement.offsetTop - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // ============ بدء تحميل البيانات ============
    loadData();
});