import { FC, useMemo } from 'react';
import { isEqual } from 'lodash-es';
import { List } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useNetworks, useCustomNetworks } from '@argentx/packages/extension/src/ui/features/networks/useNetworks';
import { useSelectedNetwork } from '@argentx/packages/extension/src/ui/features/settings/selectedNetwork.state';
import { defaultCustomNetworks } from '@argentx/packages/extension/src/shared/network/storage';

import { WindowWrapperCom, NavBarCom } from '@src/pages/commponents';

const StyledBody = styled.div`
     margin:0px 10px;
`;
const StyledH3 = styled.h3`
    font-size:24px;
    padding: 15px 0;
    text-align:center;
    margin-top: 8px;
`;

const StyledGrayBtn = styled.div`
    svg{
        path{
            fill: #4A4A4A!important;
        }
    }
`;

const SettingsNetworksPage: FC<any> = () => {
    const allNetworks = useNetworks();
    const navigate = useNavigate();
    const [, setSelectedCustomNetwork] = useSelectedNetwork();
    const customNetworks = useCustomNetworks();

    const isDefaultCustomNetworks = useMemo(() => {
        return isEqual(customNetworks, defaultCustomNetworks);
    }, [customNetworks]);

    return (
        <WindowWrapperCom>
            <WindowWrapperCom.Body>
                <NavBarCom
                    left={
                        <StyledGrayBtn onClick={() => { navigate(-1); }}>{NavBarCom.Back}</StyledGrayBtn>
                    }
                />
                <StyledBody >
                    <StyledH3>Networks</StyledH3>
                    <List>
                        {
                            allNetworks.map((item) => (
                                <List.Item key={item.id} description={item.id}>{item.name}</List.Item>
                            ))
                        }
                    </List>
                </StyledBody>
            </WindowWrapperCom.Body>
        </WindowWrapperCom>
    );
};

export default SettingsNetworksPage;
