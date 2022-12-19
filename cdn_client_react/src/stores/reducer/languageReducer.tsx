import Cookies from 'universal-cookie';

const cookieLanguageType = "LANGUAGE_TYPE";
export const defaultLanguageTyple = "zh-TW";

//儲存 cookie 語言資訊
export const setCookieLanguageType = (type: string) => {
    const cookies = new Cookies();
    cookies.set(cookieLanguageType, type, {
        path: process.env.REACT_APP_COOKIE_PATH,
        maxAge: Number(process.env.REACT_APP_DEFAULT_BASE_CONFIG_COOKIE_TIME), // Expires after 5 minutes
        sameSite: true,
    });
}

export const initialLanguageState = () => {
    let LanguageType: string = defaultLanguageTyple;
    const cookies = new Cookies();
    if (cookies.get(cookieLanguageType)) {
        LanguageType = cookies.get(cookieLanguageType);
    }
    return LanguageType;
};

export const languageReducer = (state: any, action: string) => {
    return action;
};