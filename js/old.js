'use strict';

// get the keys from https://web-push-codelab.appspot.com/
const PUBLICKEY = 'BGKbymIoTXK8p3N_BIBO-EJHPdWFKuL4GT-AZ3YDzSz1CRjp8qV3m3CdDBspnlaxD7N4DGSe87khRYiMDoLCTFY';
const APPSERVERKEY = urlB64ToUint8Array(PUBLICKEY);

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

new Vue({
  el: '#app',
  delimiters: ['${', '}'],
  data: {
    subscription: undefined,
    isSubscribed: false,
    swRegistration: undefined,
    state: 'INITIAL', // INITIAL, SUBSCRIBED, NOTSUBSCRIBED, NOTSUPPORTED, BLOCKED
  },
  filters: {
    stringify(value) {
      return JSON.stringify(value);
    },
  },
  mounted() {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      console.log('Service Worker and Push is supported');
      navigator.serviceWorker.register('sw.js')
        .then((swReg) => {
          console.log('Service Worker is registered', swReg);
          this.swRegistration = swReg;
          window.setTimeout(() => {
            this.initializeUI();
          }, 1000);
        })
        .catch((error) => {
          console.error('Service Worker Error', error);
        });
    } else {
      console.warn('Push messaging is not supported');
      this.state = 'NOTSUPPORTED';
    }
  },
  methods: {
    initializeUI() {
      this.swRegistration.pushManager.getSubscription()
        .then((subscription) => {
          this.isSubscribed = subscription !== null;
          this.updateSubscriptionOnServer(subscription);
          if (this.isSubscribed) {
            console.log('user is subscribed');
            this.state = 'SUBSCRIBED';
          } else {
            this.state = 'NOTSUBSCRIBED';
            console.log('user is not subscribed');
          }
        });
    },
    subscribeUser() {
      this.swRegistration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: APPSERVERKEY,
        })
        .then((subscription) => {
          console.log('user is subscribed');
          this.isSubscribed = true;
          this.state = 'SUBSCRIBED';
          this.updateSubscriptionOnServer(subscription);
        })
        .catch((err) => {
          console.log('Failed to subscribe the user: ', err);
          this.isSubscribed = false;
          this.state = 'NOTSUBSCRIBED';
          this.checkSubscriptionPermission();
        });
    },
    unsubscribeUser() {
      this.isSubscribed = false;
      this.state = 'NOTSUBSCRIBED';
    },
    updateSubscriptionOnServer(subscription) {
      // TODO: Send subscription to application server
      this.subscription = subscription;
    },
    checkSubscriptionPermission() {
      console.log('check permission');
      if (Notification.permission === 'denied') {
        console.log('check permission - denied!');
        this.state = 'BLOCKED';
        this.updateSubscriptionOnServer(null);
      }
    }
  }
});
