'use strict';

console.log('service worker created');

self.addEventListener('push', function(event) {
	console.log('Received a push message', event);

	// todo: build from the event
	self.registration.showNotification('Budget Recommendation', {
		body: 'What would you like to do with this budget recommendation?',
		actions: [
			{ action: 'accept', title: 'Accept' },
			{ action: 'decline', title: 'Decline' }
		]
	})
});

self.addEventListener('notificationclick', function(event) {
	console.log('CLICKED ' + event.action);
}, false);