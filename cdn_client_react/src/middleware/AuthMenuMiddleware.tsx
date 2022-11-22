
import api, { setAuthHeader } from "src/api/baseApi";
import { Auth } from "src/stores/reducer/authReducer";
import { getKeyByValue } from "src/utils/baseFunction";

interface RouterList {
    [key: string]: string
}

// 權限頁面
export const routerList: RouterList = {
    "user_page": '/user',
    "role_page": '/menu',
    "menu_page": '/role',
}

// 預設頁面 (不需權限)
export const exceptUriList = [
    "/dashboard",
    "/SampleDataTable",
]

export interface Menu {
    feature: "T" | "P" | "F",
    id: number,
    key: string,
    name: string,
    parent: number,
    status: number,
    url: string,
    weight: number,
}


// 頁面權限驗證
export const authMenuMiddleware = (menuList: Menu[], uri: string): boolean => {
    // 預設頁面 (不需權限)
    for (let index = 0; index < exceptUriList.length; index++) {
        // console.log("exceptUri", exceptUriList[index]);
        const exceptUri = exceptUriList[index];
        if (exceptUri == uri) {
            return true;
        }
    }

    // 權限頁面
    for (let index = 0; index < menuList.length; index++) {
        const item = menuList[index];
        if (item.feature == "P" && item.key == getKeyByValue(routerList, uri)) {
            return true;
        }
    }
    return false;
}

// 功能權限驗證
export const validAuthMenuFeature = (menuList: Menu[], uri: string): boolean => {
    // 權限頁面
    for (let index = 0; index < menuList.length; index++) {
        const item = menuList[index];
        if (item.feature == "F" && item.key == getKeyByValue(routerList, uri)) {
            return true;
        }
    }
    return false;
}


export const getAuthMenu = async (auth: Auth): Promise<Menu[]> => {

    let menuList: Menu[];
    await api("get", "/api/v1/auth/menu", setAuthHeader(auth), null)
        .then(res => {
            menuList = res.data;
        })
        .catch(error => {
            console.log("error:" + error.response?.data?.msg);
        });

    return menuList;
}


