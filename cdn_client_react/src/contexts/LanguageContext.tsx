import { createContext, useContext, useEffect, useReducer, useState } from "react";
import { IntlProvider } from "react-intl";
import api from "src/api/baseApi";
import { laguageMap } from "src/layouts/SidebarLayout/Header/LanguageBox";
import { languageReducer } from "src/stores/reducer/languageReducer";

const LanguageContext = createContext<any>(null);

export default function LanguageState({ children }: any) {
    const [state, dispatch] = useReducer(languageReducer, "zh-TW");

    const [lang, setLang] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            const url = process.env.NODE_ENV === 'development' ? process.env.REACT_APP_DYNAMIC_UPDATE_BASEURL : process.env.REACT_APP_PRODUCTION_BASE_URL;
            const resp = await api("get", `${url}/static/lang/${laguageMap[state].value}.json`, {}, null).then(res => {
                setLang(res);
            }).catch(error => {
                console.log("error:" + error.response);
            });
        };
        fetchData();

    },);

    //locale 參考：https://pjchender.dev/webapis/webapis-intl/ 、 https://www.w3schools.com/jsref/jsref_tolocalestring_number.asp

    return (
        <LanguageContext.Provider value={{ state, dispatch }}>
            <IntlProvider
                messages={lang}
                locale={state}
                defaultLocale="zh-TW"
            >
                {children}
            </IntlProvider>
        </LanguageContext.Provider>
    );
}

export function useLanguageContext() {
    return useContext(LanguageContext);
}