import * as Sentry from 'sentry-expo';
import { IS_WEB } from './constants';

export const handleError = (err: any) => {
    if (__DEV__) {
        console.error(err);
    } else {
        if (IS_WEB) {
            Sentry.Browser.captureException(err);
        } else {
            Sentry.Native.captureException(err);
        }
    }
};
