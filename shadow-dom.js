/**
 * Injects a CSS file into the shadow root of all matching elements,
 * and keeps it injected as new elements are added or content reloads.
 *
 * @param {string} selector   - CSS selector for the target custom element(s)
 * @param {string} cssUrl     - URL of the stylesheet to inject
 * @param {string[]} [events] - DOM event names that should trigger re-injection
 */
async function injectShadowStyles(selector, cssUrl, events = []) {
  const resp = await fetch(cssUrl);
  if (!resp.ok) {
    console.warn(`[shadow-styles] Failed to load ${cssUrl}:`, resp.status);
    return;
  }
  const css = await resp.text();
  const attr = `data-injected-${cssUrl.replace(/[^a-z0-9]/gi, '-')}`;

  function inject(el) {
    const root = el.shadowRoot;
    if (!root || root.querySelector(`style[${attr}]`)) return;
    const style = document.createElement('style');
    style.setAttribute(attr, '');
    style.textContent = css;
    root.appendChild(style);
  }

  await customElements.whenDefined(selector);
  await Promise.resolve();
  document.querySelectorAll(selector).forEach(inject);

  events.forEach(eventName => {
    document.addEventListener(eventName, e => inject(e.target));
  });

  new MutationObserver(mutations => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (node.nodeType !== 1) continue;
        if (node.matches(selector)) inject(node);
        node.querySelectorAll(selector).forEach(inject);
      }
    }
  }).observe(document.body, { childList: true, subtree: true });
}

// Expose as global for plain <script> usage
window.injectShadowStyles = injectShadowStyles;


  const resp = await fetch(cssUrl);
  if (!resp.ok) {
    console.warn(`[shadow-styles] Failed to load ${cssUrl}:`, resp.status);
    return;
  }
  const css = await resp.text();
  const attr = `data-injected-${cssUrl.replace(/[^a-z0-9]/gi, '-')}`;

  function inject(el) {
    const root = el.shadowRoot;
    if (!root || root.querySelector(`style[${attr}]`)) return;
    const style = document.createElement('style');
    style.setAttribute(attr, '');
    style.textContent = css;
    root.appendChild(style);
  }

  // Inject into all elements already in the DOM
  async function injectAll() {
    await customElements.whenDefined(selector);
    await Promise.resolve(); // let the element finish its own setup first
    document.querySelectorAll(selector).forEach(inject);
  }

  await injectAll();

  // Re-inject whenever specified events fire (e.g. content reloads)
  events.forEach(eventName => {
    document.addEventListener(eventName, e => inject(e.target));
  });

  // Re-inject for any future elements added to the DOM
  new MutationObserver(mutations => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (node.nodeType !== 1) continue;
        if (node.matches(selector)) inject(node);
        node.querySelectorAll(selector).forEach(inject);
      }
    }
  }).observe(document.body, { childList: true, subtree: true });
