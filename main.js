'use strict';

window.addEventListener('load', initialize);

function initialize() {
	console.log('Initializing application');
	
	var config = {
		apiKey: "AIzaSyB2i9SU0sLYYbKc6u2btYHtmEOEtkqiqss",
		authDomain: "media-group-notifications.firebaseapp.com",
		databaseURL: "https://media-group-notifications.firebaseio.com",
		projectId: "media-group-notifications",
		storageBucket: "media-group-notifications.appspot.com",
		messagingSenderId: "102046236655"
	};

	firebase.initializeApp(config);

	var messaging = firebase.messaging();

	// Manually wire up the service worker since the automatic configuration won't find it unless it's
	// at the root. This allows the app to be hosted from a context root i.e. https://www.apps.com/myapp/
	if(navigator.serviceWorker) {
		console.log('Registering service worker');

		navigator.serviceWorker.register('./firebase-messaging-sw.js', { scope: 'firebase-cloud-messaging-push-scope' }).then(function (registration) {
			messaging.useServiceWorker(registration);
		});
	} else {
		console.info('Service worker not supported');
	}

	messaging.onTokenRefresh(function(token) {
		onToken(token, true);
	});

	messaging.requestPermission().then(function() {
		console.log('Notification permission granted');

		messaging.getToken().then(function(token) {
			onToken(token, false);
		}).catch(function(e) {
			console.log('Unable to retrieve token ', e);
		});
	}).catch(function(e) {
		console.log('Permission denied', e);
	});

	messaging.onMessage(function(payload) {
		console.log('Foreground message received', payload);

		var json = JSON.stringify(payload);
		var div = getNotificationDiv();

		div.innerHTML = new Date() + ': ' + json + '<br>' + div.innerHTML;

		var notification = new Notification('Foregorund Message: ' + payload.data.title, {
			body: json,
			icon: 'images/ccard.png'
		});
	});
}

function getKeyDiv() {
	return document.querySelector('.js-key');
}

function getNotificationDiv() {
	return document.querySelector('.js-notification');
}

function onToken(token, refresh) {
	console.log('Token (refresh: ' + refresh + ')', token);

	getKeyDiv().innerHTML = token;
}