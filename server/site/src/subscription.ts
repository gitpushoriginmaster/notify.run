import { NotifyAPI } from './api';
import { urlB64ToUint8Array } from './util';

export class SubscriptionManager {
    pubKey: string = '';

    constructor() {
        NotifyAPI.getPubkey().then((pk) => this.pubKey = pk);
    }

    /*
    requestPermission() {
        Notification.requestPermission().then(function (result) {
            console.log(result);
        });
    }
    */

    subscribe(channelId: string) {
        return navigator.serviceWorker.register('/service-worker.js')
            .then((registration) => {
                const subscribeOptions = {
                    userVisibleOnly: true,
                    applicationServerKey: urlB64ToUint8Array(this.pubKey)
                };
                return registration.pushManager.subscribe(subscribeOptions);
            })
            .then((pushSubscription) => {
                console.log('Received PushSubscription: ', JSON.stringify(pushSubscription));
                NotifyAPI.subscribe(channelId, pushSubscription);
                return pushSubscription;
            });
    }
}