(() => {
  const toggle = document.querySelector('.theme-toggle');
  const updateThemeControl = () => {
    const dark = document.documentElement.dataset.theme === 'dark';
    toggle.setAttribute('aria-pressed', String(dark));
    toggle.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} theme`);
  };
  if (toggle) {
    toggle.hidden = false;
    updateThemeControl();
    toggle.addEventListener('click', () => {
      const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = theme;
      try { localStorage.setItem('ek-theme', theme); } catch { /* Theme still works for this visit. */ }
      updateThemeControl();
    });
  }
  const roleNavigation = document.querySelector('.role-tabs');
  const roleButtons = [...document.querySelectorAll('[data-role]')];
  const rolePanels = [...document.querySelectorAll('[data-panel]')];
  const selectRole = button => {
    roleButtons.forEach(tab => {
      const selected = tab === button;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    rolePanels.forEach(panel => { panel.hidden = panel.dataset.panel !== button.dataset.role; });
  };
  if (roleNavigation && roleButtons.length) {
    roleNavigation.hidden = false;
    roleNavigation.setAttribute('role', 'tablist');
    roleButtons.forEach((button, index) => {
      button.id = `tab-${button.dataset.role}`;
      button.setAttribute('role', 'tab');
      button.setAttribute('aria-controls', `role-${button.dataset.role}`);
      button.addEventListener('click', () => selectRole(button));
      button.addEventListener('keydown', event => {
        let next;
        if (event.key === 'ArrowRight') next = (index + 1) % roleButtons.length;
        if (event.key === 'ArrowLeft') next = (index - 1 + roleButtons.length) % roleButtons.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = roleButtons.length - 1;
        if (next === undefined) return;
        event.preventDefault(); selectRole(roleButtons[next]); roleButtons[next].focus();
      });
    });
    rolePanels.forEach(panel => {
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', `tab-${panel.dataset.panel}`);
      panel.tabIndex = 0;
    });
    selectRole(roleButtons[0]);
  }
  const copy = document.querySelector('.copy-email');
  const copyStatus = document.querySelector('.copy-status');
  if (copy && navigator.clipboard?.writeText) {
    copy.hidden = false;
    copy.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText('mail@eknath.dev'); copyStatus.textContent = 'Email copied'; }
      catch { copyStatus.textContent = 'Couldn’t copy. Use the email link instead.'; }
    });
  }
  const strip = document.querySelector('.blog-strip');
  const controls = document.querySelector('.scroll-controls');
  const previous = document.querySelector('[data-scroll="previous"]');
  const next = document.querySelector('[data-scroll="next"]');
  const updateScroll = () => {
    if (!strip || !controls) return;
    controls.hidden = strip.scrollWidth <= strip.clientWidth + 2;
    previous.disabled = strip.scrollLeft < 4;
    next.disabled = strip.scrollLeft + strip.clientWidth >= strip.scrollWidth - 4;
  };
  const moveArticles = direction => {
    strip.scrollBy({ left: direction * ((strip.querySelector('li')?.getBoundingClientRect().width || 280) + 24), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };
  previous?.addEventListener('click', () => moveArticles(-1));
  next?.addEventListener('click', () => moveArticles(1));
  strip?.addEventListener('scroll', updateScroll, { passive: true });
  window.addEventListener('resize', updateScroll);
  updateScroll();
  const feeds = [['blog', 'https://md.eknath.dev', 3], ['projects', 'https://projects.eknath.dev', 2], ['quickref', 'https://qref.eknath.dev', 2]];
  const dateFormat = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
  const renderItem = (item, compact) => {
    const row = document.createElement('li'); row.className = 'recent-item';
    if (compact) {
      const details = document.createElement('details');
      const summary = document.createElement('summary'); summary.textContent = item.title.split(' - ')[0];
      const description = document.createElement('p'); description.textContent = item.description || '';
      const destination = document.createElement('a'); destination.href = item.url;
      destination.textContent = new URL(item.url).hostname.startsWith('projects.') ? 'Open project' : 'Open reference';
      details.append(summary, description, destination); row.append(details); return row;
    }
    const link = document.createElement('a'); link.href = item.url;
    if (!compact) {
      const date = new Date(item.date + 'T00:00:00Z');
      if (!Number.isNaN(date.getTime())) {
        const time = document.createElement('time'); time.dateTime = item.date;
        time.textContent = dateFormat.format(date); link.append(time);
      }
    }
    const title = document.createElement('h3'); title.textContent = compact ? item.title.split(' - ')[0] : item.title; link.append(title);
    if (!compact) {
      const description = document.createElement('p'); description.textContent = item.description || ''; link.append(description);
      const label = document.createElement('span'); label.className = 'article-label'; label.textContent = 'Read article'; link.append(label);
    }
    row.append(link); return row;
  };
  feeds.forEach(async ([id, origin, count]) => {
    const list = document.querySelector(`[data-recent="${id}"]`);
    if (!list) return;
    try {
      const response = await fetch(`${origin}/recent.json`, { signal: AbortSignal.timeout(8000), credentials: 'omit' });
      if (!response.ok) return;
      const items = await response.json();
      if (!Array.isArray(items)) return;
      const valid = items.filter(item => {
        try { return typeof item.title === 'string' && typeof item.date === 'string' && new URL(item.url).origin === origin; } catch { return false; }
      }).slice(0, count);
      if (valid.length) { list.replaceChildren(...valid.map(item => renderItem(item, id !== 'blog'))); if (id === 'blog') requestAnimationFrame(updateScroll); }
    } catch { /* Keep the generated HTML snapshot and working collection links. */ }
  });
})();
