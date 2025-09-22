
(function () {
    const container = document.querySelector('.scroll-container') || window;
    const navButtons = Array.from(document.querySelectorAll('.nav-btn'));
    const sections = Array.from(document.querySelectorAll('main .section'));
    let activeIndex = -1;
    let ticking = false;

    // Detectar el botón
    const themeToggle = document.getElementById("theme-toggle");
    const themeIcon = document.getElementById("theme-icon");

    themeToggle.addEventListener("click", () => {
        // Alternar la clase "dark" en <html>
        document.documentElement.classList.toggle("dark");

        // Cambiar icono (opcional)
        if (document.documentElement.classList.contains("dark")) {
            themeIcon.textContent = "🌙"; // modo oscuro
            themeToggle.setAttribute("aria-pressed", "true");
        } else {
            themeIcon.textContent = "☀️"; // modo claro
            themeToggle.setAttribute("aria-pressed", "false");
        }
    });

    // -- Helpers --
    function setNavActive(index) {
        if (index === activeIndex) return;
        activeIndex = index;
        navButtons.forEach((btn, i) => {
            if (i === index) {
                btn.classList.add('nav-active');
                btn.setAttribute('aria-current', 'page');
            } else {
                btn.classList.remove('nav-active');
                btn.removeAttribute('aria-current');
            }
        });
    }

    function setSectionVisible(index) {
        sections.forEach((s, i) => {
            if (i === index) s.classList.add('visible');
            else s.classList.remove('visible');
        });
    }

    // Calcula qué sección está más centrada en la ventana (estabilidad mayor que thresholds)
    function updateActiveOnScroll() {
        const viewportCenter = window.innerHeight / 2;
        let bestIndex = 0;
        let bestDistance = Infinity;

        sections.forEach((s, i) => {
            const rect = s.getBoundingClientRect();
            const sectionCenter = rect.top + rect.height / 2;
            const dist = Math.abs(sectionCenter - viewportCenter);
            if (dist < bestDistance) {
                bestDistance = dist;
                bestIndex = i;
            }
        });

        setNavActive(bestIndex);
        setSectionVisible(bestIndex);
        // si la sección activa desborda, desactiva snap para permitir scroll interno
        adjustSnapForActive(bestIndex);
    }

    // Navegación por botones (usa scrollIntoView; CSS scroll-margin-top compensa header)
    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = Number(btn.dataset.index);
            if (!Number.isNaN(idx) && sections[idx]) {
                sections[idx].scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Evita que el botón quede "focus" después del click (quita apariencia pulsada)
                // uso un pequeño timeout para no interferir con accesibilidad inmediata del click
                setTimeout(() => btn.blur(), 50);
            }
        });
    });

    // Helper: desenfocar cualquier botón de navegación si el usuario hace scroll manual
    function blurNavFocusIfNeeded() {
        const active = document.activeElement;
        if (!active) return;
        if (active.classList && (active.classList.contains('nav-btn') || active.classList.contains('nav-btn--link'))) {
            active.blur();
        }
    }

    // Throttle con rAF
    function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            updateActiveOnScroll();
            // Si el usuario está desplazando, quitar focus del botón para evitar apariencia "pulsada"
            blurNavFocusIfNeeded();
            ticking = false;
        });
    }

    // Ajuste snap: si la sección activa es más alta que el viewport disponible, desactivar snap
    function getHeaderHeight() {
        const rootVar = getComputedStyle(document.documentElement).getPropertyValue('--header-height') || '';
        const num = Number(rootVar.replace('px', '').trim());
        if (!Number.isNaN(num) && num > 0) return num;
        const hdr = document.querySelector('header');
        return hdr ? hdr.offsetHeight : 64;
    }
    function adjustSnapForActive(index) {
        const containerEl = document.querySelector('.scroll-container');
        if (!containerEl) return;
        const active = sections[index];
        if (!active) return;
        const headerH = getHeaderHeight();
        const available = window.innerHeight - headerH - 12;
        const overflows = active.scrollHeight > (available + 1);
        if (overflows) containerEl.classList.add('no-snap');
        else containerEl.classList.remove('no-snap');
    }

    // Navegación por botones (usa scrollIntoView; CSS scroll-margin-top compensa header)
    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = Number(btn.dataset.index);
            if (!Number.isNaN(idx) && sections[idx]) {
                sections[idx].scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Evita que el botón quede "focus" después del click (quita apariencia pulsada)
                // uso un pequeño timeout para no interferir con accesibilidad inmediata del click
                setTimeout(() => btn.blur(), 50);
            }
        });
    });

    // Helper: desenfocar cualquier botón de navegación si el usuario hace scroll manual
    function blurNavFocusIfNeeded() {
        const active = document.activeElement;
        if (!active) return;
        if (active.classList && (active.classList.contains('nav-btn') || active.classList.contains('nav-btn--link'))) {
            active.blur();
        }
    }

    // Throttle con rAF
    function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            updateActiveOnScroll();
            // Si el usuario está desplazando, quitar focus del botón para evitar apariencia "pulsada"
            blurNavFocusIfNeeded();
            ticking = false;
        });
    }

    // Ajuste snap: si la sección activa es más alta que el viewport disponible, desactivar snap
    function getHeaderHeight() {
        const rootVar = getComputedStyle(document.documentElement).getPropertyValue('--header-height') || '';
        const num = Number(rootVar.replace('px', '').trim());
        if (!Number.isNaN(num) && num > 0) return num;
        const hdr = document.querySelector('header');
        return hdr ? hdr.offsetHeight : 64;
    }
    function adjustSnapForActive(index) {
        const containerEl = document.querySelector('.scroll-container');
        if (!containerEl) return;
        const active = sections[index];
        if (!active) return;
        const headerH = getHeaderHeight();
        const available = window.innerHeight - headerH - 12;
        const overflows = active.scrollHeight > (available + 1);
        if (overflows) containerEl.classList.add('no-snap');
        else containerEl.classList.remove('no-snap');
    }
    // Inicialización
    updateActiveOnScroll(); // estado inicial
    container.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => adjustSnapForActive(activeIndex));
})();
