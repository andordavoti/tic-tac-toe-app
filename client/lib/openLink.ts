import * as WebBrowser from 'expo-web-browser';
import { handleError } from './handleError';

export const openLink = async (link: string) => {
    try {
        await WebBrowser.openBrowserAsync(link);
    } catch (err) {
        handleError(err);
    }
};