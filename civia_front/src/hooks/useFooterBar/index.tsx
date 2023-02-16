import { useState, useContext, createContext, useEffect } from 'react';

const FooterBarContext = createContext<any>(null);

const useFooterBar = (newTabValue: string|undefined): any => {
    const { tabValue, setTabValue, badge, setBadge } = useContext(FooterBarContext);
    useEffect(() => {
        if (newTabValue) {
            setTabValue(newTabValue);
        }
    }, [newTabValue, setTabValue]);

    return [tabValue, setTabValue, badge, setBadge];
};

const FooterBarProvider = (props: any) => {
    const [tabValue, setTabValue] = useState();
    const [badge, setBadge] = useState();
    return (
        <FooterBarContext.Provider value={{ tabValue, setTabValue, badge, setBadge }}>{props.children}</FooterBarContext.Provider>
    );
};

export {
    useFooterBar,
    FooterBarProvider
};
