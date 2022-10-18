
import { Box } from '@mui/material';
import { FC, ReactNode, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthStateContext } from "src/contexts/AuthContext";
import { jwtAuthMiddleware } from "src/middleware/jwtAuthMiddleware";
import { removeCookieUserInfo } from "src/stores/reducer/authReducer";

interface JwtAuthBaseChild {
    children?: ReactNode;
}


const AuthLayout: FC<JwtAuthBaseChild> = ({ children }) => {

    let navigate = useNavigate();
    const { dispatch, state } = useAuthStateContext();
    useEffect(() => {
        // STEP 1：在 useEffect 中定義 async function 取名為 fetchData
        const fetchData = async () => {
            // STEP 2：使用 Promise.all 搭配 await 等待兩個 API 都取得回應後才繼續
            const check = await jwtAuthMiddleware(dispatch, state);

            if (check == false) {
                //清除 JwtAuth
                removeCookieUserInfo();
                return navigate("/login");
            }
        };
        fetchData();
    }, []);

    return (
        <Box>
            {children || <Outlet />}
        </Box>
        // <main>{children}</main>
    )
}
export default AuthLayout;