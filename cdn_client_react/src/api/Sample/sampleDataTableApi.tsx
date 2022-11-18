import { Auth } from "src/stores/reducer/authReducer";
import api, { setAuthHeader } from "../baseApi";

export const userListApi = (data: null | any, auth: Auth) => {
    return api("get", "/api/v1/user", { headers: { ...setAuthHeader(auth).headers, }, params: data }, null);
}
export const userInfoApi = (id: number, auth: Auth) => {
    return api("get", "/api/v1/user/" + id, { headers: { ...setAuthHeader(auth).headers, } }, null);
}
export const userAddApi = (data: null | any, auth: Auth) => {
    return api("post", "/api/v1/user", { headers: { ...setAuthHeader(auth).headers, } }, data);
}
export const userEditApi = (id: number, data: null | any, auth: Auth) => {
    return api("put", "/api/v1/user/" + id, { headers: { ...setAuthHeader(auth).headers, } }, data);
}
export const userPwdEditApi = (id: number, data: null | any, auth: Auth) => {
    return api("patch", "/api/v1/user/password/" + id, { headers: { ...setAuthHeader(auth).headers, } }, data);
}
export const userDeleteApi = (id: number, auth: Auth) => {
    return api("delete", "/api/v1/user/" + id, { headers: { ...setAuthHeader(auth).headers, } }, null);
}
