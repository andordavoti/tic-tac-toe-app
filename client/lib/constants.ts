import { Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');
export const fullWidth = width;
export const fullHeight = height;
export const calcFromWidth = (value: number) => value * (width / 375.0);
export const calcFromHeight = (value: number) => value * (height / 667.0);

export const colors = {
    light: {
        main: '#689e77',
        text: '#2A2D34',
        bg: '#E6EAEB',
        warning: '#d63c09',
        disabledColumn: '#2A2D34',
        disabledButton: 'lightgrey',
    },
    dark: {
        main: '#497453',
        text: 'white',
        bg: '#2A2D34',
        warning: '#d63c09',
        disabledColumn: '#50535c',
        disabledButton: 'grey',
    },
};

export const urls = {
    andorGithub: 'https://github.com/andordavoti',
    sannaGithub: 'https://github.com/sannajammeh',
    projectGithub: 'https://github.com/andordavoti/tic-tac-toe-app',
    gameUrl: 'https://us-central1-ticktacktoe-7aa6d.cloudfunctions.net/game',
};
