import api, { setAuthHeader } from "src/api/baseApi";
import { Auth } from "src/stores/reducer/authReducer";

export const userProfileInfoApi = (auth: Auth) => {
    return api("get", "/v1/user/profile/self", { headers: { ...setAuthHeader(auth).headers, } }, null);
}
export const userUpdateProfileApi = (data: null | any, auth: Auth) => {
    return api("put", "/v1/user/profile/self", { headers: { ...setAuthHeader(auth).headers, } }, data);
}
export const userUpdateProfilePasswordApi = (data: null | any, auth: Auth) => {
    return api("patch", "/v1/user/password/self", { headers: { ...setAuthHeader(auth).headers, } }, data);
}