// Native builds get the config from google-services.json GoogleService-Info.plist
import firebase from 'firebase/compat/app';
import { firebaseConfig } from '../apiKeys';

const initializeApp = (): void => {
    firebase.initializeApp(firebaseConfig);
};

export default initializeApp;
