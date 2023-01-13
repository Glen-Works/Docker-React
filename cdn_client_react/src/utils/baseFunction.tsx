import { LanguageType } from "src/stores/reducer/languageReducer";
import Cookies from "universal-cookie";

export function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value) ?? "";
}

//樹狀資料 
interface TreeBase {
  id: number;
  parent: number;
  children?: any[];
}

export function makeRecursionTree<T extends TreeBase>(menuList: T[], parent: number = 0): T[] {

  let menuTree: T[] = [];
  for (let value of menuList) {
    if (value.parent == parent) {
      value.children = makeRecursionTree(menuList, value.id);
      menuTree.push(value);
    }
  }
  return menuTree;
}

//儲存 cookie 
export function setCookie(cookieName: string, data: any) {
  const cookies = new Cookies();
  cookies.set(cookieName, data, {
    path: process.env.REACT_APP_COOKIE_PATH,
    maxAge: Number(process.env.REACT_APP_DEFAULT_BASE_CONFIG_COOKIE_TIME), // Expires after 5 minutes
    sameSite: true,
  });
}

//刪除 cookie by name
export function removeCookie(cookieName: string) {
  const cookies = new Cookies();
  cookies.remove(cookieName);
}

//獲取 cookie
export function getCookie(cookieName: string, defaultValue: any) {
  const cookies = new Cookies();
  if (cookies.get(cookieName)) {
    defaultValue = cookies.get(cookieName);
  }
  return defaultValue;
}

export function validEmail(email: string): boolean {
  const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return expression.test(email);
}


export interface MapStyleBase {
  [key: number | string]: { label: { [language in LanguageType]: string }, color: "primary" | "secondary" | "error" | "black" | "warning" | "success" | "info" }
}

export const statusMap: MapStyleBase = {
  0: { label: { "es-US": 'disabled', "zh-CN": '停用', "zh-TW": '停用' }, color: 'error' },
  1: { label: { "es-US": 'enable', "zh-CN": '启用', "zh-TW": '啟用' }, color: 'primary' }
}

