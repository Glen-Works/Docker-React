import axios, { AxiosRequestConfig, AxiosResponseHeaders } from 'axios';
import { Auth } from "src/stores/reducer/authReducer";

const timeout = Number(process.env.TIME_OUT) ?? 5000;
const devBaseURL = process.env.REACT_APP_DEVELOP_BASEURL;
const proBaseURL = process.env.REACT_APP_PRODUCTION_BASE_URL;
const baseUrl = process.env.NODE_ENV === 'development' ? devBaseURL : proBaseURL;

// export const fileURL = baseUrl + "/file/"
// export const pageSizeOption = process.env.REACT_APP_PAGE_SIZE.split(",").map(Number);

export const pageSizeOption = () => {
    let pageSize: string = process.env.REACT_APP_PAGE_SIZE;
    return pageSize.split(",").map(Number);
};

export const pageSizeDefault = Number(process.env.REACT_APP_PAGE_SIZE_DEFAULT);


const instance = axios.create({
    timeout: timeout,
    baseURL: baseUrl,
    headers: { 'Content-Type': 'application/json' },
    responseType: 'json',
})

instance.interceptors.request.use(config => {
    // 1.傳送網路請求時，在頁面中新增一個loading元件作為動畫；

    // 2.某些網路請求要求使用者必須登入，可以在請求中判斷是否攜帶了token，沒有攜帶token直接跳轉到login頁面；

    // 3.對某些請求引數進行序列化；

    return config;
}, err => {
    return err;
})

export interface AxiosResponse<T = any, D = any> {
    data: T;
    msg?: string;
    success: boolean;
    status: number;
    statusText: string;
    headers: AxiosResponseHeaders;
    config: AxiosRequestConfig<D>;
    request?: any;
}

instance.interceptors.response.use(
    response => {
        let data: AxiosResponse = { ...response.data, msg: response.data.message, success: response.data.success };
        return data;
    }
    // }, err => {
    //     if (err && err.response) {
    //         switch (err.response.status) {
    //             case 400:
    //                 err.message = "請求錯誤";
    //                 break;
    //             case 401:
    //                 err.message = "未授權訪問";
    //                 break;
    //             case 404:
    //                 console.log("你要找的頁面不存在")
    //                 // go to 404 page
    //                 break
    //             case 500:
    //                 console.log("程式發生問題")
    //                 // go to 500 page
    //                 break
    //             default:
    //                 console.log(err.message)
    //         }
    //     }
    //     return err;
);

// 此處的instance為我們create的實體
export default function api(method: string, url: string, config: AxiosRequestConfig<null> | any, data: null | any = null) {
    method = method.toLowerCase();
    switch (method) {
        case "post":
            // console.log(instance.getUri());
            return instance.post(url, data, config);
        case "get":
            return instance.get(url, config);
        case "delete":
            return instance.delete(url, config);
        case "put":
            return instance.put(url, data, config);
        case "patch":
            return instance.patch(url, data, config);
        // default:
        //     console.log(`未知的 method: ${method}`);
        //     return false;
    }
}

export const setAuthHeader = (auth: Auth) => {
    return { headers: { Authorization: "Bearer " + auth.authorisation?.accessToken ?? "" } };
}

//todo Language set by sidebar , need use useReducer setting in header
// type Language = 'En' | 'Tw';
// export const setAuthHeader = (auth: Auth, lang: Language = "Tw") => {
//     return { headers: { Authorization: "Bearer " + auth.authorisation?.accessToken ?? "", Language: lang } };
// }
