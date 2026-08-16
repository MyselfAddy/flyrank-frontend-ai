import '@testing-library/jest-dom/vitest';

// Polyfill scrollTo for jsdom
if (typeof Element !== 'undefined' && !Element.prototype.scrollTo) {
  Element.prototype.scrollTo = () => {};
}

if (typeof window !== 'undefined' && !window.scrollTo) {
  window.scrollTo = () => {};
}

// Polyfill form.requestSubmit for jsdom
if (typeof HTMLFormElement !== 'undefined' && !HTMLFormElement.prototype.requestSubmit) {
  HTMLFormElement.prototype.requestSubmit = function (submitter) {
    if (submitter) {
      submitter.click();
    } else {
      const event = new Event('submit', { bubbles: true, cancelable: true });
      this.dispatchEvent(event);
    }
  };
}
