import { LOGIN_SUCCESS, LOGIN_FAIL, LOADING_USER, SIGNOUT_USER_FAIL, SIGNOUT_USER, SIGNOUT_USER_SUCCESSFUL } from '../Types';

const INITIAL_STATE = {
    loading: false,
    error: [],
    userData: {},
    loggedIn: false,
    verifyToken: '',

};

export default (state = INITIAL_STATE, { type, payload }) => {
    switch (type) {
        case LOADING_USER:
            return { ...state, loading: true, error: [] };
        case LOGIN_SUCCESS:
            return { ...state, userData: payload, loading: false, loggedIn: true };
        case LOGIN_FAIL:
            return { ...state, error: payload, userData: {}, loading: false };
        case SIGNOUT_USER:
            return { ...state, loggedIn: false, userData: {}, verifyToken: '', businessProfile: "", autoLoginDetails: "" }
        case SIGNOUT_USER_SUCCESSFUL:
            return { ...state, loading: false, loggedIn: false, userData: {} }
        case SIGNOUT_USER_FAIL:
            return { ...state, error: payload };
        default:
            return state;
    }
};