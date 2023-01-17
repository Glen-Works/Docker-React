import { Auth } from "src/stores/reducer/authReducer";
import api, { setAuthHeader } from "../baseApi";

export const roleListApi = (data: null | any, auth: Auth) => {
    return api("get", "/v1/role", { headers: { ...setAuthHeader(auth).headers, }, params: data }, null);
}
export const roleInfoApi = (id: number, auth: Auth) => {
    return api("get", "/v1/role/" + id, { headers: { ...setAuthHeader(auth).headers, } }, null);
}
export const roleAddApi = (data: null | any, auth: Auth) => {
    return api("post", "/v1/role", { headers: { ...setAuthHeader(auth).headers, } }, data);
}
export const roleEditApi = (id: number, data: null | any, auth: Auth) => {
    return api("put", "/v1/role/" + id, { headers: { ...setAuthHeader(auth).headers, } }, data);
}
export const roleDeleteApi = (id: number, auth: Auth) => {
    return api("delete", "/v1/role/" + id, { headers: { ...setAuthHeader(auth).headers, } }, null);
}
export const roleDeleteMultipleApi = (ids: null | any, auth: Auth) => {
    return api("delete", "/v1/role/multiple/ids", { headers: { ...setAuthHeader(auth).headers, }, params: ids }, null);
}
export const menuAllListApi = (data: null | any, auth: Auth) => {
    return api("get", "/v1/menu/all", { headers: { ...setAuthHeader(auth).headers } }, null);
}
