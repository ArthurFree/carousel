class CarouselClass {
    constructor(params = {}) {
        const self = this;
        self.params = params;

        self.eventsListeners = {};

        if (self.params && self.params.on) {
            Object.keys(self.params.on).forEach((eventName) => {
                self.on(eventName, self.params.on[eventName]);
            });
        }

        on(events, handler, priority) {
            const self = this;
            if (typeof handler !== 'function') return self;
            const method = priority ? 'unshift' : 'push';
            events.split(' ').forEach((event) => {
                if (!self.eventsListeners[event]) self.eventsListeners[event] = [];
                self.eventsListeners[event][method](handler);
            });
            return self;
        }

        static use(module, ...params) {
            const Class = this;
            if (Array.isArray(module)) {
                module.forEach(m => Class.installModule(m));
                return Class;
            }
            return Class.installModule(module, ...params);
        }

        static installModule(module, ...params) {
            const Class = this;
            if (!Class.prototype.modules) Class.prototype.modules = {};
            const name = module.name || (`${Object.keys(Class.prototype.modules).length}`);
        }
    }
}
