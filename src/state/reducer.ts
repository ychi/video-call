import type {State, Connection, Session} from './default';
import ActionType from './actions';


const sessionReducer = (
    state: Session,
    action: {type: ActionType, payload: any} 
):Session =>{
    switch(action.type) {
        case ActionType.SET_SESSION_LIVENESS:
            return {
                ...state,
                liveness: action.payload
            };
        case ActionType.SET_AUDIO_MUTE:
            return {
                ...state,
                isAudioOnMute: action.payload
            };
        default:
            return state;
    }
}

const connectionReducer = (
    state: Connection,
    action: {type: ActionType, payload: any }
):Connection => {
    switch (action.type) {
        case ActionType.SET_APP_ID:
            return {
                ...state,
                appId: String(action.payload).trim()
            };
        case ActionType.SET_UID:
            return {
                ...state,
                uid: action.payload
            };
        case ActionType.SET_CAMERA:
            return {
                ...state,
                cameraId: action.payload
            };
        case ActionType.SET_CHANNEL:
            return {
                ...state,
                channel: action.payload
            };
        case ActionType.SET_CODEC:
            return {
                ...state,
                codec: action.payload
            };
        case ActionType.SET_MIC:
            return {
                ...state,
                microphoneId: action.payload
            };
        case ActionType.SET_MODE:
            return {
                ...state,
                mode: action.payload
            };
        case ActionType.SET_TOKEN:
            return {
                ...state,
                token: action.payload
            };
        default:
            return state;
    }
};

const reducer = (
    state: State,
    action: {type: ActionType, payload: any}
) => {
    return {
        ...state,
        connection: connectionReducer(state.connection, action),
        session: sessionReducer(state.session, action),
    };
}

export default reducer;