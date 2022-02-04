import EventEmitter from 'eventemitter3';
import Event from './events';

const emitter = new EventEmitter();

let timeoutId: number;

type Handler = (...args: any[]) => void;

const Events = {
  debounceTimeout: 100,

  on(event: Event, handler: Handler) {
    emitter.on(event, handler);
    return this;
  },

  off(event: Event, handler?: Handler) {
    emitter.off(event, handler);
    return this;
  },

  emit(event: Event, ...args: any[]) {
    emitter.emit(event, ...args);
    return this;
  },

  emitDebounce(event: Event, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      emitter.emit(event, ...args);
    }, this.debounceTimeout) as unknown as number;
  },
};

export { Events, Event };
