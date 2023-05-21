# tic-tac-toe-app

<img src="client/assets/icon.png" width="250" >

Tri-platform (iOS, android and web) online multiplayer game, built using React Native, Redux, Expo, Firestore and Firebase Cloud functions.

Play Tic Tac Toe cross-platform. Both online and in-person with your friends. We don't require you to create an account. Instead, we utilize anonymous lobby id's. Therefore only you and the one you're playing with online know who is playing with who.

<a href="https://www.buymeacoffee.com/andordavoti" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

# Get the app

-   iOS: [App Store](https://apps.apple.com/us/app/tic-tac-toe-online/id1513609441)
-   Android: [Google Play Store](https://play.google.com/store/apps/details?id=com.andordavoti.tictactoe.game)
-   web (PWA): [tictactoe.no](https://tictactoe.no/)

# Run the app locally

## Pre-requisites

### Firebase

Create a Firebase project, and create a Firestore DB as well as upload the Cloud Functions found in the server folder. Then, add the google-services.json and GoogleService-Info.plist files to the root of the project.

### Environment variables

See the env.d.ts file located in the types folder for the required environment variables. The GOOGLE_SERVICES_JSON and GOOGLE_SERVICES_PLIST variables should be the base64 encoded versions of the google-services.json and GoogleService-Info.plist files. These are only required if you want to build it with EAS.

The base64 encoded versions of the files can be generated with the following commands:

```sh
base64 -i ./google-services.json
base64 -i ./GoogleService-Info.plist
```

### Install dependencies

Go into the client folder:

```sh
cd client
```

**Install dependencies with yarn:**

```sh
yarn
```

### Start the app

**Run on Android:**

```sh
yarn android
```

**Run on iOS:**

```sh
yarn ios
```

**Run on web:**

```sh
yarn web
```

# Deployment

The app uses EAS for building the iOS and Android apps. The web app is deployed to Firebase Hosting.

You need to push the .env file contents to the EAS secrets. First make sure to have the EAS CLI installed, and all the environment variables set as described in the section above, then run:

```sh
yarn eas-push-env
```

## iOS

Uses [EAS](https://expo.dev/eas), install the CLI first, then run:

```sh
yarn build:ios
```

To build locally, run:

```sh
yarn build:ios:local
```

## Android

Uses [EAS](https://expo.dev/eas), install the CLI first, then run:

```sh
yarn build:android
```

To build locally, run:

```sh
yarn build:android:local
```

# Authors

-   [Andor Davoti](https://github.com/andordavoti)
-   [Sanna Jammeh](https://github.com/sannajammeh)
