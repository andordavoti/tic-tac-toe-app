import firebase from 'firebase/app';
import 'firebase/firestore';
import { firebaseConfig } from './apiKeys';

interface Player {
  connected: boolean
  id: string
}

firebase.initializeApp(firebaseConfig);

export const firestore = firebase.firestore();

export const modifyPlayer = (playersArr: Player[], id: number, newState) =>
  playersArr.map((player, index) => (index === id ? { ...player, ...newState } : player));

export const getConnectedPlayers = (players: Player[]) => players.filter(player => player.connected);
