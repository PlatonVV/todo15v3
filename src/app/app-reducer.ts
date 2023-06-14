export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    status: 'loading' as RequestStatusType,
    error: null as null | string
};

type InitialStateType = typeof initialState

export const appReducer = (state: InitialStateType = initialState, action: AppActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.payload.status};
        case 'APP/SET-ERROR':
            return {...state, error: action.payload.error}
        default:
            return state;
    }
};

export const setLoadingStatusAC = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', payload: {status}} as const);
export const setErrorAC = (error: null | string) => ({type: 'APP/SET-ERROR', payload: {error}} as const);

export type SetLoadingStatusActionType = ReturnType<typeof setLoadingStatusAC>
export type SetErrorACType = ReturnType<typeof setErrorAC>

type AppActionsType = SetLoadingStatusActionType | SetErrorACType
