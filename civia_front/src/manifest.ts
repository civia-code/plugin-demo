import { defineManifest } from '@crxjs/vite-plugin';
const pkg = require('../package.json');

const isBuild = process.env.npm_lifecycle_event === 'build';

const manifestV3 = defineManifest({
    manifest_version: 3,
    name: `Civia Wallet ${isBuild ? '' : '(dev)'}`,
    version: pkg.version,
    action: {
        default_title: 'Civia Wallet',
        default_popup: 'index.html'
    },
    permissions: ['activeTab', 'scripting', 'tabs', 'background', 'storage', 'alarms', 'notifications'],
    background: {
        service_worker: 'src/background/index.ts',
        type: 'module'
    },
    // content_scripts: [
    //     {
    //         js: ['src/content.ts'],
    //         matches: ['<all_urls>']
    //     }
    // ],
    icons: {
        128: 'icon-128.png'
    },
    // web_accessible_resources: [{
    //     resources: ['**/*'],
    //     matches: ['<all_urls>']
    // }],
    description: `Cival Wallet ${new Date()}`
});

export default manifestV3;
