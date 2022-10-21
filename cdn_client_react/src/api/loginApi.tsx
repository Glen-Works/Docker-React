import api from "./baseApi";

export const loginApi = (data: null | any) => {
    return api("post", "/api/v1/login", null, data)
}
