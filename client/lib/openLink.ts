import * as WebBrowser from 'expo-web-browser';
import { Linking } from 'react-native';
import { handleError } from './handleError';
import { IS_WEB } from './constants';

export const openLink = async (link: string) => {
    try {
        if (IS_WEB) {
            Linking.openURL(link);
        } else {
            await WebBrowser.openBrowserAsync(link);
        }
    } catch (err) {
        handleError(err);
    }
};
