import firebase from 'firebase/compat/app';
import initializeApp from './init';
import 'firebase/compat/firestore';

import firestoreRn, {
    FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import { IS_WEB } from '../constants';

if (IS_WEB) {
    initializeApp();
}

const firestoreWeb = firebase.firestore;

export const getLobbyDocRef = (lobbyId: string) => {
    if (IS_WEB) {
        return firestoreWeb()
            .collection('lobbies')
            .doc(
                lobbyId
            ) as unknown as FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>;
    } else {
        return firestoreRn().collection('lobbies').doc(lobbyId);
    }
};
