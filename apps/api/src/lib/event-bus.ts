import { EventEmitter } from 'events';
import type { DomainEvent } from '@opscore/domain';

class DomainEventBus extends EventEmitter {
  publish(event: DomainEvent): void {
    this.emit(event.type, event);
    this.emit('*', event);
  }

  subscribe(eventType: string, handler: (event: DomainEvent) => void | Promise<void>): void {
    this.on(eventType, handler);
  }

  subscribeAll(handler: (event: DomainEvent) => void | Promise<void>): void {
    this.on('*', handler);
  }
}

export const eventBus = new DomainEventBus();
