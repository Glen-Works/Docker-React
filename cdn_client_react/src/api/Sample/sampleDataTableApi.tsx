import { Auth } from "src/stores/reducer/authReducer";
import api, { setAuthHeader } from "../baseApi";

export const userListApi = (data: null | any, auth: Auth) => {
    return api("get", "/user", { headers: { ...setAuthHeader(auth).headers, }, params: data }, null)
}
