import React, { ComponentProps, ReactNode } from 'react';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type BaseToastProps = ComponentProps<typeof BaseToast>;
type ErrorToastProps = ComponentProps<typeof ErrorToast>;

const TOAST_WIDTH = 250;
const TOAST_HEIGHT = 56;

export const toastConfig = {
    info: (props: BaseToastProps): ReactNode => (
        <BaseToast
            {...props}
            style={{
                alignItems: 'center',
                borderRadius: 40,
                borderLeftColor: 'white',
                paddingLeft: 8,
                width: TOAST_WIDTH,
                height: TOAST_HEIGHT,
            }}
            contentContainerStyle={{ paddingHorizontal: 8 }}
            text1NumberOfLines={3}
            text2NumberOfLines={3}
            renderLeadingIcon={() => (
                <MaterialCommunityIcons
                    name="alert-circle-outline"
                    size={25}
                    color="black"
                />
            )}
        />
    ),
    error: (props: ErrorToastProps): ReactNode => (
        <ErrorToast
            {...props}
            style={{
                alignItems: 'center',
                borderRadius: 40,
                borderLeftColor: 'white',
                paddingLeft: 8,
                width: TOAST_WIDTH,
                height: TOAST_HEIGHT,
            }}
            contentContainerStyle={{ paddingHorizontal: 8 }}
            text1NumberOfLines={3}
            text2NumberOfLines={3}
            renderLeadingIcon={() => (
                <MaterialCommunityIcons
                    name="alert-circle"
                    size={25}
                    color="#FF3E41"
                />
            )}
        />
    ),
};

export const showInfoToast = (title: string, description?: string): void => {
    Toast.show({
        text1: title,
        text2: description,
        position: 'top',
        type: 'info',
        topOffset: 55,
        visibilityTime: 2000,
    });
};

export const showErrorToast = (title: string, description?: string): void => {
    Toast.show({
        text1: title,
        text2: description,
        position: 'top',
        type: 'error',
        topOffset: 55,
        visibilityTime: 5000,
    });
};
