import {setErrorAC, SetErrorACType, setLoadingStatusAC, SetLoadingStatusActionType} from '../app/app-reducer';
import {Dispatch} from 'redux';
import {ResponseType} from '../api/todolists-api';

export const handleServerAppError = <T>(dispatch: Dispatch<ErrorUtilsDispatchType>, data: ResponseType<T>)=>{
    if (data.messages.length) {
        dispatch(setErrorAC(data.messages[0]));
    } else {
        dispatch(setErrorAC('Contact Support please'));
    }
    dispatch(setLoadingStatusAC('failed'));
}


export const handleServerNetworkError = (dispatch: Dispatch<ErrorUtilsDispatchType>, error: string) => {
    dispatch(setErrorAC(error));
    dispatch(setLoadingStatusAC('failed'))
}

type ErrorUtilsDispatchType = SetLoadingStatusActionType | SetErrorACType
