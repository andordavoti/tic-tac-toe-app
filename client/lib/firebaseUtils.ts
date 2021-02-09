import firebase from 'firebase/app';
import 'firebase/firestore';
import { firebaseConfig } from './apiKeys';
import { Player } from '../types/Game';

firebase.initializeApp(firebaseConfig);

export const firestore = firebase.firestore();

export const modifyPlayer = (playersArr: Player[], id: number, newState: any) =>
    playersArr.map((player, index) =>
        index === id ? { ...player, ...newState } : player
    );

export const getConnectedPlayers = (players: Player[]) =>
    players.filter(player => player.connected);
