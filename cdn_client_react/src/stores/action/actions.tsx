import { Auth, initialState, removeCookieUserInfo, setCookieUserInfo } from "src/stores/reducer/authReducer";


export default function SetUserInfo(dispatch: any, data: Auth) {
    try {
        dispatch({ type: 'REQUEST_LOGIN' });
        if (data.userInfo != null && data.authorisation != null) {
            dispatch({ ...data, type: 'LOGIN_SUCCESS' });
            setCookieUserInfo({ ...data, type: 'LOGIN_SUCCESS' });
            // return data;
            return;
        }

        dispatch({ ...initialState(), type: 'LOGIN_ERROR' });
        return;
    } catch (error) {
        dispatch({ ...initialState(), type: 'LOGIN_ERROR', msg: String(error) });
    }
}

export function logoutRemoveCookie(dispatch: any) {
    removeCookieUserInfo();
    dispatch({ type: 'LOGOUT' });
}