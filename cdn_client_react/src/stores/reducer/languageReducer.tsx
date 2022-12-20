import { getCookie, setCookie } from 'src/utils/baseFunction';

const COOKIE_LANGUAGE_TYPE = "LANGUAGE_TYPE";
export const DEFAULT_LANGUAGE_TYPE = "zh-TW";

//儲存 cookie 語言資訊
export const setCookieLanguageType = (type: string) => {
    setCookie(COOKIE_LANGUAGE_TYPE, type);
}

export const initialLanguageState = () => {
    return getCookie(COOKIE_LANGUAGE_TYPE, DEFAULT_LANGUAGE_TYPE);
};

export const languageReducer = (state: any, action: string) => {
    return action;
};