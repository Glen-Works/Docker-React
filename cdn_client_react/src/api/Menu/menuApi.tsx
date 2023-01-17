import { Auth } from "src/stores/reducer/authReducer";
import api, { setAuthHeader } from "../baseApi";

export const menuListApi = (data: null | any, auth: Auth) => {
    return api("get", "/v1/menu", { headers: { ...setAuthHeader(auth).headers, }, params: data }, null);
}
export const menuAllListApi = (data: null | any, auth: Auth) => {
    return api("get", "/v1/menu/all", { headers: { ...setAuthHeader(auth).headers } }, null);
}
export const menuInfoApi = (id: number, auth: Auth) => {
    return api("get", "/v1/menu/" + id, { headers: { ...setAuthHeader(auth).headers, } }, null);
}
export const menuAddApi = (data: null | any, auth: Auth) => {
    return api("post", "/v1/menu", { headers: { ...setAuthHeader(auth).headers, } }, data);
}
export const menuEditApi = (id: number, data: null | any, auth: Auth) => {
    return api("put", "/v1/menu/" + id, { headers: { ...setAuthHeader(auth).headers, } }, data);
}
export const menuDeleteMultipleApi = (ids: null | any, auth: Auth) => {
    return api("delete", "/v1/menu/multiple/ids", { headers: { ...setAuthHeader(auth).headers, }, params: ids }, null);
}
export const menuDeleteApi = (id: number, auth: Auth) => {
    return api("delete", "/v1/menu/" + id, { headers: { ...setAuthHeader(auth).headers, } }, null);
}
