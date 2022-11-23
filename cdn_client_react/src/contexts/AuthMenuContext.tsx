import { createContext, useContext, useReducer } from "react";
import { AuthMenuReducer } from "src/stores/reducer/authMenuReducer";

const AuthMenuContext = createContext<any>(null);

export default function UseAuthMenuState({ children }: any) {
    const [state, dispatch] = useReducer(AuthMenuReducer, null);

    return (
        <AuthMenuContext.Provider value={{ state, dispatch }}>
            {children}
        </AuthMenuContext.Provider>
    );
}

export function useAuthMenuContext() {
    return useContext(AuthMenuContext);
}

