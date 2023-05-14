import * as firebaseAdmin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { logger } from 'firebase-functions';
import dayjs from 'dayjs';
import app from './server';

const admin = firebaseAdmin.initializeApp();

const firestore = admin.firestore();

exports.game = functions.https.onRequest(app(firestore));

export const garbageCollector = functions.pubsub
    .schedule('every 48 hours')
    .onRun(async () => {
        const fourtyEightHoursAgo = firebaseAdmin.firestore.Timestamp.fromDate(
            dayjs().subtract(2, 'days').toDate()
        );

        const garbageCollections = firestore
            .collection('lobbies')
            .where('createdAt', '<', fourtyEightHoursAgo);

        const querySnapshot = await garbageCollections.get();
        if (querySnapshot.empty) {
            logger.log('Garbage Collector Exited - Nothing to delete');
            return;
        }

        const batch = firestore.batch();
        querySnapshot.docs.forEach(doc => batch.delete(doc.ref));

        await batch.commit();

        logger.log(
            `Garbage Collector Finished - Deleted ${querySnapshot.size} documents`
        );
    });
