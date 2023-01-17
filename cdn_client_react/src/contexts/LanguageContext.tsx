import { createContext, useContext, useEffect, useReducer, useState } from "react";
import { IntlProvider } from "react-intl";
import { laguageMap } from "src/layouts/SidebarLayout/Header/LanguageBox";
import { DEFAULT_LANGUAGE_TYPE, initialLanguageState, languageReducer } from "src/stores/reducer/languageReducer";

const LanguageContext = createContext<any>({ state: initialLanguageState() });

export default function LanguageState({ children }: any) {
    const [state, dispatch] = useReducer(languageReducer, initialLanguageState());

    const [lang, setLang] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            const url = process.env.NODE_ENV === 'development' ? process.env.REACT_APP_DYNAMIC_UPDATE_BASEURL : "";
            await fetch(`${url}/static/lang/${laguageMap[state].value}.json`)
                .then(res => res.json())
                .then(data => {
                    setLang(data);
                }).catch(error => {
                    console.log("error:" + error.response);
                });
            // await api("get", `${url}/static/lang/${laguageMap[state].value}.json`, {}, null).then(res => {
            //     setLang(res);
            // }).catch(error => {
            //     console.log("error:" + error.response);
            // });
        };
        fetchData();

    }, [state]);

    //locale 參考：https://pjchender.dev/webapis/webapis-intl/ 、 https://www.w3schools.com/jsref/jsref_tolocalestring_number.asp

    return (
        <LanguageContext.Provider value={{ state, dispatch }}>
            <IntlProvider
                messages={lang}
                locale={state}
                defaultLocale={DEFAULT_LANGUAGE_TYPE}
            >
                {children}
            </IntlProvider>
        </LanguageContext.Provider>
    );
}

export function useLanguageContext() {
    return useContext(LanguageContext);
}