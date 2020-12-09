export function delay(ms = 1000) {
  return function <T>(x: T) {
    return new Promise<T>(resolve => setTimeout(() => resolve(x), ms));
  };
}
