import api from "../baseApi";

export const loginApi = (data: null | any) => {
    return api("post", "/v1/login", null, data)
}
