// executor.worker.ts
/* eslint-disable no-restricted-globals */

self.onmessage = (e: MessageEvent) => {
    const { code, params } = e.data;

    try {
        // Create a Proxy-based notification system for arrays
        const createInstrumentedArray = (arr: any[], name: string) => {
            return new Proxy(arr, {
                get(target, prop) {
                    if (typeof prop === 'string' && !isNaN(Number(prop))) {
                        self.postMessage({
                            type: 'READ',
                            name,
                            index: Number(prop),
                            value: target[Number(prop)]
                        });
                    }
                    return (target as any)[prop];
                },
                set(target, prop, value) {
                    if (typeof prop === 'string' && !isNaN(Number(prop))) {
                        (target as any)[prop] = value;
                        self.postMessage({
                            type: 'WRITE',
                            name,
                            index: Number(prop),
                            value
                        });
                        return true;
                    }
                    (target as any)[prop] = value;
                    return true;
                }
            });
        };

        // Helper to notify the main thread of a logical step
        const step = (doing: string, next: string, status?: any, line?: number) => {
            self.postMessage({ type: 'STEP', doing, next, status, line });
        };

        // Inject helpers into the global scope of the worker
        const context = {
            ...params,
            nums: createInstrumentedArray(params.nums || [], 'nums'),
            step,
            console: {
                log: (...args: any[]) => self.postMessage({ type: 'LOG', value: args.join(' ') })
            }
        };

        // Create the function from the code string
        // We expect the user code to be the body of a function or a complete function definition
        const runner = new Function(...Object.keys(context), `
            try {
                ${code}
            } catch (err) {
                self.postMessage({ type: 'ERROR', message: err.message });
            }
        `);

        runner(...Object.values(context));
        
        self.postMessage({ type: 'DONE' });

    } catch (err: any) {
        self.postMessage({ type: 'ERROR', message: err.message });
    }
};
