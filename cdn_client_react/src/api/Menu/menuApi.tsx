import { Auth } from "src/stores/reducer/authReducer";
import api, { setAuthHeader } from "../baseApi";

export const menuListApi = (data: null | any, auth: Auth) => {
    return api("get", "/api/v1/menu", { headers: { ...setAuthHeader(auth).headers, }, params: data }, null);
}
export const menuInfoApi = (id: number, auth: Auth) => {
    return api("get", "/api/v1/menu/" + id, { headers: { ...setAuthHeader(auth).headers, } }, null);
}
export const menuAddApi = (data: null | any, auth: Auth) => {
    return api("post", "/api/v1/menu", { headers: { ...setAuthHeader(auth).headers, } }, data);
}
export const menuEditApi = (id: number, data: null | any, auth: Auth) => {
    return api("put", "/api/v1/menu/" + id, { headers: { ...setAuthHeader(auth).headers, } }, data);
}
export const menuDeleteApi = (id: number, auth: Auth) => {
    return api("delete", "/api/v1/menu/" + id, { headers: { ...setAuthHeader(auth).headers, } }, null);
}
