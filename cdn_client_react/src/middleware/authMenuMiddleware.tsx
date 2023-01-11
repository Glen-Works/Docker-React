
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import BrightnessLowTwoToneIcon from '@mui/icons-material/BrightnessLowTwoTone';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { SvgIconProps } from '@mui/material/SvgIcon';
import { ElementType } from 'react';
import api, { setAuthHeader } from "src/api/baseApi";
import { Auth } from "src/stores/reducer/authReducer";

interface RouterList {
    [key: string]: { uri: string, langName: string, icon: ElementType<SvgIconProps> }
}

// 權限頁面 與 Icon
export const routerList: RouterList = {
    "management": { uri: '', langName: 'router.title.management', icon: BrightnessLowTwoToneIcon },
    "user_page": { uri: '/user', langName: 'router.menu.user', icon: BrightnessLowTwoToneIcon },
    "role_page": { uri: '/role', langName: 'router.menu.role', icon: AdminPanelSettingsIcon },
    "menu_page": { uri: '/menu', langName: 'router.menu.menu', icon: MenuBookIcon },
}

// 預設頁面 (不需權限)
export const exceptUriList = [
    "/dashboard",
    "/samplecontent",
    "/sampledatatable",
    "/user/profile",
    "/500",
    "/404",
]

// 功能對照表 
const featureList = [
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

export interface MenuTree extends Menu {
    children?: Menu[]
}

// 頁面權限驗證
export const authMenuMiddleware = (menuList: Menu[], uri: string): boolean => {
    // 預設頁面 (不需權限)
    for (let index = 0; index < exceptUriList.length; index++) {
        const exceptUri = exceptUriList[index];
        if (exceptUri == uri) {
            return true;
        }
    }

    // 權限頁面
    for (let index = 0; index < menuList.length; index++) {
        const item = menuList[index];
        if (item.feature == "P" && item.key == getMenuKeyByValue(routerList, uri)) {
            return true;
        }
    }
    return false;
}

// 權限 find key by uri
export function getMenuKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key].uri === value) ?? "";
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
            //console.log("error:" + error.response?.data?.message);
        });

    return menuList;
}


export function makeMenuTree(menuList: MenuTree[], parent: number = 0): MenuTree[] {

    let menuTree: MenuTree[] = [];
    menuList.forEach(value => {
        if (value.feature == "T" && value.parent == parent) {
            value.children = makeMenuTree(menuList, value.id);
            menuTree.push(value);
        }

        if (value.feature == "P" && value.parent == parent) {
            value.children = [];
            menuTree.push(value);
        }

        return value;
    });
    return menuTree;
}
