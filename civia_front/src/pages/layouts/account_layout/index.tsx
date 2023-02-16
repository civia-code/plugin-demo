import { FC } from 'react';

import { FooterCom } from '@src/pages/commponents';
import { FooterBarProvider } from '@src/hooks/useFooterBar';

const AccountLayout:FC<any> = ({ children }) => {
    return (
        <FooterBarProvider>
            {children}
            <FooterCom />
        </FooterBarProvider>
    );
};

export default AccountLayout;
