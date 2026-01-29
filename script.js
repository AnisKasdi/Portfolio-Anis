/* ============================================================
   PORTFOLIO SCRIPT
   - Navigation & active links
   - Mobile menu
   - Smooth scroll
   - Projects filtering (index + projects.html)
   - Contact form + toast
   - Scroll / hover / tilt animations
   - Extra features (scroll to top, page transitions, etc.)
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
    /* ---------------------------------------------------------
       0. DOM SHORTCUTS & GLOBAL FLAGS
       --------------------------------------------------------- */
    const navbar = document.getElementById("navbar");
    const navLinks = document.querySelectorAll(".nav-link");
    const menuToggle = document.getElementById("menuToggle");
    const navLinksContainer = document.querySelector(".nav-links");
    const heroSection = document.querySelector(".hero");
    const heroImage = document.querySelector(".hero-image");
    const heroSubtitle = document.querySelector(".hero-subtitle");
    const contactForm = document.getElementById("contactForm");
    const toast = document.getElementById("toast");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-card");
    const statNumbers = document.querySelectorAll(".stat-number");
    const techItems = document.querySelectorAll(".tech-item");
    const testimonialCards = document.querySelectorAll(".testimonial-card");
    const serviceCards = document.querySelectorAll(".service-card");
    const sectionHeaders = document.querySelectorAll(".section-header");
    const tabButtons = document.querySelectorAll(".tab-btn");
    const tabPanes = document.querySelectorAll(".tab-pane");
    const lazyImages = document.querySelectorAll("img[data-src]");
    const formInputs = document.querySelectorAll(".form-group input, .form-group textarea");
    const buttons = document.querySelectorAll(".btn");
    const pagePath = window.location.pathname;

    // Mode performance pour devices faibles ou motion réduit
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isLowPowerDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
    const PERFORMANCE_MODE = prefersReducedMotion || isLowPowerDevice;

    /* ---------------------------------------------------------
       1. NAVIGATION SCROLL EFFECT + ACTIVE LINK
       --------------------------------------------------------- */

    // Ajoute / retire la classe .scrolled au nav
    const handleNavbarScroll = (scrollY) => {
        if (!navbar) return;
        if (scrollY > 100) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    };

    // Met à jour le lien actif en fonction de la section visible (index uniquement)
    const updateActiveNavLinkOnScroll = (scrollY) => {
        const sections = document.querySelectorAll("section[id]");
        if (!sections.length) return;

        sections.forEach((section) => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 120;
            const sectionId = section.getAttribute("id");
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach((link) => {
                    if (link.getAttribute("href").startsWith("#")) {
                        link.classList.remove("active");
                    }
                });
                if (navLink) navLink.classList.add("active");
            }
        });
    };

    // Met en surbrillance le lien correspondant à la page actuelle (index / projects)
    const highlightCurrentPageLink = () => {
        navLinks.forEach((link) => {
            const href = link.getAttribute("href");
            if (!href) return;

            const isHashLink = href.startsWith("#");
            const isSamePage =
                (!isHashLink && pagePath.endsWith(href)) ||
                (!isHashLink && pagePath.includes(href));

            if (isSamePage) {
                link.classList.add("active");
            }
        });
    };
    highlightCurrentPageLink();

    /* ---------------------------------------------------------
       2. MOBILE MENU
       --------------------------------------------------------- */
    if (menuToggle && navLinksContainer) {
        const toggleMenu = () => {
            menuToggle.classList.toggle("active");
            navLinksContainer.classList.toggle("active");

            // lock / unlock scroll du body en mobile
            if (navLinksContainer.classList.contains("active")) {
                document.body.style.overflow = "hidden";
            } else {
                document.body.style.overflow = "";
            }
        };

        menuToggle.addEventListener("click", toggleMenu);

        // Ferme le menu au clic sur un lien
        navLinks.forEach((link) => {
            link.addEventListener("click", () => {
                menuToggle.classList.remove("active");
                navLinksContainer.classList.remove("active");
                document.body.style.overflow = "";
            });
        });

        // Ferme le menu si on clique en dehors
        document.addEventListener("click", (e) => {
            if (!e.target.closest("nav") && navLinksContainer.classList.contains("active")) {
                menuToggle.classList.remove("active");
                navLinksContainer.classList.remove("active");
                document.body.style.overflow = "";
            }
        });
    }

    /* ---------------------------------------------------------
       3. SMOOTH SCROLL POUR LES ANCRES
       --------------------------------------------------------- */
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", (e) => {
            const href = anchor.getAttribute("href");
            if (!href || href === "#") return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: "smooth",
            });
        });
    });

    /* ---------------------------------------------------------
       4. PAGE TRANSITION (entre index.html et projects.html)
       --------------------------------------------------------- */
    // Ajoute une légère transition fade-in/out lors des changements de page
    // Always apply .loaded after load (failsafe)
window.addEventListener("load", () => {
    document.body.classList.add("loaded");
});

    document.querySelectorAll('a[href$=".html"]').forEach((link) => {
        const target = link.getAttribute("href");
        if (!target || link.target === "_blank") return;

        link.addEventListener("click", (e) => {
            // évite de casser les ancres interne type index.html#about
            const isSamePageAnchor =
                target.includes("#") && pagePath.endsWith(target.split("#")[0] || "index.html");
            if (isSamePageAnchor) return;

            e.preventDefault();
            document.body.classList.add("page-transition-out");
            setTimeout(() => {
                window.location.href = target;
            }, 220);
        });
    });

    /* ---------------------------------------------------------
       5. TABS (Experience / Education si présents)
       --------------------------------------------------------- */
    if (tabButtons.length && tabPanes.length) {
        tabButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const targetTab = button.getAttribute("data-tab");
                if (!targetTab) return;

                tabButtons.forEach((btn) => btn.classList.remove("active"));
                tabPanes.forEach((pane) => pane.classList.remove("active"));

                button.classList.add("active");
                const targetPane = document.getElementById(targetTab);
                if (targetPane) targetPane.classList.add("active");
            });
        });
    }

    /* ---------------------------------------------------------
       6. PROJECTS FILTER (INDEX + PROJECTS PAGE)
       --------------------------------------------------------- */
    if (filterButtons.length && projectCards.length) {
        const filterProjects = (filter) => {
            projectCards.forEach((card) => {
                const category = card.getAttribute("data-category");
                if (!category) return;

                if (filter === "all" || category === filter) {
                    card.style.pointerEvents = "auto";
                    card.classList.remove("filtered-out");
                } else {
                    card.style.pointerEvents = "none";
                    card.classList.add("filtered-out");
                }
            });
        };

        filterButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const filter = button.getAttribute("data-filter") || "all";

                filterButtons.forEach((btn) => btn.classList.remove("active"));
                button.classList.add("active");

                filterProjects(filter);
            });

            // Option bonus pro : highlight au survol
            button.addEventListener("mouseenter", () => {
                const filter = button.getAttribute("data-filter");
                if (!filter || filter === "all") return;

                projectCards.forEach((card) => {
                    const category = card.getAttribute("data-category");
                    if (category === filter) {
                        card.classList.add("highlight-category");
                    }
                });
            });

            button.addEventListener("mouseleave", () => {
                projectCards.forEach((card) => card.classList.remove("highlight-category"));
            });
        });
    }

    /* ---------------------------------------------------------
       7. TOAST NOTIFICATION (réutilisable)
       --------------------------------------------------------- */
    const showToast = (message, type = "success") => {
        if (!toast) return;

        const toastIcon = toast.querySelector("i");
        const toastText = toast.querySelector("span");

        if (toastText) toastText.textContent = message;

        if (toastIcon) {
            if (type === "error") {
                toastIcon.className = "fas fa-exclamation-circle";
                toast.style.background = "rgba(239, 68, 68, 0.95)";
            } else {
                toastIcon.className = "fas fa-check-circle";
                toast.style.background = "rgba(20, 184, 166, 0.95)";
            }
        }

        toast.classList.add("show");

        setTimeout(() => {
            toast.classList.remove("show");
        }, 3200);
    };

    /* ---------------------------------------------------------
       8. CONTACT FORM (Formspree)
       --------------------------------------------------------- */
    if (contactForm) {
        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const formData = new FormData(contactForm);

            try {
                const response = await fetch(contactForm.action, {
                    method: "POST",
                    body: formData,
                    headers: { Accept: "application/json" },
                });

                if (response.ok) {
                    showToast("Message sent successfully! I'll get back to you soon.", "success");
                    contactForm.reset();
                } else {
                    showToast("Error sending message. Please try again.", "error");
                }
            } catch (error) {
                showToast("Error sending message. Please try again.", "error");
            }
        });
    }

    /* ---------------------------------------------------------
       9. INTERSECTION OBSERVERS (ANIMATIONS ON SCROLL)
       --------------------------------------------------------- */
    if (!PERFORMANCE_MODE) {
        // Cartes / items qui apparaissent avec un slide-up
        const animateElements = document.querySelectorAll(
            ".service-card, .project-card, .timeline-item, .skill-item-cyber, .testimonial-card, .github-stat-card, .cyber-card"
        );

        const elementObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = "1";
                        entry.target.style.transform = "translateY(0)";
                        elementObserver.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.2,
                rootMargin: "0px 0px -80px 0px",
            }
        );

        animateElements.forEach((el) => {
            el.style.opacity = "0";
            el.style.transform = "translateY(30px)";
            el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
            elementObserver.observe(el);
        });

        // Headers de sections
        const headerObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = "1";
                        entry.target.style.transform = "translateY(0)";
                        headerObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.2 }
        );

        sectionHeaders.forEach((header) => {
            header.style.opacity = "0";
            header.style.transform = "translateY(20px)";
            header.style.transition = "opacity 0.8s ease, transform 0.8s ease";
            headerObserver.observe(header);
        });
    }

    /* ---------------------------------------------------------
       10. LAZY LOADING IMAGES (si data-src présent)
       --------------------------------------------------------- */
    if ("IntersectionObserver" in window && lazyImages.length) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute("data-src");
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach((img) => imageObserver.observe(img));
    }

    /* ---------------------------------------------------------
       11. HERO PARALLAX & TYPING EFFECT (INDEX UNIQUEMENT)
       --------------------------------------------------------- */
    let hasTyped = false;

    const startTypingEffect = () => {
        if (!heroSubtitle || hasTyped) return;
        const text = heroSubtitle.textContent;
        heroSubtitle.textContent = "";
        let i = 0;

        const typeWriter = () => {
            if (i < text.length) {
                heroSubtitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 45);
            }
        };

        setTimeout(typeWriter, 600);
        hasTyped = true;
    };

    if (heroSubtitle && heroSection) {
        startTypingEffect();
    }

    /* ---------------------------------------------------------
       12. HOVER EFFECTS (TECH, TESTIMONIAL, SERVICES)
       --------------------------------------------------------- */
    techItems.forEach((item) => {
        item.addEventListener("mouseenter", function () {
            this.style.transform = "translateY(-10px) scale(1.05)";
        });

        item.addEventListener("mouseleave", function () {
            this.style.transform = "translateY(0) scale(1)";
        });
    });

    testimonialCards.forEach((card) => {
        card.addEventListener("mouseenter", function () {
            this.style.transform = "translateY(-5px) scale(1.02)";
        });

        card.addEventListener("mouseleave", function () {
            this.style.transform = "translateY(0) scale(1)";
        });
    });

    serviceCards.forEach((card) => {
        card.addEventListener("mouseenter", function () {
            const icon = this.querySelector(".service-icon");
            if (icon) icon.style.transform = "scale(1.1) rotate(5deg)";
        });

        card.addEventListener("mouseleave", function () {
            const icon = this.querySelector(".service-icon");
            if (icon) icon.style.transform = "scale(1) rotate(0deg)";
        });
    });

    /* ---------------------------------------------------------
       13. 3D TILT EFFECT SUR LES PROJECT CARDS
       --------------------------------------------------------- */
    if (!PERFORMANCE_MODE && projectCards.length) {
        projectCards.forEach((card) => {
            let tiltTimeout;

            card.addEventListener("mousemove", (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * 8; // max ~8deg
                const rotateY = ((centerX - x) / centerX) * 8;

                if (tiltTimeout) cancelAnimationFrame(tiltTimeout);
                tiltTimeout = requestAnimationFrame(() => {
                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
                });
            });

            card.addEventListener("mouseleave", () => {
                card.style.transform =
                    "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)";
            });
        });
    }

    /* ---------------------------------------------------------
       14. STAT NUMBERS ANIMATION
       --------------------------------------------------------- */
    if (statNumbers.length) {
        const statsObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const target = entry.target;
                        const originalText = target.textContent;
                        const number = parseInt(originalText.replace(/\D/g, ""), 10);

                        if (!isNaN(number) && number > 0) {
                            animateNumber(target, number, originalText);
                        }
                        statsObserver.unobserve(target);
                    }
                });
            },
            { threshold: 0.5 }
        );

        statNumbers.forEach((stat) => statsObserver.observe(stat));

        function animateNumber(element, target, originalText) {
            const duration = 1800;
            const step = target / (duration / 16);
            let current = 0;

            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    element.textContent = originalText;
                    clearInterval(timer);
                } else {
                    const suffix = originalText.replace(/[\d\s]/g, "");
                    element.textContent = Math.floor(current) + suffix;
                }
            }, 16);
        }
    }

    /* ---------------------------------------------------------
       15. FORM INPUT FOCUS STYLES
       --------------------------------------------------------- */
    formInputs.forEach((input) => {
        input.addEventListener("focus", function () {
            this.parentElement.classList.add("focused");
        });

        input.addEventListener("blur", function () {
            if (this.value === "") {
                this.parentElement.classList.remove("focused");
            }
        });
    });

    /* ---------------------------------------------------------
       16. RIPPLE EFFECT SUR LES BOUTONS
       --------------------------------------------------------- */
    buttons.forEach((button) => {
        button.style.position = "relative";
        button.style.overflow = "hidden";

        button.addEventListener("click", function (e) {
            const ripple = document.createElement("span");
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            ripple.classList.add("ripple");

            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });

    /* ---------------------------------------------------------
       17. SCROLL TO TOP BUTTON (créé en JS)
       --------------------------------------------------------- */
    const createScrollTopButton = () => {
        const btn = document.createElement("button");
        btn.className = "scroll-top-btn";
        btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        document.body.appendChild(btn);

        btn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });

        return btn;
    };
    const scrollTopBtn = createScrollTopButton();

    /* ---------------------------------------------------------
       18. GLOBAL SCROLL HANDLER (UN SEUL LISTENER)
       --------------------------------------------------------- */
    let lastScrollY = window.scrollY;

    const onScroll = () => {
        const scrollY = window.scrollY;
        handleNavbarScroll(scrollY);
        updateActiveNavLinkOnScroll(scrollY);

        // Parallax hero image uniquement sur index
        if (!PERFORMANCE_MODE && heroImage && heroSection) {
            if (scrollY < window.innerHeight) {
                heroImage.style.transform = `translateY(${scrollY * 0.3}px)`;
            }
        }

        // Affichage du scroll-to-top
        if (scrollTopBtn) {
            if (scrollY > 400) {
                scrollTopBtn.classList.add("visible");
            } else {
                scrollTopBtn.classList.remove("visible");
            }
        }

        lastScrollY = scrollY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // appel initial

    /* ---------------------------------------------------------
       19. CONSOLE EASTER EGGS
       --------------------------------------------------------- */
    console.log("%c👋 Hello there!", "font-size: 20px; font-weight: bold; color: #6366f1;");
    console.log(
        "%c🚀 Interested in my code? Check out my GitHub!",
        "font-size: 14px; color: #14b8a6;"
    );
    console.log("%c🔗 https://github.com/AnisKasdi", "font-size: 12px; color: #64748b;");
});
setTimeout(() => {
    document.body.classList.add("loaded");
}, 300);
