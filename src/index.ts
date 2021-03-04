type EventMap = Record<string, any>;
type VoidKeys<T extends EventMap> = {
  [K in keyof T]: T[K] extends (arg: void) => void ? K : never;
}[keyof T];
type NonVoidKeys<T extends EventMap> = {
  [K in keyof T]: T[K] extends (arg: void) => void ? never : K;
}[keyof T];
type Unpacked<T> = T extends (infer U)[] ? U : T;

type Handlers<T> = { [K in keyof T]: T[K][] };
// type EventReceiver<T> = (params: T) => void;
class Ereignis<T extends EventMap> {
  private handlers: Handlers<T>;
  constructor() {
    this.handlers = {} as Handlers<T>;
  }
  // emit<K extends VoidKeys<T>>(eventKey: K): void;
  emit<K extends VoidKeys<T>>(eventKey: K, ...args: never): void;
  emit<K extends NonVoidKeys<T>>(eventKey: K, ...args: Parameters<T[K]>): void {
    if (args) {
      this.handlers[eventKey].forEach(listeningHandler =>
        listeningHandler(args)
      );
    } else {
      this.handlers[eventKey].forEach(listeningHandler => listeningHandler());
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
  off<K extends keyof T>(eventKey: K, handler: Unpacked<T[K]>) {
    if (eventKey in this.handlers) {
      this.handlers[eventKey] = this.handlers[eventKey].filter(
        (listeningHandler: any) => listeningHandler !== handler
      );
    }
  }
}
export { Ereignis };
