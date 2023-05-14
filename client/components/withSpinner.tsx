import React from 'react';
import Spinner from './Spinner';

interface PropTypes {
    loading: boolean;
    msg: string;
}

const withSpinner =
    <P extends object>(
        WrappedComponent: React.ComponentType<P>
    ): React.FC<P & PropTypes> =>
    ({ loading = true, msg, ...props }: PropTypes) =>
        loading ? (
            <Spinner msg={msg} />
        ) : (
            <WrappedComponent {...(props as P)} />
        );

export default withSpinner;
