import firebase from 'firebase/app';
import 'firebase/firestore';
import { firebaseConfig } from './apiKeys';

firebase.initializeApp(firebaseConfig);

export const firestore = firebase.firestore();

export const modifyPlayer = (playersArr, id, newState) =>
  playersArr.map((player, index) => (index === id ? { ...player, ...newState } : player));

export const getConnectedPlayers = players => players.filter(player => player.connected);
