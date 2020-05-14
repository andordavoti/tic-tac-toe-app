import React from 'react';
import Spinner from './Spinner';

interface PropTypes {
  loading: boolean;
  msg: string;
}

const withSpinner = (WrappedComponent: React.FC) => ({
  loading = true,
  msg,
  ...props
}: PropTypes) => (loading ? <Spinner msg={msg} /> : <WrappedComponent {...props} />);

export default withSpinner;
