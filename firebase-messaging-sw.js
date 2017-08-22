importScripts('https://www.gstatic.com/firebasejs/4.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.2.0/firebase-messaging.js');

console.log('Initializing service worker');

firebase.initializeApp({
	'messagingSenderId': '102046236655'
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
	console.log('Received background push message', payload);

	// todo: build from the event
	self.registration.showNotification('Budget Recommendation', {
		body: 'What would you like to do with this budget recommendation?',
		icon: 'images/ccard.png',
		vibrate: [200, 100, 200, 100, 200, 100, 400],
		actions: [
			{ action: 'accept', title: 'Accept', icon: 'images/yes.png' },
			{ action: 'decline', title: 'Decline', icon: 'images/no.png' }
		]
	})
});

self.addEventListener('notificationclick', function(event) {
	// handle
});