import { AsyncLocalStorage } from "async_hooks";

const asyncLocalStorage = new AsyncLocalStorage<Map<string, unknown>>();

export type ContextKeys = "botRequestId";

export default {
  run: <T>(callback: () => T): T => {
    const store = new Map<ContextKeys, unknown>();
    return asyncLocalStorage.run(store, callback);
  },

  set: (key: ContextKeys, value: unknown): void => {
    const store = asyncLocalStorage.getStore();
    if (store) {
      store.set(key, value);
    }
  },

  get: <T>(key: ContextKeys): T => {
    const store = asyncLocalStorage.getStore();
    return store?.get(key) as T;
  },
};
