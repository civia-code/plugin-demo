import { lazy, Suspense } from 'react';
import { useRoutes, Outlet, createBrowserRouter, Navigate } from 'react-router-dom';
import routes from '~react-pages';
import { ConfigProvider } from 'antd-mobile';
import enUS from 'antd-mobile/es/locales/en-US';
import { SWRConfig } from 'swr';
//
import {
    GlobalThemeProvider,
    GlobalThemedStyle,
    FixedGlobalStyle
} from '@src/theme';
//
import { LoadingCom } from '@src/pages/commponents';
import StartPage from '@src/pages/onboarding/password';
import DappPage from '@src/pages/dapp';
import LockScreenPage from '@src/pages/onboarding/lock_screen';
import AccountHome from '@src/pages/account/home';
import Error404Page from '@src/pages/404';
//
import { useExtensionIsInTab } from '@argentx/packages/extension/src/ui/features/browser/tabs';
import { hasActiveSession, isInitialized } from '@argentx/packages/extension/src/ui/services/backgroundSessions';
import { useActions } from '@argentx/packages/extension/src/ui/features/actions/actions.state';
import { swrCacheProvider } from '@argentx/packages/extension/src/ui/services/swr';
//
const EntryPage = lazy(() => Promise.all([isInitialized(), hasActiveSession()]).then(([{ initialized }, hasSession]) => {
    return Promise.resolve({
        default: (props: any) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const actions = useActions();
            const previousPage = swrCacheProvider.get('previousPage');
            const TargetPage = actions[0] ? <DappPage /> : (() => {
                return previousPage ? <Navigate to={previousPage} /> : <AccountHome />;
            })();
            return initialized ? (hasSession ? TargetPage : <LockScreenPage targetPage={actions[0] ? '/dapp' : previousPage} />) : <StartPage />;
        }
    } as any);
}));
//
const router = createBrowserRouter([
    {
        path: '/',
        element: <Outlet />
    },
    {
        path: '/index.html',
        element: <EntryPage />
    },
    {
        path: '*',
        element: <Error404Page />
    }
]);

const newRoutes = ((router.routes[0] as any).children = routes, router.routes);
//
function App () {
    const extensionIsInTab = useExtensionIsInTab();
    const routes = useRoutes(newRoutes);

    return (
        <ConfigProvider locale={enUS}>
            <SWRConfig value={{ provider: () => swrCacheProvider }}>
                <GlobalThemeProvider>
                    <FixedGlobalStyle extensionIsInTab={extensionIsInTab} />
                    <GlobalThemedStyle />
                    <Suspense fallback={
                        <LoadingCom visible />
                    }>
                        {routes}
                    </Suspense>
                </GlobalThemeProvider>
            </SWRConfig>
        </ConfigProvider>
    );
}

export default App;
