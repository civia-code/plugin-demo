import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
// import inject from '@rollup/plugin-inject';
import Pages from 'vite-plugin-pages';
import svgr from 'vite-plugin-svgr';
//
import { resolve } from 'path';
//
import manifest from './src/manifest';

const publicDir = resolve(__dirname, 'public');

//
export default defineConfig({
    // server: {
    //     port: 7000,
    //     open: true
    // },
    build: {
        sourcemap: true,
        commonjsOptions: {
            transformMixedEsModules: true,
            sourceMap: true
        },
        target: ['es2020']
    },
    resolve: {
        preserveSymlinks: true,
        alias: {
            '@src': `${resolve(__dirname, 'src')}`
        }
    },
    assetsInclude: ['**/*.txt'],
    optimizeDeps: {
        include: ['bn.js', 'js-sha3', 'hash.js', 'aes-js', 'bech32', 'webextension-polyfill', 'tiny-case', 'property-expr', 'toposort', 'starknet4', 'ethers/lib/utils'],
        esbuildOptions: {
            target: 'es2020'
        }
    },
    plugins: [
        svgr(),
        react(),
        crx({ manifest }),
        Pages({
            extensions: ['tsx'],
            exclude: ['**/components/*.tsx', '**/layouts/*.tsx']
        })
    ],
    publicDir,
    define: {
        'process.env': {
            SENTRY_DSN: '',
            VERSION: JSON.stringify(process.env.npm_package_version)
        }
    }
});
