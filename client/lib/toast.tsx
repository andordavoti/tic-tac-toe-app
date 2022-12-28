import React, { ComponentProps, ReactNode } from 'react';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type BaseToastProps = ComponentProps<typeof BaseToast>;
type ErrorToastProps = ComponentProps<typeof ErrorToast>;

export const toastConfig = {
    info: (props: BaseToastProps): ReactNode => (
        <BaseToast
            {...props}
            style={{
                alignItems: 'center',
                borderRadius: 40,
                borderLeftColor: 'white',
                paddingLeft: 8,
                width: 300,
                height: 56,
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
                width: 300,
                height: 56,
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
        topOffset: 50,
        visibilityTime: 2000,
    });
};

export const showErrorToast = (title: string, description?: string): void => {
    Toast.show({
        text1: title,
        text2: description,
        position: 'top',
        type: 'error',
        topOffset: 50,
        visibilityTime: 5000,
    });
};
