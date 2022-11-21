
import api, { setAuthHeader } from "src/api/baseApi";
import { Auth } from "src/stores/reducer/authReducer";

interface Menu {
    feature: "T" | "P" | "F",
    id: number,
    key: string,
    name: string,
    parent: number,
    status: number,
    url: string,
    weight: number,
}

// 身份驗證
export const AuthMenuMiddleware = async (auth: Auth): Promise<boolean> => {

    let MenuList: Menu[];
    // var apiData = 
    await api("get", "/api/v1/auth/menu", setAuthHeader(auth), null)
        .then(res => {
            MenuList = res.data;
            console.log(MenuList);
        })
        .catch(error => {
            console.log("error:" + error.response?.data?.msg);
        });

    return Promise.resolve(true);
}


