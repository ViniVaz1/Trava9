/* =========================================================
   TRAVA9 — Loja de Chuteiras
   Interações: menu mobile, reveal on scroll, filtro de
   catálogo, botão de compra via WhatsApp, acordeão (FAQ)
   e validação do formulário de contato.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Menu mobile ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // fecha o menu ao clicar em um link (mobile)
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach((el) => observer.observe(el));
  }

  /* ---------- Filtro de catálogo (produtos.html) ---------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('#productGrid .card');
  const resultsCount = document.getElementById('resultsCount');
  const emptyState = document.getElementById('emptyState');

  function applyFilter(filter) {
    let visibleCount = 0;

    productCards.forEach((card) => {
      const matches = filter === 'todas' || card.dataset.category === filter;
      card.style.display = matches ? '' : 'none';
      if (matches) visibleCount++;
    });

    if (resultsCount) {
      resultsCount.textContent = `${visibleCount} produto${visibleCount === 1 ? '' : 's'} encontrado${visibleCount === 1 ? '' : 's'}`;
    }

    if (emptyState) {
      emptyState.classList.toggle('is-visible', visibleCount === 0);
    }
  }

  if (filterBtns.length && productCards.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        applyFilter(btn.dataset.filter);
      });
    });

    // links do rodapé que apontam para uma categoria (data-filter-link)
    document.querySelectorAll('[data-filter-link]').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.dataset.filterLink;
        const targetBtn = document.querySelector(`.filter-btn[data-filter="${target}"]`);
        if (targetBtn) {
          targetBtn.click();
          document.getElementById('productGrid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /* ---------- Botões "Comprar no WhatsApp" com número escolhido ---------- */
  const buyBtns = document.querySelectorAll('.js-buy-btn');
  buyBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const product = btn.dataset.product || 'produto';
      const card = btn.closest('.card');
      const select = card ? card.querySelector('select') : null;
      const size = select ? select.value : '';

      const message = size
        ? `Olá! Tenho interesse na chuteira ${product}, número ${size}.`
        : `Olá! Tenho interesse na chuteira ${product}.`;

      const url = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank', 'noopener');
    });
  });

  /* ---------- Acordeão (FAQ / sobre.html) ---------- */
  document.querySelectorAll('.accordion-item').forEach((item) => {
    const trigger = item.querySelector('.accordion-trigger');
    const panel = item.querySelector('.accordion-panel');
    if (!trigger || !panel) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // fecha os outros itens do mesmo acordeão
      item.parentElement.querySelectorAll('.accordion-item.is-open').forEach((openItem) => {
        if (openItem !== item) {
          openItem.classList.remove('is-open');
          const openPanel = openItem.querySelector('.accordion-panel');
          if (openPanel) openPanel.style.maxHeight = '0px';
        }
      });

      item.classList.toggle('is-open', !isOpen);
      panel.style.maxHeight = !isOpen ? `${panel.scrollHeight}px` : '0px';
    });
  });

  /* ---------- Formulário de contato (contato.html) ---------- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const formStatus = contactForm.querySelector('.form-status') || document.getElementById('formStatus');

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let hasError = false;

      contactForm.querySelectorAll('[required]').forEach((field) => {
        const wrapper = field.closest('.form-field');
        const filled = field.value.trim() !== '';
        const validEmail = field.type !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());

        if (!filled || !validEmail) {
          wrapper?.classList.add('has-error');
          hasError = true;
        } else {
          wrapper?.classList.remove('has-error');
        }
      });

      if (formStatus) {
        formStatus.classList.remove('is-success', 'is-error');
        if (hasError) {
          formStatus.textContent = 'Verifique os campos destacados e tente novamente.';
          formStatus.classList.add('is-error');
        } else {
          formStatus.textContent = 'Mensagem enviada! Em breve entraremos em contato.';
          formStatus.classList.add('is-success');
          contactForm.reset();
        }
      }
    });
  }

});