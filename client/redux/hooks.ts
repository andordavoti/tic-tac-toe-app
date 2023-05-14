import { useSelector, useDispatch, TypedUseSelectorHook } from 'react-redux';
import { AppDispatch, RootState } from './store';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
