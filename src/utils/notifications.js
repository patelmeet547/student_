// import { Platform, PermissionsAndroid } from 'react-native';
// import PushNotification, { Importance } from 'react-native-push-notification';

// const DEFAULT_CHANNEL_ID = 'student_erp_general';

// export function initializeNotifications() {
// 	// If native module isn't linked yet, avoid crashing
// 	if (!PushNotification || typeof PushNotification.createChannel !== 'function') {
// 		console.warn('[notifications] Native module not available yet. Skipping init.');
// 		return;
// 	}
// 	// Create channel for Android
// 	if (Platform.OS === 'android') {
// 		// Android 13+ requires runtime notification permission
// 		try {
// 			PermissionsAndroid.request?.(
// 				PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
// 			);
// 		} catch (e) {}
// 		PushNotification.createChannel(
// 			{
// 				channelId: DEFAULT_CHANNEL_ID,
// 				channelName: 'General Notifications',
// 				channelDescription: 'Announcements, homework, and leaves',
// 				importance: Importance.HIGH,
// 				vibrate: true,
// 			},
// 			() => {}
// 		);
// 	}

// 	// Request permission (iOS); Android auto-grants
// 	PushNotification.configure({
// 		onRegister: () => {},
// 		onNotification: () => {},
// 		requestPermissions: Platform.OS === 'ios',
// 	});
// }

// export function showLocalNotification({ title, message, data }) {
// 	if (!PushNotification || typeof PushNotification.localNotification !== 'function') {
// 		console.warn('[notifications] Native module not available for localNotification.');
// 		return;
// 	}
// 	PushNotification.localNotification({
// 		/* Android Only */
// 		channelId: DEFAULT_CHANNEL_ID,
// 		vibrate: true,
// 		vibration: 300,
// 		priority: 'max',
// 		importance: Importance.HIGH,

// 		/* iOS and Android */
// 		title,
// 		message,
// 		userInfo: data || {},
// 		playSound: true,
// 		soundName: 'default',
// 	});
// }

// export const NotificationChannel = {
// 	DEFAULT_CHANNEL_ID,
// };


