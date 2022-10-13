import api from "./baseApi";

export const loginApi = (data: null | any) => {
    return api("post", "/login", null, data)
}
