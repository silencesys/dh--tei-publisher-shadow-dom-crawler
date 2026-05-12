# Shadow-Crawler

A tiny utility (~50 lines) that injects a CSS stylesheet into the shadow root of custom elements — no build tools, no dependencies.

Useful when you need to style content rendered inside a Web Component's shadow DOM and the component exposes no `::part()` selectors or CSS custom properties for the part you need.

## Installation

**Via jsDelivr CDN:**
```html
<script src="https://cdn.jsdelivr.net/gh/silencesys/dh--tei-publisher-shadow-dom-crawlers@latest/shadow-dom.js"></script>
```

**Download and self-host:**  
Copy `shadow-styles.js` into your project.

## Usage

After loading the script, `injectShadowStyles` is available as a global:

```html
<script src="https://cdn.jsdelivr.net/gh/silencesys/dh--tei-publisher-shadow-dom-crawler@latest/shadow-dom.js"></script>
<script>
  injectShadowStyles('pb-view', 'path/to/my.css', ['pb-results-received']);
</script>
```

Or import it as an ES module:

```js
import { injectShadowStyles } from 'https://cdn.jsdelivr.net/gh/silencesys/dh--tei-publisher-shadow-dom-crawler@latest/shadow-dom.js';
injectShadowStyles('my-element', '/styles/custom.css');
```

## API

```
injectShadowStyles(selector, cssUrl, events?)
```

| Parameter  | Type       | Required | Description |
|------------|------------|----------|-------------|
| `selector` | `string`   | yes      | CSS selector for the target custom element(s) |
| `cssUrl`   | `string`   | yes      | URL of the stylesheet to inject |
| `events`   | `string[]` | no       | DOM event names that re-trigger injection after content reloads |

## How it works

1. Waits for the custom element to be defined via `customElements.whenDefined()`
2. Appends a `<style>` node directly into each matching element's shadow root
3. **Idempotent** — the same stylesheet is never injected twice into the same shadow root
4. **MutationObserver** watches for new matching elements added later
5. **Event listeners** re-inject after any listed events fire (useful for components that re-render their shadow DOM content, e.g. after a data fetch)

## Example: TEI Publisher `pb-view`

TEI Publisher renders document content inside `pb-view`'s shadow DOM. To style footnotes:

```html
<script src="https://cdn.jsdelivr.net/gh/silencesys/dh--tei-publisher-shadow-dom-crawler@latest/shadow-dom.js"></script>
<script>
  // 'pb-results-received' fires every time pb-view loads a new page of content
  injectShadowStyles('pb-view', 'resources/css/my-overrides.css', ['pb-results-received']);
</script>
```

## Versioning

Pin to a specific release tag in production to avoid unexpected updates:

```html
<script src="https://cdn.jsdelivr.net/gh/silencesys/dh--tei-publisher-shadow-dom-crawler@latest/shadow-dom.js@1.0.0/shadow-styles.js"></script>
```

jsDelivr caches `@latest` for up to 12 hours. Use a pinned tag for immediate cache busting.

## License

MIT
