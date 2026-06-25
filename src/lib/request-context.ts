import { randomUUID } from "crypto";

const REQUEST_ID_HEADER = "x-request-id";
const ASYNC_STORAGE_KEY = "request-id";

interface AsyncStorageWrapper {
  getStore(): Map<string, string> | undefined;
  get(key: string): string | undefined;
  set(key: string, value: string): void;
}

let asyncLocalStorage: AsyncStorageWrapper | null = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { AsyncLocalStorage: ALS } = require("node:async_hooks");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const storage = new ALS() as any;
  storage.run(new Map([[ASYNC_STORAGE_KEY, "init"]]), () => {});
  asyncLocalStorage = {
    getStore: () => storage.getStore(),
    get: (key) => storage.getStore()?.get(key),
    set: (key, value) => storage.getStore()?.set(key, value),
  };
} catch {
  // AsyncLocalStorage not available (older Node.js versions)
}

export function generateRequestId(): string {
  return randomUUID();
}

export function getRequestId(request?: Request): string {
  if (request) {
    const headerId = request.headers.get(REQUEST_ID_HEADER);
    if (headerId) return headerId;
  }

  if (asyncLocalStorage) {
    const storedId = asyncLocalStorage.get(ASYNC_STORAGE_KEY);
    if (storedId) return storedId;
  }

  return generateRequestId();
}

export function setRequestId(requestId: string): void {
  if (asyncLocalStorage) {
    asyncLocalStorage.set(ASYNC_STORAGE_KEY, requestId);
  }
}

export function withRequestId<T>(requestId: string, fn: () => T): T {
  if (asyncLocalStorage) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { AsyncLocalStorage: ALS } = require("node:async_hooks");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const storage = new ALS() as any;
    return storage.run(new Map([[ASYNC_STORAGE_KEY, requestId]]), fn);
  }
  return fn();
}

export function addRequestIdToHeaders(requestId: string, headers: HeadersInit = {}): HeadersInit {
  if (headers instanceof Headers) {
    headers.set(REQUEST_ID_HEADER, requestId);
    return headers;
  }
  if (Array.isArray(headers)) {
    return [...headers, [REQUEST_ID_HEADER, requestId]];
  }
  return { ...headers, [REQUEST_ID_HEADER]: requestId };
}
