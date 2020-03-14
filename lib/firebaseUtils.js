import firebase from 'firebase/app';
import 'firebase/firestore';
import { firebaseConfig } from './apiKeys';

firebase.initializeApp(firebaseConfig);

export const firestore = firebase.firestore();
