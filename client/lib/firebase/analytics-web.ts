import firebase from 'firebase/compat/app';
import 'firebase/compat/analytics';

import initializeApp from './init';
initializeApp();

const analytics = firebase.analytics;
export default analytics;
