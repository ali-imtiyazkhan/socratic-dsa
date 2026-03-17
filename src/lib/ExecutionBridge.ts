// ExecutionBridge.ts
import { useGameStore } from '../store/useGameStore';

export class ExecutionBridge {
    private worker: Worker | null = null;
    private logBuffer: string[] = [];

    constructor(private onComplete: (result: any) => void, private onError: (err: string) => void) {}

    public run(code: string, params: any) {
        // We use a Blob for the worker to avoid complex separate build steps in this environment
        // In a real production app, this would be a separate file handled by the bundler.
        this.terminate();

        const workerBlob = new Blob([`
            self.onmessage = (e) => {
                const { code, params } = e.data;
                try {
                    const createInstrumentedArray = (arr, name) => {
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
                                return target[prop];
                            },
                            set(target, prop, value) {
                                if (typeof prop === 'string' && !isNaN(Number(prop))) {
                                    target[prop] = value;
                                    self.postMessage({
                                        type: 'WRITE',
                                        name,
                                        index: Number(prop),
                                        value
                                    });
                                    return true;
                                }
                                target[prop] = value;
                                return true;
                            }
                        });
                    };

                    const step = (doing, next, pointers) => {
                        self.postMessage({ type: 'STEP', doing, next, pointers });
                    };

                    const context = {
                        ...params,
                        nums: createInstrumentedArray(params.nums || [], 'nums'),
                        step,
                        console: {
                            log: (...args) => self.postMessage({ type: 'LOG', value: args.join(' ') })
                        }
                    };

                    const runner = new Function(...Object.keys(context), code);
                    const result = runner(...Object.values(context));
                    
                    self.postMessage({ type: 'DONE', result });
                } catch (err) {
                    self.postMessage({ type: 'ERROR', message: err.message });
                }
            };
        `], { type: 'application/javascript' });

        this.worker = new Worker(URL.createObjectURL(workerBlob));
        const messageQueue: any[] = [];
        let isProcessing = false;

        const processQueue = async () => {
            if (isProcessing) return;
            isProcessing = true;
            
            while (messageQueue.length > 0) {
                const { type, data } = messageQueue.shift();
                const store = useGameStore.getState();

                switch (type) {
                    case 'STEP':
                        store.setSocraticStep({ doing: data.doing, next: data.next });
                        if (data.pointers) {
                            store.updateVisualization({ pointers: data.pointers });
                        }
                        await new Promise(r => setTimeout(r, 1000)); // Pacing
                        break;
                    case 'READ':
                    case 'WRITE':
                        store.updateVisualization({ highlightedIndices: [data.index] });
                        await new Promise(r => setTimeout(r, 500)); // Pacing
                        break;
                    case 'LOG':
                        console.log('Worker Log:', data.value);
                        break;
                    case 'ERROR':
                        this.onError(data.message);
                        this.terminate();
                        return;
                    case 'DONE':
                        this.onComplete(data.result);
                        this.terminate();
                        return;
                }
            }
            isProcessing = false;
        };

        this.worker.onmessage = (e) => {
            const { type, ...data } = e.data;
            messageQueue.push({ type, data });
            processQueue();
        };

        this.worker.postMessage({ code, params });
    }

    public terminate() {
        if (this.worker) {
            this.worker.terminate();
            this.worker = null;
        }
    }
}
