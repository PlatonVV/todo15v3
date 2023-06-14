import {ResultCode, todolistsAPI, TodolistType} from '../../api/todolists-api';
import {Dispatch} from 'redux';
import {RequestStatusType, setLoadingStatusAC, SetLoadingStatusActionType} from '../../app/app-reducer';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';

const initialState: Array<TodolistDomainType> = [];

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ToDoListActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.id);
        case 'ADD-TODOLIST':
            return [{...action.todolist, filter: 'all', entityStatus: 'idle'}, ...state];
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl);
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl);
        case 'SET-TODOLISTS':
            return action.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}));
        case 'CHANGE-ENTITY-STATUS':
            return state.map(tl => tl.id === action.toDoId ? {...tl, entityStatus: action.entityStatus} : tl);
        default:
            return state;
    }
};

// actions
export const removeTodolistAC = (id: string) => ({type: 'REMOVE-TODOLIST', id} as const);
export const changeEntityStatusAC = (toDoId: string, entityStatus: RequestStatusType) => ({
    type: 'CHANGE-ENTITY-STATUS',
    toDoId,
    entityStatus
} as const);

export const addTodolistAC = (todolist: TodolistType) => ({type: 'ADD-TODOLIST', todolist} as const);
export const changeTodolistTitleAC = (id: string, title: string) => ({
    type: 'CHANGE-TODOLIST-TITLE',
    id,
    title
} as const);
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) => ({
    type: 'CHANGE-TODOLIST-FILTER',
    id,
    filter
} as const);
export const setTodolistsAC = (todolists: Array<TodolistType>) => ({type: 'SET-TODOLISTS', todolists} as const);

// thunks
export const fetchTodolistsTC = () => {
    return (dispatch: Dispatch<ToDoListActionsType>) => {
        dispatch(setLoadingStatusAC('loading'));
        todolistsAPI.getTodolists()
            .then((res) => {
                dispatch(setTodolistsAC(res.data));
                dispatch(setLoadingStatusAC('succeeded'));
            });

    };
};
export const removeTodolistTC = (todolistId: string) => {
    return (dispatch: Dispatch<ToDoListActionsType>) => {
        dispatch(setLoadingStatusAC('loading'));
        dispatch(changeEntityStatusAC(todolistId, 'loading'));
        todolistsAPI.deleteTodolist(todolistId)
            .then((res) => {
                dispatch(removeTodolistAC(todolistId));
                dispatch(setLoadingStatusAC('succeeded'));
            })
            .catch(() => {
                dispatch(changeEntityStatusAC(todolistId, 'failed'));
            });
    };
};
export const addTodolistTC = (title: string) => {
    return (dispatch: Dispatch<ToDoListActionsType>) => {
        dispatch(setLoadingStatusAC('loading'));
        todolistsAPI.createTodolist(title)
            .then((res) => {
                if (res.data.resultCode === ResultCode.SUCCESS) {
                    dispatch(addTodolistAC(res.data.data.item));
                    dispatch(setLoadingStatusAC('succeeded'));
                } else {
                    handleServerAppError<{ item: TodolistType }>(dispatch, res.data);
                }
            })
            .catch((e) => {
                handleServerNetworkError(dispatch, e.message);
            });
    };
};
export const changeTodolistTitleTC = (id: string, title: string) => {
    return (dispatch: Dispatch<ToDoListActionsType>) => {
        dispatch(setLoadingStatusAC('loading'));
        todolistsAPI.updateTodolist(id, title)
            .then((res) => {
                dispatch(changeTodolistTitleAC(id, title));
                dispatch(setLoadingStatusAC('succeeded'));
            });
    };
};

// types
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>;
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>;
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>;
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}
type ToDoListActionsType =
    | RemoveTodolistActionType
    | AddTodolistActionType
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | ReturnType<typeof changeEntityStatusAC>
    | SetTodolistsActionType
    | SetLoadingStatusActionType
