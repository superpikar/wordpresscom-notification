// Initialize Firebase
// TODO: Replace with your project's customized code snippet
const CONFIG = {
  apiKey: 'AIzaSyAnErFH5nwsgH3uRcQijgnrjlHRIdNs3CI',
  messagingSenderId: "1035111383580",
};
let data = {
  currentToken: '',
  state: 'INITIAL', // INITIAL, SUBSCRIBED
}

firebase.initializeApp(CONFIG);

// Retrieve Firebase Messaging object.
const messaging = firebase.messaging();

function initialize() {
  // define own service worker. follow https://stackoverflow.com/a/41701594/1843755
  navigator.serviceWorker.register('./firebase-messaging-sw.js').then((registration) => {
    messaging.useServiceWorker(registration);

    requestPermission();
    monitorTokenRefresh();
    monitorIncomingMessage();
  });
}

/* =============== PRIVATE FUNCTION ================== */
function requestPermission() {
  messaging.requestPermission()
    .then(function() {
      console.log('Notification permission granted.');
      data.state = 'GRANTED';
      // TODO(developer): Retrieve an Instance ID token for use with FCM.
      getCurrentRegistrationToken();
    })
    .catch(function(err) {
      console.log('Unable to get permission to notify.', err);
    });
}

function getCurrentRegistrationToken() {
  // Get Instance ID token. Initially this makes a network call, once retrieved
  // subsequent calls to getToken will return from cache.
  messaging.getToken()
    .then((currentToken) => {
      console.log('currentToken', currentToken);
      if (currentToken) {
        data.currentToken = currentToken;
      } else {
        // Show permission request.
        console.log('No Instance ID token available. Request permission to generate one.');
        // Show permission UI.
        requestPermission();
      }
    })
    .catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
    });
}

function monitorTokenRefresh() {
  // Callback fired if Instance ID token is updated.
  messaging.onTokenRefresh(function() {
    messaging.getToken()
      .then(function(refreshedToken) {
        console.log('Token refreshed.', refreshedToken);
        // Indicate that the new Instance ID token has not yet been sent to the
        // app server.
        // Send Instance ID token to app server.
        // ...
      })
      .catch(function(err) {
        console.log('Unable to retrieve refreshed token ', err);
      });
  });
}

// Handle incoming messages. Called when:
// - a message is received while the app has focus
// - the user clicks on an app notification created by a sevice worker
//   `messaging.setBackgroundMessageHandler` handler.
function monitorIncomingMessage() {
  messaging.onMessage(function(payload) {
    console.log("Message received. ", payload);
  });
}

new Vue({
  el: '#app',
  data,
  mounted() {
    initialize();
  },
  methods: {}
})
