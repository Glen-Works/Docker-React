
import { Box } from '@mui/material';
import { FC, ReactNode, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import SuspenseLoaderRouter from 'src/components/SuspenseLoaderRouter';
import { useAuthStateContext } from "src/contexts/AuthContext";
import { useAuthMenuContext } from 'src/contexts/AuthMenuContext';
import { authMenuMiddleware, getAuthMenu } from 'src/middleware/authMenuMiddleware';

interface AuthMenuBaseChild {
    children?: ReactNode;
}

const AuthMenuLayout: FC<AuthMenuBaseChild> = ({ children }) => {

    let location = useLocation();
    let navigate = useNavigate();
    const { state } = useAuthStateContext();
    const AuthMenu = useAuthMenuContext();
    const [authCheck, setAuthCheck] = useState<boolean>(false);

    useEffect(() => {
        // STEP 1：在 useEffect 中定義 async function 取名為 fetchData

        const fetchData = async () => {
            // STEP 2：使用 Promise.all 搭配 await 等待兩個 API 都取得回應後才繼續
            let menuList = await getAuthMenu(state);
            let check = authMenuMiddleware(menuList, location.pathname);
            // console.log(check);
            if (check) {
                AuthMenu.dispatch(menuList);
                setAuthCheck(true)
            } else {
                setAuthCheck(true)
                return navigate("/dashboard");
            }

        };
        fetchData();
    }, [authCheck]);

    return (
        <Box>
            {/* {console.log("authCheck:", authCheck)} */}
            {(authCheck == false) && <SuspenseLoaderRouter />}
            {authCheck && (children || <Outlet />)}
        </Box>
    )
}
export default AuthMenuLayout;