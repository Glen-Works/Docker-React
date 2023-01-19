import api from "../baseApi";

export const loginApi = (data: null | any) => {
    return api("post", "/v1/login/captcha", null, data)
}

export const loginCaptchaApi = () => {
    return api("get", "/v1/captcha/create/default", null, null)
}
