import secureLocalStorage from "react-secure-storage";

interface UserInfo {
    "id": number,
    "name": string
}

interface AuthorityJwt {
    "accessToken": string,
    "refreshToken": string
}

export interface Auth {
    userInfo?: UserInfo | null,
    authorisation?: AuthorityJwt | null,
    msg?: string,
    type?: string,
    loading?: boolean
}


const COOKIE_USER_INFO = "USER_INFO";

//儲存 cookie 登入資訊
export const setCookieUserInfo = (data: Auth) => {
    secureLocalStorage.setItem(COOKIE_USER_INFO, data);
    // setCookie(COOKIE_USER_INFO, JSON.stringify(data));
}

//刪除 cookie 登入資訊
export const removeCookieUserInfo = () => {
    secureLocalStorage.removeItem(COOKIE_USER_INFO);
    // removeCookie(COOKIE_USER_INFO);
}

export const initialState = () => {
    let data = secureLocalStorage.getItem(COOKIE_USER_INFO);
    if (typeof data === "object") {
        return data;
    }
    let userAuth: Auth = {
        userInfo: null,
        authorisation: null,
        msg: "",
        type: "",
        loading: false,
    };

    return userAuth;
};

export const AuthReducer = (state: any, action: Auth) => {
    switch (action.type) {
        case "REQUEST_LOGIN":
            return {
                ...state,
                loading: true
            };
        case "LOGIN_SUCCESS":
            return {
                ...state,
                userInfo: action.userInfo,
                authorisation: action.authorisation,
                loading: false
            };
        case "LOGOUT":
            return {
                ...state,
                userInfo: null,
                authorisation: null
            };

        case "LOGIN_ERROR":
            return {
                ...state,
                loading: false,
                msg: action.msg
            };

        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
};