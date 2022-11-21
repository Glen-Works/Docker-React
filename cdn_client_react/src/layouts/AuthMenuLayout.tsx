
import { Box } from '@mui/material';
import { FC, ReactNode, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthStateContext } from "src/contexts/AuthContext";
import { AuthMenuMiddleware } from 'src/middleware/AuthMenuMiddleware';

interface AuthMenuBaseChild {
    children?: ReactNode;
}

interface RouterList {
    [key: string]: string
}

const routerList: RouterList = {
    "user_page": 'user',
    "role_page": 'menu',
    "menu_page": 'role',
}


const AuthMenuLayout: FC<AuthMenuBaseChild> = ({ children }) => {

    let navigate = useNavigate();
    const { dispatch, state } = useAuthStateContext();
    useEffect(() => {
        // STEP 1：在 useEffect 中定義 async function 取名為 fetchData
        const fetchData = async () => {
            // STEP 2：使用 Promise.all 搭配 await 等待兩個 API 都取得回應後才繼續
            const check = await AuthMenuMiddleware(state);

            if (check == false) {
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
export default AuthMenuLayout;