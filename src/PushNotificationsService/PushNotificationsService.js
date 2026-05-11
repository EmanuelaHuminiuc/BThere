import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const PushNotificationService = {

    async sendPushNotification(expoPushToken, pushTitle, titleBody, options) {
        const message = {
            to: expoPushToken,
            sound: 'default',
            title: pushTitle,
            body: titleBody,
            data: options,
        };

        await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });
    },

    async registerForPushNotificationsAsync() {
        let token;
        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
            }
            if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
            }
            token = (await Notifications.getExpoPushTokenAsync()).data;
        } else {
            alert('Must use physical device for Push Notifications');
        }
        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
            });
        }
        return token;
    },

    async schedulePushNotification(title, body, counter) {
        const id = await Notifications.scheduleNotificationAsync({
          content: {
            title: title,
            body: body,
            sound: 'default',
          },
          trigger: {
            seconds: counter * 10,
            repeats: false,
          },
        });
        return id;
    },
}

export default PushNotificationService;