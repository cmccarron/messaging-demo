'use strict';

window.addEventListener('load', initialize);

function initialize() {
	console.log('Initializing application');
	
	var serviceWorker = navigator.serviceWorker;

	if(serviceWorker) {
		console.log('Service workers are supported');

		navigator.serviceWorker.register('./messaging-sw.js').then(function() {
			initializeMessaging(serviceWorker);
		});

		getToggle().addEventListener('click', function() {
			if(this.checked) {
				subscribe();
			} else {
				unsubscribe();
			}
		});

		document.querySelector('.js-test-notification').addEventListener('click', testNotification);
	} else {
		console.log('Service workers are not supported');
	}
}

function getToggle() {
	return document.querySelector('.js-toggle-messaging');
}

function initializeMessaging(serviceWorker) {
	console.log('Initializing push messaging');

	var toggle = getToggle();	

	if(ServiceWorkerRegistration.prototype.showNotification) {
		if(Notification.permission !== 'denied') {
			if(window.PushManager) {
				console.log('Push messaging is supported');

				serviceWorker.ready.then(function(registration) {
					registration.pushManager.getSubscription().then(function(subscription) {
						if(subscription) {
							onSubscribed(subscription);

							toggle.checked = true;
						} else {
							console.log('Not subscribed to push messages');
						}
					});
				}).catch(function(e) {
					console.error('Unable to get subscription: ' + e);
				});
			} else {
				console.log('Push messaging is not supported');
			}
		} else {
			console.log('Notifications are disabled by the user');
		}
	} else {
		console.log('Notifications are not supported');
	}
}

function testNotification() {
	navigator.serviceWorker.ready.then(function(w) {
		w.showNotification('New message', {
			body: 'New message',
			actions: [
				{ action: 'like', title: 'Like' },
				{ action: 'reply', title: 'Reply' }
			]
		})
	});
}

function onSubscribed(subscription) {
	var endpoint = subscription.endpoint;

	document.querySelector('.js-key').innerHTML = endpoint.substring(endpoint.lastIndexOf('/') + 1);

	console.log('Subscribed to push messages: ' + endpoint);
}

function onUnsubscribed(subscription) {
	console.log('Unsubscribed from push messages: ' + subscription.endpoint);
}

function subscribe() {
	navigator.serviceWorker.ready.then(function(serviceWorker) {
		serviceWorker.pushManager.subscribe({ userVisibleOnly: true }).then(onSubscribed).catch(function(e) {
			console.error('Subscription failed: ' + e);

			getToggle().checked = false;
		});
	});
}

function unsubscribe() {
	navigator.serviceWorker.ready.then(function(serviceWorker) {
		serviceWorker.pushManager.getSubscription().then(function(subscription) {
			if(subscription) {
				subscription.unsubscribe().then(function() {
					onUnsubscribed(subscription);
				}).catch(function(e) {
					console.error('Failed to unsubscribe from push messages: ' + e);
				});
			} else {
				console.log('Not currently subscribed to push messages');
			}
		});
	});
}