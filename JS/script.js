// Efeito de entrada para o hero section
        document.addEventListener('DOMContentLoaded', function() {
            // Inicializar a animação de pontos
            initializeDotAnimation();
            
            // Inicializar o slider de depoimentos
            initializeSlider();
            
            // Inicializar os observadores de seção
            initializeSectionObservers();   
            
            // Inicializar navegação
            initializeNavigation();
        });

        // Animação de pontos interativa
        function initializeDotAnimation() {
            const canvas = document.getElementById('dotCanvas');
            const ctx = canvas.getContext('2d');

            const settings = {
                dotSize: 1,
                gap: 32,
                baseColor: '#2e2e2e',
                activeColor: '#00ff6a',
                proximity: 150,
                shockStrength: 5
            };

            const pointer = { x: 0, y: 0, active: false };
            let dots = [];

            function resizeCanvas() {
                canvas.width = window.innerWidth;
                canvas.height = document.querySelector('.hero').offsetHeight;
                createDots();
            }

            function createDots() {
                dots = [];
                const cols = Math.floor(canvas.width / settings.gap);
                const rows = Math.floor(canvas.height / settings.gap);
                for (let y = 0; y < rows; y++) {
                    for (let x = 0; x < cols; x++) {
                        dots.push({
                            x: x * settings.gap + settings.gap / 2,
                            y: y * settings.gap + settings.gap / 2,
                            offsetX: 0,
                            offsetY: 0
                        });
                    }
                }
            }

            function hexToRgb(hex) {
                const bigint = parseInt(hex.replace('#', ''), 16);
                return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
            }

            const lerp = (a, b, t) => a + (b - a) * t;

            function draw() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                const base = hexToRgb(settings.baseColor);
                const active = hexToRgb(settings.activeColor);

                dots.forEach(dot => {
                    const dx = pointer.x - dot.x;
                    const dy = pointer.y - dot.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    const t = Math.max(0, 1 - dist / settings.proximity);
                    const r = Math.round(lerp(base.r, active.r, t));
                    const g = Math.round(lerp(base.g, active.g, t));
                    const b = Math.round(lerp(base.b, active.b, t));
                    ctx.fillStyle = `rgb(${r},${g},${b})`;

                    if (pointer.active && dist < settings.proximity) {
                        const force = (1 - dist / settings.proximity) * settings.shockStrength * 0.05;
                        const angle = Math.atan2(dy, dx);
                        dot.offsetX -= Math.cos(angle) * force;
                        dot.offsetY -= Math.sin(angle) * force;
                    }

                    dot.offsetX *= 0.9;
                    dot.offsetY *= 0.9;

                    ctx.beginPath();
                    ctx.arc(dot.x + dot.offsetX, dot.y + dot.offsetY, settings.dotSize, 0, Math.PI * 2);
                    ctx.fill();
                });

                requestAnimationFrame(draw);
            }

            function handleMouseMove(e) {
                const rect = canvas.getBoundingClientRect();
                pointer.x = e.clientX - rect.left;
                pointer.y = e.clientY - rect.top;
                pointer.active = true;
            }

            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('resize', resizeCanvas);

            resizeCanvas();
            draw();
        }

        // Slider de depoimentos
        function initializeSlider() {
            const sliderContainer = document.querySelector('.depoimentos-container');
            const sliderDots = document.querySelectorAll('.slider-dot');
            
            let currentSlideIndex = 0;

            function updateSliderPosition() {
                sliderContainer.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
            }

            function updateActiveDot() {
                sliderDots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === currentSlideIndex);
                });
            }

            function goToSlide(slideIndex) {
                currentSlideIndex = slideIndex;
                updateSliderPosition();
                updateActiveDot();
            }

            function handleDotClick() {
                sliderDots.forEach((dot, index) => {
                    dot.addEventListener('click', () => goToSlide(index));
                });
            }

            function startAutoPlay() {
                setInterval(() => {
                    currentSlideIndex = (currentSlideIndex + 1) % sliderDots.length;
                    goToSlide(currentSlideIndex);
                }, 5000);
            }

            handleDotClick();
            startAutoPlay();
        }

        // Observadores de seção para animações de entrada
        function initializeSectionObservers() {
            const sections = document.querySelectorAll('section');
            
            const observerOptions = {
                root: null,
                rootMargin: '0px',
                threshold: 0.2
            };
            
            const sectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, observerOptions);
            
            sections.forEach(section => {
                sectionObserver.observe(section);
            });
            
            // Forçar a primeira seção a ser visível imediatamente
            document.querySelector('.hero').classList.add('visible');
        }

        // Navegação
        function initializeNavigation() {
            const navigationItems = document.querySelectorAll('.magic-navigation .list');

            function getCurrentSection() {
                const sections = document.querySelectorAll('section');
                let currentSectionId = '';

                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.clientHeight;
                    
                    if (window.scrollY >= (sectionTop - sectionHeight / 3)) {
                        currentSectionId = section.getAttribute('id');
                    }
                });

                return currentSectionId;
            }

            function updateNavigationOnScroll() {
                const currentSection = getCurrentSection();
                
                navigationItems.forEach(item => {
                    item.classList.toggle('active', item.dataset.section === currentSection);
                });
            }

            function smoothScrollToSection(event) {
                event.preventDefault();
                const targetId = this.querySelector('a').getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                window.scrollTo({
                    top: targetSection.offsetTop,
                    behavior: 'smooth'
                });
            }

            window.addEventListener('scroll', updateNavigationOnScroll);
            
            navigationItems.forEach(item => {
                item.addEventListener('click', smoothScrollToSection);
            });
        }
        
        // Efeito tilt + glow dinâmico
document.querySelectorAll('.passo-horizontal').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    card.style.setProperty('--glow-x', `${(x / rect.width) * 100}%`);
    card.style.setProperty('--glow-y', `${(y / rect.height) * 100}%`);
    card.style.setProperty('--glow-intensity', '1');
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'translateY(0)';
    card.style.setProperty('--glow-intensity', '0');
  });
});
 
// Forçar scroll para o topo ao carregar/recarregar a página
window.onload = function() {
    // Rolagem imediata para o topo
    window.scrollTo(0, 0);
    
    // Garantir que navegação esteja ativa na home
    updateNavigationOnScroll();
};

// Adicional: Também forçar ao voltar da cache (pageshow)
window.addEventListener('pageshow', function(event) {
    // Se a página foi carregada do cache
    if (event.persisted) {
        window.scrollTo(0, 0);
        updateNavigationOnScroll();
    }
});
 