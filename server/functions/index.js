const functions = require('firebase-functions');
const app = require('./src/server');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.game = functions.https.onRequest(app);
