const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Navigation */
const navToggle = document.querySelector('[data-nav-toggle]');
const navPanel = document.querySelector('[data-nav-panel]');

if (navToggle && navPanel) {
  const items = Array.from(navPanel.querySelectorAll('[data-nav-item]'));
  items.forEach((item, index) => {
    item.style.setProperty('--delay', `${Math.min(index * 60, 400)}ms`);
  });

  const setOpen = (open) => {
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    document.body.classList.toggle('nav-open', open);
    if (open) {
      navPanel.hidden = false;
      requestAnimationFrame(() => navPanel.classList.add('is-open'));
    } else {
      navPanel.classList.remove('is-open');
      const hide = () => {
        if (!navPanel.classList.contains('is-open')) navPanel.hidden = true;
      };
      if (reduceMotion) hide();
      else setTimeout(hide, 300);
    }
  };

  navToggle.addEventListener('click', () => {
    setOpen(navToggle.getAttribute('aria-expanded') !== 'true');
  });

  navPanel.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      navToggle.focus();
    }
  });

  window.matchMedia('(min-width: 901px)').addEventListener('change', (event) => {
    if (event.matches && navToggle.getAttribute('aria-expanded') === 'true') setOpen(false);
  });
}

/* Scroll reveals, once per element */
const reveals = document.querySelectorAll('.reveal');
if (reveals.length) {
  if (!('IntersectionObserver' in window) || reduceMotion) {
    reveals.forEach((element) => element.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.15 },
    );
    reveals.forEach((element) => observer.observe(element));
  }
}

/* Tagline: each word lights up as it crosses the trigger line */
const tagline = document.querySelector('[data-tagline]');
if (tagline) {
  const words = tagline.querySelectorAll('.word');
  if (!('IntersectionObserver' in window) || reduceMotion) {
    words.forEach((word) => word.classList.add('is-lit'));
  } else {
    const order = new Map(Array.from(words).map((word, index) => [word, index]));
    const wordObserver = new IntersectionObserver(
      (entries) => {
        entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => order.get(a.target) - order.get(b.target))
          .forEach((entry) => {
            const index = order.get(entry.target);
            entry.target.style.transitionDelay = `${Math.min(index * 45, 700)}ms`;
            entry.target.classList.add('is-lit');
            wordObserver.unobserve(entry.target);
          });
      },
      { rootMargin: '0px 0px -60% 0px', threshold: 0 },
    );
    words.forEach((word) => wordObserver.observe(word));
  }
}

/* Expand long document lists */
document.querySelectorAll('[data-expand]').forEach((button) => {
  button.addEventListener('click', () => {
    const target = document.getElementById(button.dataset.expand);
    if (!target) return;
    const hidden = target.querySelectorAll('[hidden]');
    hidden.forEach((item) => {
      item.hidden = false;
    });
    button.remove();
  });
});

/* Monitoring year switcher */
const monitor = document.querySelector('[data-monitor]');
if (monitor) {
  const data = JSON.parse(monitor.dataset.monitor);
  const buttons = Array.from(monitor.querySelectorAll('[data-year-index]'));
  const el = (name) => monitor.querySelector(`[data-monitor-${name}]`);

  const paint = (item) => {
    el('group').textContent = item.group;
    el('total').textContent = item.total;
    el('first').textContent = `${item.firstHalfTotal}%`;
    el('second').textContent = `${item.secondHalfTotal}%`;
    el('delta').textContent = `+${item.secondHalfTotal - item.firstHalfTotal} п.п.`;

    const rows = el('stats').querySelectorAll('[data-stat]');
    rows.forEach((row, index) => {
      const stat = item.stats[index];
      if (!stat) return;
      row.querySelector('[data-stat-label]').textContent = stat.label;
      row.querySelector('[data-stat-value]').textContent = `${stat.value}%`;
      row.querySelector('[data-stat-note]').textContent =
        `${stat.base}% → ${stat.value}% · +${stat.value - stat.base} п.п.`;
      row.querySelector('[data-stat-base]').style.width = `${stat.base}%`;
      const growth = row.querySelector('[data-stat-growth]');
      growth.style.left = `${stat.base}%`;
      growth.style.width = `${stat.value - stat.base}%`;
    });

    const link1 = el('link1');
    link1.href = item.href1;
    link1.querySelector('[data-monitor-title]').textContent = item.title1;
    link1.querySelector('[data-monitor-size]').textContent = item.size1;

    const link2 = el('link2');
    link2.href = item.href2;
    link2.querySelector('[data-monitor-title]').textContent = item.title2;
    link2.querySelector('[data-monitor-size]').textContent = item.size2;
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const index = Number(button.dataset.yearIndex);
      buttons.forEach((other) => other.setAttribute('aria-selected', String(other === button)));
      paint(data[index]);
    });
  });
}

/* Contact form: inline validation, then hand off to the mail relay */
const form = document.querySelector('[data-contact-form]');
if (form) {
  const status = form.querySelector('[data-form-status]');
  const email = form.querySelector('input[type="email"]');
  const name = form.querySelector('input[name="name"]');
  const message = form.querySelector('textarea[name="message"]');
  const topic = form.querySelector('select[name="topic"]');

  const showError = (field, text) => {
    const slot = field.closest('.field').querySelector('.field__error');
    field.setAttribute('aria-invalid', 'true');
    if (slot) slot.textContent = text;
  };

  const clearError = (field) => {
    const slot = field.closest('.field').querySelector('.field__error');
    field.removeAttribute('aria-invalid');
    if (slot) slot.textContent = '';
  };

  [name, email, message, topic].forEach((field) => {
    field.addEventListener('input', () => clearError(field));
  });

  form.addEventListener('submit', (event) => {
    let valid = true;

    if (!name.value.trim()) {
      showError(name, 'Укажите, как к вам обращаться.');
      valid = false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) {
      showError(email, 'Проверьте адрес: нужен формат name@example.com.');
      valid = false;
    }
    if (message.value.trim().length < 10) {
      showError(message, 'Добавьте хотя бы одно предложение, чтобы я поняла вопрос.');
      valid = false;
    }
    if (!topic.value) {
      showError(topic, 'Выберите тему, чтобы письмо попало в нужную папку.');
      valid = false;
    }

    if (!valid) {
      event.preventDefault();
      status.textContent = 'Проверьте выделенные поля.';
      status.dataset.state = 'error';
      form.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }

    status.textContent = 'Отправляю сообщение.';
    status.dataset.state = 'loading';
  });
}
