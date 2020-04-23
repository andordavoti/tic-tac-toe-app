import Toast from 'react-native-tiny-toast'

export const showToast = (text) => {
    Toast.show(text, {
        position: -100,
        containerStyle: {
            borderRadius: 20,
            backgroundColor: '#EEEEEE',
        },
        textStyle: {
            color: 'black'
        }
    })
}