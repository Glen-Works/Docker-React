
import api, { AxiosResponse, setAuthHeader } from "src/api/baseApi";
import setUserInfo from "src/stores/action/authActions";
import { Auth } from "src/stores/reducer/authReducer";

// 身份驗證
export const jwtAuthMiddleware = async (dispatch, auth: Auth): Promise<boolean> => {

    //無 token 踢出
    var jwt: string = auth.authorisation?.accessToken ?? "";
    if (jwt == "" || jwt.length < 10) {
        //跳回 login 頁面
        // console.log("無 token");
        return false;
    }

    //期限少於半小時 更新 token
    var expireCheck: boolean = jwtExpireCheck(jwt);
    if (!expireCheck) {
        //refresh token 更新
        if (await jwtRefesh(dispatch, auth)) {
            // 成功  return true;
            // console.log("refresh token 更新成功");
            return true;
        };
        // 失敗  return false;
        console.log("refresh token 更新失敗");
        return false;
    }

    //無法刷新 token，跳回login 頁面
    return jwtValidate(auth);
}

//更新 時間
export async function jwtRefesh(dispatch, auth: Auth): Promise<boolean> {

    console.log({ params: { refreshtoken: auth.authorisation?.refreshToken } });
    var apiData = api("get", "/api/v1/jwt", { params: { refreshtoken: auth.authorisation?.refreshToken } }, null);
    var returnBool = false
    try {
        return await apiData?.then(res => {
            setUserInfo(dispatch, res.data);
            // console.log("更新 jwt成功");
            return Promise.resolve(true);
        }).catch(error => {
            console.log(error);
            console.log("更新 jwt失敗");
            return Promise.resolve(false);
        });
    } catch (error) {
        return Promise.resolve(returnBool);
    }
}

//驗證 jwt
export async function jwtValidate(auth: Auth): Promise<boolean> {
    var apiData = api("get", "/api/v1/jwt/check", setAuthHeader(auth), null);
    var returnBool = false
    try {
        return await apiData?.then((res: AxiosResponse) => {
            if (res.success) {
                // console.log("驗證 jwt成功");
                return Promise.resolve(true);
            }
        }).catch(error => {
            // console.log("驗證 jwt失敗");
            console.log(error);
            return Promise.resolve(false);
        });
    } catch (error) {
        return Promise.resolve(returnBool);
    }
}

//驗證時間 期限少於 DEFAULT_JWT_CHECKED_TIME 內 return false
function jwtExpireCheck(jwt: string): boolean {
    //get jwt data
    var arrJwt: string[] = jwt.split(".");

    //生存時間驗證
    var jwtData = atob(arrJwt[1]);
    var jwtExpire: number = Number(JSON.parse(jwtData).exp) - Number(process.env.REACT_APP_DEFAULT_JWT_CHECKED_TIME);
    var timestampNow: number = Math.floor(Date.now() / 1000);

    if (timestampNow < jwtExpire) {
        return true;
    }

    return false;
}


