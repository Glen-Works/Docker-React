import api, { setAuthHeader } from "src/api/baseApi";
import { Auth } from "src/stores/reducer/authReducer";

export const logoutApi = (auth: Auth) => {
    return api("get", "/v1/logout", { headers: { ...setAuthHeader(auth).headers, } }, null);
}