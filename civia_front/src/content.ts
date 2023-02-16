import browser from 'webextension-polyfill';
// @ts-ignore
import fileName from '@src/inpage/index.ts?script&module';

import { WindowMessageType, messageStream, sendMessage } from '@argentx/packages/extension/src/shared/messages';

const container = document.head || document.documentElement;
const script = document.createElement('script');

script.src = browser.runtime.getURL(fileName);
script.type = 'module';
const argentExtensionId = browser.runtime.id;
script.id = 'argent-x-extension';
script.setAttribute('data-extension-id', argentExtensionId);

container.insertBefore(script, container.children[0]);

window.addEventListener(
    'message',
    function (event: MessageEvent<WindowMessageType>) {
    // forward messages which were not forwarded before and belong to the extension
        if (
            !event.data?.forwarded &&
      event.data?.extensionId === argentExtensionId
        ) {
            sendMessage({ ...event.data });
        }
    }
);
messageStream.subscribe(([msg]: any) => {
    window.postMessage(
        { ...msg, forwarded: true, extensionId: argentExtensionId },
        window.location.origin
    );
});
