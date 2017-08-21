'use strict';

console.log('service worker created');

self.addEventListener('push', function(event) {
	console.log('Received a push message', event);

	// todo: build from the event
	self.registration.showNotification('Budget Recommendation', {
		body: 'What would you like to do with this budget recommendation?',
		icon: 'images/ccard.png',
		vibrate: [200, 100, 200, 100, 200, 100, 400],
		actions: [
			{ action: 'accept', title: 'Yes', icon: 'images/yes.png' },
			{ action: 'decline', title: 'No', icon: 'images/no.png' }
		]
	})
});

self.addEventListener('notificationclick', function(event) {
	console.log('CLICKED ' + event.action);
}, false);