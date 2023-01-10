import { createContext, useContext, useReducer } from "react";
import { alertReducer, initialAlertState } from "src/stores/reducer/alertReducer";

const AlertContext = createContext<any>({ state: initialAlertState });
AlertContext.displayName = 'AlertContext'

export interface AlertPayload {
    text: string,
    title: string,
    type: "success" | "warning" | "info" | "error",
    id: string,
}

export default function AlertContextState({ children }: any) {
    const [state, dispatch] = useReducer(alertReducer, initialAlertState)

    const actions = {
        addAlert: (payload: AlertPayload) => {
            dispatch({ type: 'ADD_ALERT', payload })
        },
        removeAlert: (payload) => {
            dispatch({ type: 'REMOVE_ALERT', payload })
        }
    }

    return (
        <AlertContext.Provider value={{ state: state, actions: actions }}>
            {children}
        </AlertContext.Provider>
    );
}

export function useAlertContext() {
    return useContext(AlertContext);
}

