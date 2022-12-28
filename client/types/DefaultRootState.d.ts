import 'react-redux';

import { RootState } from '../redux/store';

declare module 'react-redux' {
    interface DefaultRootState extends RootState {}
}
