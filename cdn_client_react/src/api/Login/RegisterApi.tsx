import api from "../baseApi";

export const registerApi = (data: null | any) => {
    return api("post", "/v1/register", null, data);
}

export const registerValidApi = (account: string) => {
    return api("get", "/v1/register/validation/" + account, null, null);
}
