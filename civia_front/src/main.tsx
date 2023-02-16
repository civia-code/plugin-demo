import { createBrowserHistory } from 'history';
import ReactDOM from 'react-dom/client';
import { unstable_HistoryRouter as Router } from 'react-router-dom';
import { swrCacheProvider } from '@argentx/packages/extension/src/ui/services/swr';
import App from './App';

const history = createBrowserHistory() as any;
history.listen((update: any) => {
    const pathname = update.location.pathname;
    if (update.action !== 'POP' && ['/account/home', '/account/tokens', '/account/socal'].includes(pathname)) {
        swrCacheProvider.set('previousPage', pathname);
    }
    if (pathname.startsWith('/account/0x')) {
        console.log('isfresh ==', 1); // 1是要刷新 0是不要刷新
    } else if (pathname === '/account/search') { /* empty */ } else {
        window.localStorage.setItem('isfresh', '0');
    }
});

ReactDOM.createRoot(document.getElementById('root') as any).render(
    <Router history={history}>
        <App />
    </Router>
);
