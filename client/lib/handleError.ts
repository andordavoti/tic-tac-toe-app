import * as Sentry from 'sentry-expo';
import { Exception } from 'sentry-expo';

export const handleError = (err: Exception) => {
    if (process.env.NODE_ENV === 'development') console.error(err);
    else Sentry.captureException(err);
};
