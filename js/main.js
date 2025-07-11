// Portfolio Data Manager with Glass Morphism Design
class PortfolioManager {
    constructor() {
        this.data = null;
        this.init();
    }

    async init() {
        await this.loadData();
        this.setupEventListeners();
        this.populateContent();
        this.setupScrollAnimations();
        this.setupParallaxEffects();
    }

    async loadData() {
        try {
            const response = await fetch('./data/portfolio-data.json');
            this.data = await response.json();
        } catch (error) {
            console.error('Failed to load portfolio data:', error);
        }
    }

    setupEventListeners() {
        // Mobile menu toggle
        const mobileMenuButton = document.querySelector('.mobile-menu-button');
        const mobileMenu = document.querySelector('.mobile-menu');
        
        if (mobileMenuButton && mobileMenu) {
            mobileMenuButton.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
                const icon = mobileMenuButton.querySelector('i');
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            });
        }

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    // Close mobile menu if open
                    const mobileMenu = document.querySelector('.mobile-menu');
                    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                        mobileMenu.classList.add('hidden');
                        const icon = document.querySelector('.mobile-menu-button i');
                        icon.classList.add('fa-bars');
                        icon.classList.remove('fa-times');
                    }
                }
            });
        });

        // Contact form submission
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', this.handleContactForm.bind(this));
        }

        // Active nav link highlighting
        this.setupActiveNavigation();
    }

    setupActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link-glass');

        const observerOptions = {
            root: null,
            rootMargin: '-50% 0px -50% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const currentId = entry.target.id;
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${currentId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => observer.observe(section));
    }

    setupScrollAnimations() {
        const revealElements = document.querySelectorAll('.glass-card, .skill-card-glass, .project-card-glass, .experience-card-glass, .testimonial-card-glass, .blog-card-glass');
        
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal', 'active');
                    entry.target.style.animationDelay = `${Math.random() * 0.3}s`;
                }
            });
        }, observerOptions);

        revealElements.forEach(element => {
            element.classList.add('reveal');
            observer.observe(element);
        });
    }

    setupParallaxEffects() {
        // Subtle parallax effect for floating elements
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.glass-card-floating');
            
            parallaxElements.forEach((element, index) => {
                const speed = 0.1 + (index * 0.05);
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px) rotate(${Math.sin(scrolled * 0.001) * 2}deg)`;
            });

            // Floating orbs animation
            const orbs = document.querySelectorAll('[class*="animate-glow"], [class*="animate-float"]');
            orbs.forEach((orb, index) => {
                const speed = 0.05 + (index * 0.02);
                const xPos = Math.sin(scrolled * 0.001 + index) * 10;
                const yPos = -(scrolled * speed);
                orb.style.transform = `translate(${xPos}px, ${yPos}px)`;
            });
        });
    }

    populateContent() {
        if (!this.data) return;

        this.populateAboutSection();
        this.populateSkillsSection();
        this.populateProjectsSection();
        this.populateExperienceSection();
        this.populateTestimonialsSection();
        this.populateBlogSection();
        this.populateContactInfo();
    }

    populateAboutSection() {
        const { about } = this.data;
        
        // Populate about text
        document.getElementById('about-intro').textContent = about.intro;
        document.getElementById('about-story').textContent = about.story;
        document.getElementById('about-philosophy').textContent = about.philosophy;
        
        // Populate achievements
        const achievementsList = document.getElementById('achievements-list');
        achievementsList.innerHTML = about.achievements
            .map(achievement => `
                <li class="achievement-item-glass">
                    <i class="fas fa-check-circle text-green-600 flex-shrink-0 mt-1"></i>
                    <span>${achievement}</span>
                </li>
            `).join('');
    }

    populateSkillsSection() {
        const { skills } = this.data;
        
        // Populate skill categories
        this.populateSkillCategory('frontend-skills', skills.frontend);
        this.populateSkillCategory('backend-skills', skills.backend);
        this.populateSkillCategory('ai-skills', skills.aiTools);
        this.populateSkillCategory('cloud-skills', [...skills.cloud, ...skills.tools]);
    }

    populateSkillCategory(elementId, skills) {
        const container = document.getElementById(elementId);
        if (container) {
            container.innerHTML = skills
                .map(skill => `
                    <div class="skill-item-glass">
                        ${skill}
                    </div>
                `).join('');
        }
    }

    populateProjectsSection() {
        const { projects } = this.data;
        const projectsGrid = document.getElementById('projects-grid');
        
        projectsGrid.innerHTML = projects
            .map(project => `
                <div class="project-card-glass group">
                    <div class="overflow-hidden rounded-t-2xl">
                        <img src="${project.image}" alt="${project.title}" class="project-image-glass">
                    </div>
                    <div class="p-6">
                        <h3 class="project-title-glass">${project.title}</h3>
                        <p class="project-description-glass">${project.description}</p>
                        
                        <div class="project-ai-glass">
                            <i class="fas fa-robot mr-2"></i>
                            ${project.aiAssistance}
                        </div>
                        
                        <div class="project-tech-glass">
                            ${project.technologies.map(tech => `
                                <span class="tech-tag-glass">${tech}</span>
                            `).join('')}
                        </div>
                        
                        <div class="project-links-glass">
                            <a href="${project.demo}" class="project-link-glass" target="_blank" rel="noopener">
                                <i class="fas fa-external-link-alt mr-2"></i>
                                Live Demo
                            </a>
                            <a href="${project.github}" class="project-link-glass" target="_blank" rel="noopener">
                                <i class="fab fa-github mr-2"></i>
                                Code
                            </a>
                        </div>
                    </div>
                </div>
            `).join('');
    }

    populateExperienceSection() {
        const { experience } = this.data;
        const experienceTimeline = document.getElementById('experience-timeline');
        
        experienceTimeline.innerHTML = experience
            .map((exp, index) => `
                <div class="experience-item-glass">
                    <div class="timeline-dot-glass"></div>
                    <div class="experience-card-glass">
                        <h3 class="experience-title-glass">${exp.title}</h3>
                        <div class="experience-company-glass">${exp.company}</div>
                        <div class="experience-period-glass">${exp.period}</div>
                        <p class="experience-description-glass">${exp.description}</p>
                        
                        <div class="space-y-2">
                            ${exp.achievements.map(achievement => `
                                <div class="achievement-item-glass">
                                    <i class="fas fa-arrow-right text-warm-600 flex-shrink-0 mt-1"></i>
                                    <span>${achievement}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `).join('');
    }

    populateTestimonialsSection() {
        const { testimonials } = this.data;
        const testimonialsGrid = document.getElementById('testimonials-grid');
        
        testimonialsGrid.innerHTML = testimonials
            .map(testimonial => `
                <div class="testimonial-card-glass">
                    <div class="testimonial-content-glass">
                        ${testimonial.content}
                    </div>
                    <div class="testimonial-author-glass">${testimonial.name}</div>
                    <div class="testimonial-title-glass">${testimonial.title}</div>
                    <div class="testimonial-rating-glass">
                        ${Array(testimonial.rating).fill('<i class="fas fa-star star-glass"></i>').join('')}
                    </div>
                </div>
            `).join('');
    }

    populateBlogSection() {
        const { blog } = this.data;
        const blogGrid = document.getElementById('blog-grid');
        
        blogGrid.innerHTML = blog
            .map(post => `
                <div class="blog-card-glass">
                    <div class="p-6">
                        <h3 class="blog-title-glass">${post.title}</h3>
                        <p class="blog-excerpt-glass">${post.excerpt}</p>
                        
                        <div class="blog-meta-glass">
                            <span>${post.date}</span>
                            <span>${post.readTime}</span>
                        </div>
                        
                        <div class="blog-tags-glass">
                            ${post.tags.map(tag => `
                                <span class="blog-tag-glass">${tag}</span>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `).join('');
    }

    populateContactInfo() {
        const { personal } = this.data;
        
        document.getElementById('contact-email').textContent = personal.email;
        document.getElementById('contact-phone').textContent = personal.phone;
        document.getElementById('contact-location').textContent = personal.location;
        
        // Update social links
        const socialLinks = {
            'github': personal.github,
            'linkedin': personal.linkedin,
            'twitter': personal.twitter
        };
        
        Object.entries(socialLinks).forEach(([platform, url]) => {
            document.querySelectorAll(`a[aria-label*="${platform.charAt(0).toUpperCase() + platform.slice(1)}"]`)
                .forEach(link => link.href = url);
        });
    }

    handleContactForm(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        // Simulate form submission with glass morphism feedback
        const submitButton = e.target.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        // Loading state
        submitButton.innerHTML = `
            <i class="fas fa-spinner fa-spin mr-2"></i>
            Sending...
        `;
        submitButton.disabled = true;
        submitButton.style.background = 'rgba(255, 255, 255, 0.2)';
        
        // Simulate API call
        setTimeout(() => {
            // Success state
            submitButton.innerHTML = `
                <i class="fas fa-check mr-2"></i>
                Message Sent!
            `;
            submitButton.style.background = 'rgba(34, 197, 94, 0.2)';
            
            // Create success notification
            this.showNotification('Thank you! Your message has been sent successfully.', 'success');
            
            // Reset form
            setTimeout(() => {
                e.target.reset();
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
                submitButton.style.background = '';
            }, 2000);
        }, 1500);
    }

    showNotification(message, type = 'success') {
        // Create glass morphism notification
        const notification = document.createElement('div');
        notification.className = `
            fixed top-24 right-6 z-50 max-w-sm p-6 rounded-2xl
            backdrop-blur-lg border shadow-lg transform translate-x-full
            transition-all duration-500 ease-out
            ${type === 'success' 
                ? 'bg-green-500/10 border-green-500/20 text-green-800' 
                : 'bg-red-500/10 border-red-500/20 text-red-800'
            }
        `;
        
        notification.innerHTML = `
            <div class="flex items-center space-x-3">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} text-xl"></i>
                <span class="font-medium">${message}</span>
                <button class="ml-auto text-current hover:opacity-70" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(full)';
            setTimeout(() => notification.remove(), 500);
        }, 5000);
    }

    // Enhanced interaction effects for glass elements
    setupGlassInteractions() {
        // Add subtle tilt effect to cards on mouse move
        document.querySelectorAll('.glass-card, .glass-card-floating').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
            });
        });
    }

    // Performance optimization for animations
    setupPerformanceOptimizations() {
        // Throttle scroll events
        let ticking = false;
        
        const throttledScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateScrollAnimations();
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', throttledScroll, { passive: true });
    }

    updateScrollAnimations() {
        // Update any scroll-based animations efficiently
        const scrolled = window.pageYOffset;
        
        // Update parallax elements with transform3d for better performance
        document.querySelectorAll('.glass-card-floating').forEach((element, index) => {
            const speed = 0.1 + (index * 0.05);
            const yPos = -(scrolled * speed);
            element.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
    }
}

// Enhanced loading experience
class LoadingManager {
    constructor() {
        this.setupLoadingAnimation();
    }

    setupLoadingAnimation() {
        // Create glass loading overlay
        const loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.className = `
            fixed inset-0 z-50 flex items-center justify-center
            bg-gradient-to-br from-warm-100 via-desert-50 to-warm-200
            backdrop-blur-lg transition-opacity duration-1000
        `;
        
        loadingOverlay.innerHTML = `
            <div class="glass-card p-8 rounded-3xl text-center">
                <div class="w-16 h-16 border-4 border-warm-300 border-t-warm-600 rounded-full animate-spin mx-auto mb-4"></div>
                <div class="text-warm-800 font-medium">Loading Portfolio...</div>
            </div>
        `;
        
        document.body.appendChild(loadingOverlay);
        
        // Remove loading overlay when page is loaded
        window.addEventListener('load', () => {
            setTimeout(() => {
                loadingOverlay.style.opacity = '0';
                setTimeout(() => loadingOverlay.remove(), 1000);
            }, 500);
        });
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize loading manager
    new LoadingManager();
    
    // Initialize portfolio manager
    const portfolio = new PortfolioManager();
    
    // Setup enhanced interactions after initial load
    setTimeout(() => {
        portfolio.setupGlassInteractions();
        portfolio.setupPerformanceOptimizations();
    }, 1000);
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log(`Page load time: ${perfData.loadEventEnd - perfData.loadEventStart}ms`);
    });
}

// Enhanced error handling for production
window.addEventListener('error', (e) => {
    console.warn('Non-critical error handled:', e.message);
});