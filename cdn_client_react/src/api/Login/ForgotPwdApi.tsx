import api from "../baseApi";

export const forgotPwdCheckValiCodeApi = (valiCode: string) => {
    return api("get", "/v1/password/forgot/check/" + valiCode, null, null);
}

export const forgotPwdApi = (data: null | any) => {
    return api("post", "/v1/password/forgot", null, data);
}

export const forgotPwdValidApi = (data: null | any, account: string) => {
    return api("get", "/v1/password/forgot/validation/" + account, { params: data }, null);
}
