export function delay(ms = 1000) {
  return function <T>(x: T) {
    return new Promise<T>(resolve => setTimeout(() => resolve(x), ms));
  };
}

export function tryCatch(
  _try: () => any,
  _catch: (error?: string) => any = error => new Error(error),
) {
  try {
    return _try();
  } catch (e) {
    return _catch(e);
  }
}

export function retryRequest<T>(request: () => Promise<T>, retries = 3): Promise<T> {
  return request().catch(error => {
    if (retries > 0) {
      return retryRequest(request, retries - 1);
    } else {
      throw error;
    }
  });
}
