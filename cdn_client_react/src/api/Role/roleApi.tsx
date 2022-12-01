import { Auth } from "src/stores/reducer/authReducer";
import api, { setAuthHeader } from "../baseApi";

export const roleListApi = (data: null | any, auth: Auth) => {
    return api("get", "/api/v1/role", { headers: { ...setAuthHeader(auth).headers, }, params: data }, null);
}
export const roleInfoApi = (id: number, auth: Auth) => {
    return api("get", "/api/v1/role/" + id, { headers: { ...setAuthHeader(auth).headers, } }, null);
}
export const roleAddApi = (data: null | any, auth: Auth) => {
    return api("post", "/api/v1/role", { headers: { ...setAuthHeader(auth).headers, } }, data);
}
export const roleEditApi = (id: number, data: null | any, auth: Auth) => {
    return api("put", "/api/v1/role/" + id, { headers: { ...setAuthHeader(auth).headers, } }, data);
}
export const roleDeleteApi = (id: number, auth: Auth) => {
    return api("delete", "/api/v1/role/" + id, { headers: { ...setAuthHeader(auth).headers, } }, null);
}
export const menuAllListApi = (data: null | any, auth: Auth) => {
    return api("get", "/api/v1/menu/all", { headers: { ...setAuthHeader(auth).headers } }, null);
}
