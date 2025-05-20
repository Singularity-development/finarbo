import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class RequestContextService {
  private readonly asyncLocalStorage = new AsyncLocalStorage<
    Map<string, any>
  >();

  run(callback: () => void, data: Record<string, any>) {
    const store = new Map(Object.entries(data));
    this.asyncLocalStorage.run(store, callback);
  }

  get<T>(key: string): T | undefined {
    const store = this.asyncLocalStorage.getStore();
    return store?.get(key) as T;
  }

  set(key: string, value: any) {
    const store = this.asyncLocalStorage.getStore();
    store?.set(key, value);
  }
}
