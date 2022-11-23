
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
    "/500",
    "/404",
]

// 功能對照表 
export const featureList = [
    "user_list",                //使用者清單
    "user_info",                //使用者資訊
    "user_create",              //使用者新增
    "user_update",              //使用者修改
    "user_delete",              //使用者刪除
    "user_password_update",     //使用者密碼修改
    "role_list",                //權限清單
    "role_info",                //權限資訊
    "role_create",              //權限新增
    "role_update",              //權限修改
    "role_delete",              //權限刪除
    "menu_list",                //菜單清單
    "menu_info",                //菜單資訊
    "menu_create",              //菜單新增
    "menu_update",              //菜單修改
    "menu_delete",              //菜單刪除
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
export const validAuthMenuFeature = (menuList: Menu[], key: string): boolean => {
    // 權限頁面
    for (let index = 0; index < menuList.length; index++) {
        const item = menuList[index];
        if (item.feature == "F" && item.key == key) {
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

