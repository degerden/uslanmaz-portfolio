// ==========================================================
// YENİ VERİ YÜKLEME VE DİL MOTORU
// ==========================================================

let siteVerisi = {}; // Tüm veriyi tutacak global obje
let currentLanguage = 'tr'; // Varsayılan dil

// 1. Sayfa yüklendiğinde JSON verisini çek
document.addEventListener('DOMContentLoaded', () => {
    fetch('cc42.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('cc42.json dosyası yüklenemedi: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            siteVerisi = data; // Veriyi global objeye ata
            // Veri yüklendikten sonra varsayılan dili uygula
            applyLanguage(currentLanguage);
            // Preloader'ı veri yüklendikten sonra gizle
            setTimeout(() => {
                document.getElementById('preloader').classList.add('hidden');
            }, 500); // 500ms'lik küçük bir gecikme
        })
        .catch(error => {
            console.error('Veri yükleme hatası:', error);
            document.body.innerHTML = '<h1 style="color:white; text-align:center; margin-top:50px;">Portfolyo yüklenemedi. cc42.json dosyasını kontrol edin.</h1>';
        });

    // Orijinal dil değiştirici butonları
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            langButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            applyLanguage(btn.dataset.lang);
        });
    });
});

// 2. GÜNCELLENMİŞ applyLanguage fonksiyonu
function applyLanguage(lang) {
    currentLanguage = lang; // O anki dili güncelle
    document.documentElement.lang = lang;

    // Veri objesinin var olup olmadığını kontrol et
    if (!siteVerisi.profil) {
        console.warn('Veri henüz yüklenmedi veya hatalı.');
        return;
    }

    // --- Basit Metin Alanlarını Doldur ---
    document.getElementById('profil-isim').textContent = siteVerisi.profil[lang].isim;
    document.getElementById('profil-unvan').textContent = siteVerisi.profil[lang].unvan;
    document.getElementById('profil-bio').textContent = siteVerisi.profil[lang].bio;

    document.getElementById('nav-hakkimda').textContent = siteVerisi.nav[lang].hakkimda;
    document.getElementById('nav-beceriler').textContent = siteVerisi.nav[lang].beceriler;
    document.getElementById('nav-projeler').textContent = siteVerisi.nav[lang].projeler;
    document.getElementById('nav-blog').textContent = siteVerisi.nav[lang].blog;
    document.getElementById('nav-iletisim').textContent = siteVerisi.nav[lang].iletisim;

    document.getElementById('hakkimda-baslik').textContent = siteVerisi.hakkimda[lang].baslik;
    document.getElementById('hakkimda-icerik').textContent = siteVerisi.hakkimda[lang].icerik;

    document.getElementById('beceriler-baslik').textContent = siteVerisi.beceriler[lang].baslik;
    document.getElementById('projeler-baslik').textContent = siteVerisi.projeler[lang].baslik;
    document.getElementById('blog-baslik').textContent = siteVerisi.blog[lang].baslik;
    
    document.getElementById('iletisim-baslik').textContent = siteVerisi.iletisim[lang].baslik;
    document.getElementById('iletisim-eposta-dugme').textContent = siteVerisi.iletisim[lang].epostaDugme;

    document.getElementById('footer-copyright').innerHTML = siteVerisi.footer[lang].copyright;

    // --- Dinamik Listeleri Oluştur ---
    renderBeceriler(lang);
    renderProjeler(lang);
    renderBlog(lang);

    // --- Typing Animasyonunu Yeniden Başlat (Orijinal kodunuzdan) ---
    const typingElement = document.querySelector('.typing-text');
    if (typingElement) {
        const newText = siteVerisi.profil[lang].isim; // Veriyi JSON'dan al
        typingElement.textContent = '';
        let i = 0;
        function retypeText() {
            if (i < newText.length) {
                typingElement.textContent += newText.charAt(i);
                i++;
                setTimeout(retypeText, 100);
            }
        }
        retypeText();
    }
    
    // 3D tilt efektini yeniden uygula (yeni eklenen elemanlar için)
    init3DTiltEffect();
}

// 3. Yeni Liste Oluşturucu Fonksiyonlar
function renderBeceriler(lang) {
    const container = document.querySelector('.skills');
    container.innerHTML = ''; // İçeriği temizle
    siteVerisi.beceriler.liste.forEach((item, index) => {
        const card = document.createElement('div');
        // Orijinal scroll animasyon class'larını dinamik ekle
        const animClass = index % 3 === 0 ? 'scroll-reveal-left' : (index % 3 === 1 ? 'scroll-reveal' : 'scroll-reveal-right');
        card.className = `skill-card ${animClass}`;
        
        card.innerHTML = `
            <h3>${item[lang].ad}</h3>
            <p>${item[lang].seviye}</p>
        `;
        container.appendChild(card);
    });
}

function renderProjeler(lang) {
    const container = document.querySelector('.projects');
    container.innerHTML = ''; // İçeriği temizle
    siteVerisi.projeler.liste.forEach((item, index) => {
        const card = document.createElement('div');
        const animClass = index % 3 === 0 ? 'scroll-reveal-left' : (index % 3 === 1 ? 'scroll-reveal' : 'scroll-reveal-right');
        card.className = `project-card ${animClass}`;
        
        card.innerHTML = `
            <div class="project-header">
                <h3>${item[lang].ad}</h3>
            </div>
            <div class="project-body">
                <p>${item[lang].aciklama}</p>
            </div>
        `;
        container.appendChild(card);
    });
}

function renderBlog(lang) {
    const container = document.querySelector('.blog-grid');
    container.innerHTML = ''; // İçeriği temizle
    siteVerisi.blog.liste.forEach((item, index) => {
        const card = document.createElement('div');
        const animClass = index % 3 === 0 ? 'scroll-reveal-left' : (index % 3 === 1 ? 'scroll-reveal' : 'scroll-reveal-right');
        card.className = `blog-card ${animClass}`;
        card.setAttribute('data-blog-id', item.id); // Modal için ID
        
        card.innerHTML = `
            <div class="blog-image">📝</div>
            <div class="blog-content">
                <div class="blog-date">${item.tarih}</div>
                <h3 class="blog-title">${item[lang].baslik}</h3>
                <p class="blog-excerpt">${item[lang].ozet}</p>
                <a href="#" class="blog-read-more">${siteVerisi.blog[lang].devami}</a>
            </div>
        `;
        container.appendChild(card);
    });
    
    // Blog kartlarına tıklandığında modal'ı açan event listener'ları yeniden bağla
    initBlogModalListeners();
}


// ==========================================================
// ORİJİNAL JAVASCRIPT KODLARINIZ (Değişiklik yok veya minimum)
// ==========================================================

// Preloader (Sadece gizleme kısmı, yükleme kısmı 'fetch' içine taşındı)
// (Orijinal 'window.addEventListener('load', ...)' bloğu 
// 'fetch' içine taşındığı için buradan kaldırıldı)

// Particles Animation
(function animateParticles() {
    const canvas = document.getElementById('particles');
    // Canvas yoksa (hata durumunda) fonksiyonu durdur
    if (!canvas) return; 
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles = [];
    const particleCount = 80;
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - .5) * .5;
            this.vy = (Math.random() - .5) * .5;
            this.radius = Math.random() * 2 + 1;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(139,92,246,0.4)';
            ctx.fill();
        }
    }
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        particles.forEach((p1, i) => {
            particles.slice(i + 1).forEach(p2 => {
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(139,92,246,${0.2 * (1 - dist / 100)})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            });
        });
        requestAnimationFrame(animate);
    }
    animate();
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
})();

// Mouse Glow Effect
(function initMouseGlow() {
    const mouseGlow = document.querySelector('.mouse-glow');
    if (!mouseGlow) return;
    document.addEventListener('mousemove', e => {
        mouseGlow.style.left = e.clientX + 'px';
        mouseGlow.style.top = e.clientY + 'px';
    });
})();

// Scroll Animations
(function initScrollAnimations() {
    const observerOptions = { threshold: .1, rootMargin: '0px 0px -100px 0px' };
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);
    // Not: Bu artık sadece statik elemanları (bölüm başlıkları) izleyecek.
    // Dinamik eklenen kartlar (beceri, proje) zaten class'larını alıyor.
    document.querySelectorAll('.scroll-reveal,.scroll-reveal-left,.scroll-reveal-right').forEach(el => {
        observer.observe(el);
    });
})();

// Scroll to Top Button
(function initScrollTop() {
    const scrollTopBtn = document.getElementById('scrollTop');
    if (!scrollTopBtn) return;
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();

// Smooth Scroll for Navigation
(function initSmoothScroll() {
    document.querySelectorAll('nav a').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const targetId = a.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
})();

// --- GÜNCELLENMİŞ Blog Modal Logic ---
const blogModal = document.getElementById('blogModal');
const modalClose = document.getElementById('modalClose');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');

function showModal(title, content) {
    if (!blogModal) return;
    modalTitle.textContent = title;
    modalBody.textContent = content; // Düz metin olarak ayarla (güvenlik)
    blogModal.classList.add('visible');
    document.body.style.overflow = 'hidden'; // Scroll'u kilitle
}

function hideModal() {
    if (!blogModal) return;
    blogModal.classList.remove('visible');
    document.body.style.overflow = ''; // Scroll'u aç
}

// Bu fonksiyon renderBlog() tarafından çağrılır
function initBlogModalListeners() {
    document.querySelectorAll('.blog-read-more').forEach(btn => {
        // Eski listener'ları temizle (opsiyonel ama iyi bir pratik)
        btn.replaceWith(btn.cloneNode(true));
    });
    
    // Yeni klonlanmış butonlara listener ekle
    document.querySelectorAll('.blog-read-more').forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            const card = e.target.closest('.blog-card');
            const blogId = card.getAttribute('data-blog-id');
            
            // Veriyi 'siteVerisi' objesinden al (eski 'blogData' yerine)
            if (siteVerisi.blogDetaylari && siteVerisi.blogDetaylari[blogId]) {
                const blog = siteVerisi.blogDetaylari[blogId][currentLanguage];
                showModal(blog.title, blog.content);
            } else {
                console.error('Blog detayı bulunamadı:', blogId);
            }
        });
    });
}

// Modal kapatma butonları (Bunlar statik olduğu için en başta bir kez tanımlanabilir)
if(modalClose) modalClose.addEventListener('click', hideModal);
if(blogModal) blogModal.addEventListener('click', e => {
    if (e.target === blogModal) {
        hideModal();
    }
});
document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && blogModal && blogModal.classList.contains('visible')) {
        hideModal();
    }
});

// --- GÜNCELLENMİŞ 3D Tilt Effect ---
// Bu fonksiyon dinamik elemanlar eklendikten sonra (applyLanguage içinde) çağrılmalı
function init3DTiltEffect() {
    document.querySelectorAll('.skill-card, .project-card, .blog-card').forEach(card => {
        // Eski listener'ları temizle
        const newCard = card.cloneNode(true);
        card.parentNode.replaceChild(newCard, card);

        // Yeniden listener ekle
        newCard.addEventListener('mousemove', e => {
            const rect = newCard.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            newCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });
        newCard.addEventListener('mouseleave', () => {
            newCard.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}