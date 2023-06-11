import {Dispatch} from 'redux';

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    status: 'loading' as RequestStatusType
};

type InitialStateType = typeof initialState

export const appReducer = (state: InitialStateType = initialState, action: AppActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.payload.status};
        default:
            return state;
    }
};

const setLoadingStatusAC = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', payload: {status}} as const);


const setStatusTC = (status: RequestStatusType) => (dispatch: Dispatch) => {

};
type SetLoadingStatusActionType = ReturnType<typeof setLoadingStatusAC>

type AppActionsType = SetLoadingStatusActionType
