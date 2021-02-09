import * as WebBrowser from 'expo-web-browser';
import { Platform, Linking } from 'react-native';
import { handleError } from './handleError';

export const openLink = async (link: string) => {
    try {
        if (Platform.OS === 'web') {
            Linking.openURL(link);
        } else {
            await WebBrowser.openBrowserAsync(link);
        }
    } catch (err) {
        handleError(err);
    }
};
