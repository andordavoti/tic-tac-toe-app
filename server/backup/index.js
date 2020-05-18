const functions = require('firebase-functions');
const firebaseAdmin = require('firebase-admin');

const app = require('./src/server');

const admin = firebaseAdmin.initializeApp();

const firestore = admin.firestore();

exports.game = functions.https.onRequest(app(firestore));

exports.garbageCollector = functions.pubsub
    .schedule('every 48 hours')
    .onRun(async context => {
        const today = Date().now();
        const fourtyEightHoursAgo = new Date(today - 86400000);
        const garbageCollections = firestore
            .collection('lobbies')
            .where('createdAt', '<', fourtyEightHoursAgo);

        const querySnapshot = await garbageCollections.get();
        if (querySnapshot.empty) return;

        const batch = firestore.batch();
        querySnapshot.docs.forEach(doc => batch.delete(doc.ref));

        await batch.commit();
    });
