import React from 'react'
import Spinner from './Spinner';

const withSpinner = WrappedComponent => ({ loading = true, msg, ...props }) =>
    loading ? <Spinner msg={msg} /> : <WrappedComponent {...props} />;

export default withSpinner