import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
import { SIGNOUT_USER_SUCCESSFUL } from '../Types';




const appReducer = combineReducers({
    auth: AuthReducer,

});

const rootReducer = (state, action) => {
    // when a logout action is dispatched it will reset redux state
    if (action.type === SIGNOUT_USER_SUCCESSFUL) {
        state.auth = null;
    }

    return appReducer(state, action);
};

export default rootReducer;