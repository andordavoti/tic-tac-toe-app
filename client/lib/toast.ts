import Toast from 'react-native-tiny-toast';

export const showToast = (text: string, duration = Toast.duration.SHORT) => {
    Toast.show(text, {
        position: -100,
        containerStyle: {
            borderRadius: 20,
            backgroundColor: '#EEEEEE',
        },
        textStyle: {
            color: 'black',
        },
        duration,
    });
};
