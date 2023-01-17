import { Auth } from "src/stores/reducer/authReducer";
import api, { setAuthHeader } from "../baseApi";

export const userListApi = (data: null | any, auth: Auth) => {
    return api("get", "/v1/user", { headers: { ...setAuthHeader(auth).headers, }, params: data }, null);
}
export const userInfoApi = (id: number, auth: Auth) => {
    return api("get", "/v1/user/" + id, { headers: { ...setAuthHeader(auth).headers, } }, null);
}
export const userAddApi = (data: null | any, auth: Auth) => {
    return api("post", "/v1/user", { headers: { ...setAuthHeader(auth).headers, } }, data);
}
export const userEditApi = (id: number, data: null | any, auth: Auth) => {
    return api("put", "/v1/user/" + id, { headers: { ...setAuthHeader(auth).headers, } }, data);
}
export const userPwdEditApi = (id: number, data: null | any, auth: Auth) => {
    return api("patch", "/v1/user/password/" + id, { headers: { ...setAuthHeader(auth).headers, } }, data);
}
export const userDeleteApi = (id: number, auth: Auth) => {
    return api("delete", "/v1/user/" + id, { headers: { ...setAuthHeader(auth).headers, } }, null);
}
export const userDeleteMultipleApi = (ids: null | any, auth: Auth) => {
    return api("delete", "/v1/user/multiple/ids", { headers: { ...setAuthHeader(auth).headers, }, params: ids }, null);
}
export const roleAllListApi = (id: null | any, auth: Auth) => {
    return api("get", "/v1/role/all", { headers: { ...setAuthHeader(auth).headers, } }, null);
}