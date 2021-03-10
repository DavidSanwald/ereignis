type EventMap = Record<string, any>;
type NonVoidKeys<T extends EventMap> = {
  [K in keyof T]: T[K] extends (arg: void) => void ? never : K;
}[keyof T];
type Unpacked<T> = T extends (infer U)[] ? U : T;

type Handlers<T> = { [K in keyof T]: T[K][] };
class Ereignis<T extends EventMap> {
  private handlers: Handlers<T>;
  private onceHandlers: Handlers<T>;
  constructor() {
    this.handlers = {} as Handlers<T>;
    this.onceHandlers = {} as Handlers<T>;
  }

  emit<K extends keyof T>(
    eventKey: K,
    ...fnArgs: K extends NonVoidKeys<T> ? Parameters<T[K]> : never
  ): void {
    if (fnArgs && fnArgs.length > 0) {
      eventKey in this.handlers &&
        this.handlers[eventKey].length > 0 &&
        this.handlers[eventKey].forEach(listeningHandler =>
          listeningHandler(fnArgs)
        );
      eventKey in this.onceHandlers &&
        this.onceHandlers[eventKey].length > 0 &&
        this.onceHandlers[eventKey].forEach(listeningHandler => {
          listeningHandler(fnArgs);
          this.off(eventKey, listeningHandler);
        });
    } else {
      eventKey in this.handlers &&
        this.handlers[eventKey].length > 0 &&
        this.handlers[eventKey].forEach(listeningHandler => listeningHandler());
      eventKey in this.onceHandlers &&
        this.onceHandlers[eventKey].length > 0 &&
        this.onceHandlers[eventKey].forEach(listeningHandler => {
          listeningHandler();
          this.off(eventKey, listeningHandler);
        });
    }
  }

  on<K extends keyof T>(eventKey: K, handler: Unpacked<T[K]>): void {
    if (!((eventKey as string) in this.handlers)) {
      this.handlers[eventKey] = [];
    }
    if (Array.isArray(this.handlers[eventKey])) {
      this.handlers[eventKey].push(handler);
    }
  }
  once<K extends keyof T>(eventKey: K, handler: Unpacked<T[K]>): void {
    if (!((eventKey as string) in this.onceHandlers)) {
      this.onceHandlers[eventKey] = [];
    }
    if (Array.isArray(this.onceHandlers[eventKey])) {
      this.onceHandlers[eventKey].push(handler);
    }
  }
  off<K extends keyof T>(eventKey: K, handler: Unpacked<T[K]>) {
    if (eventKey in this.handlers) {
      this.handlers[eventKey] = this.handlers[eventKey].filter(
        (listeningHandler: any) => listeningHandler !== handler
      );
    }
    if (eventKey in this.onceHandlers) {
      this.onceHandlers[eventKey] = this.onceHandlers[eventKey].filter(
        (listeningHandler: any) => listeningHandler !== handler
      );
    }
  }
}
export { Ereignis };
