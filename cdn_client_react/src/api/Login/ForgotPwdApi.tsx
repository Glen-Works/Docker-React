import api from "../baseApi";

export const forgotPwdApi = (data: null | any) => {
    return api("post", "/api/v1/password/forgot", null, data);
}

export const forgotPwdValidApi = (data: null | any, account: string) => {
    return api("get", "/api/v1/password/forgot/validation/" + account, { params: data }, null);
}
