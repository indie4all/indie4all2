import { ConfigOptions } from './types';
import Config from './config';
import ContainerManager from './container.manager';
import App from './app/app';

const start = async (options?: ConfigOptions) => {
    options && Config.setOptions(options);
    if (Config.isPWAEnabled() && 'serviceWorker' in navigator) {
        window.addEventListener('load', async () => {
            try {
                await navigator.serviceWorker.register('/service-worker.js');
            } catch (error) {
                Config.setPWAEnabled(false);
                console.warn("The ServiceWorker could not be registered")
            }
        });
    }
    const app = ContainerManager.instance.get(App) as App;
    await app.init();
    return { load: (model: any) => app.load(model) }
}

export { start };