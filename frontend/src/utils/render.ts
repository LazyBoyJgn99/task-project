export function waitForRender(callback: () => void, ms?: number) {
  setTimeout(() => {
    callback();
  }, ms || 300);
}
