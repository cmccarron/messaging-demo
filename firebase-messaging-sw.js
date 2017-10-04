importScripts('https://www.gstatic.com/firebasejs/4.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.2.0/firebase-messaging.js');

console.log('Initializing service worker');

firebase.initializeApp({
	'messagingSenderId': '102046236655'
});

var messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
	console.log('Background message received', payload);

	// todo: build from the event
	self.registration.showNotification('Background Message: ' + payload.data.title, {
		body: payload.data.body,
		icon: 'images/ccard.png',
		vibrate: [200, 100, 200, 100, 200, 100, 400],
		actions: [
			{ action: 'accept', title: 'Accept', icon: 'images/yes.png' },
			{ action: 'decline', title: 'Decline', icon: 'images/no.png' }
		]
	});
});

self.addEventListener('notificationclick', function(event) {
	console.log('notification clicked');

	self.registration.showNotification('Action Clicked', {
		body: 'You clicked ' + event.action;
	})
});