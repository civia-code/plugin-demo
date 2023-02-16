import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { List } from 'antd-mobile';
import { CheckCircleOutline } from 'antd-mobile-icons';
import styled from 'styled-components';
//
import { WindowWrapperCom, NavBarCom } from '@src/pages/commponents';
//
import { useKeyValueStorage } from '@argentx/packages/extension/src/shared/storage/hooks';
import { settingsStore } from '@argentx/packages/extension/src/shared/settings';
import { BlockExplorerKey, defaultBlockExplorerKey, defaultBlockExplorers } from '@argentx/packages/extension/src/shared/settings/defaultBlockExplorers';

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

const SettingsBlockExplorerPage: FC<any> = () => {
    const navigate = useNavigate();
    const blockExplorerKey = useKeyValueStorage(settingsStore, 'blockExplorerKey');

    return (
        <WindowWrapperCom>
            <WindowWrapperCom.Body>
                <NavBarCom
                    left={
                        <StyledGrayBtn onClick={() => { navigate(-1); }}>{NavBarCom.Back}</StyledGrayBtn>
                    }

                />
                <StyledBody >
                    <StyledH3>Block explorer</StyledH3>
                    <List>
                        {
                            Object.entries(defaultBlockExplorers).map(([key, blockExplorer]) => {
                                const { title } = blockExplorer;
                                const checked = blockExplorerKey === key;
                                const isDefault = defaultBlockExplorerKey === key;

                                return <List.Item key={key} extra={checked ? <CheckCircleOutline /> : null}
                                    onClick={() => {
                                        settingsStore.set(
                                            'blockExplorerKey',
                                            key as BlockExplorerKey
                                        );
                                    }}
                                    arrow={false}
                                >{title}</List.Item>;
                            })
                        }
                    </List>
                </StyledBody>
            </WindowWrapperCom.Body>
        </WindowWrapperCom>
    );
};

export default SettingsBlockExplorerPage;
