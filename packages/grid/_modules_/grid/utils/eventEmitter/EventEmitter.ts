export type Listener = (...args: any[]) => void;

// Used https://gist.github.com/mudge/5830382 as a starting point.
// See https://github.com/browserify/events/blob/master/events.js for
// the Node.js (https://nodejs.org/api/events.html) polyfill used by webpack.
export class EventEmitter {
  /**
   * @ignore - do not document.
   */
  maxListeners = 10;

  /**
   * @ignore - do not document.
   */
  warnOnce = false;

  /**
   * @ignore - do not document.
   */
  events: { [key: string]: Listener[] } = {};

  on(eventName: string, listener: Listener): void {
    if (!Array.isArray(this.events[eventName])) {
      this.events[eventName] = [];
    }

    this.events[eventName].push(listener);

    if (process.env.NODE_ENV !== 'production') {
      if (this.events[eventName].length > this.maxListeners && this.warnOnce === false) {
        this.warnOnce = true;
        console.warn(
          [
            `Possible EventEmitter memory leak detected. ${this.events[eventName].length} ${eventName} listeners added.`,
            `Use emitter.setMaxListeners() to increase limit.`,
          ].join('\n'),
        );
      }
    }
  }

  removeListener(eventName: string, listener: Listener): void {
    if (Array.isArray(this.events[eventName])) {
      const idx = this.events[eventName].indexOf(listener);

      if (idx > -1) {
        this.events[eventName].splice(idx, 1);
      }
    }
  }

  removeAllListeners(eventName?: string): void {
    if (!eventName) {
      this.events = {};
    } else if (Array.isArray(this.events[eventName])) {
      this.events[eventName] = [];
    }
  }

  emit(eventName: string, ...args: any[]): void {
    if (Array.isArray(this.events[eventName])) {
      const listeners = this.events[eventName].slice();
      const length = listeners.length;

      for (let i = 0; i < length; i += 1) {
        listeners[i].apply(this, args);
      }
    }
  }

  once(eventName: string, listener: Listener): void {
    // eslint-disable-next-line consistent-this
    const that = this;
    this.on(eventName, function oneTimeListener(...args) {
      that.removeListener(eventName, oneTimeListener);
      listener.apply(that, args);
    });
  }
}
