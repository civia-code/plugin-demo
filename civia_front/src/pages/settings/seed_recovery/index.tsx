import { FC } from 'react';
import { Button, Space, Tag, Toast, DotLoading, List } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import CopyToClipboard from 'react-copy-to-clipboard';
import { useSeedPhrase } from '@argentx/packages/extension/src/ui/features/recovery/useSeedPhrase';

import { WindowWrapperCom, NavBarCom } from '@src/pages/commponents';

const StyledBody = styled.div`
     margin:20px 10px;
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

const StyledList = styled(List)`
    --border-bottom: 0;
`;

const SeedRecoveryPage: FC<any> = () => {
    const navigate = useNavigate();
    const seedPhrase = useSeedPhrase() as string;

    return (
        <WindowWrapperCom>
            <WindowWrapperCom.Body>
                <NavBarCom
                    left={
                        <StyledGrayBtn onClick={() => { navigate(-1); }}>{NavBarCom.Back}</StyledGrayBtn>
                    }

                />
                <StyledH3>Recovery phrase</StyledH3>
                <StyledBody>
                    <StyledList mode='card'>
                        <List.Item>Write these words down on paper. It is unsafe to save them on your computer.</List.Item>
                        <List.Item>
                            <Space wrap justify='center'>
                                {
                                    seedPhrase ? seedPhrase.split(/\s+/g).map((item, index) => (
                                        <Tag round key={index}>{item}</Tag>
                                    )) : <DotLoading color='primary' />
                                }
                            </Space>
                        </List.Item>
                        <List.Item>
                            <CopyToClipboard
                                onCopy={() => Toast.show({ content: 'copyed' })}
                                text={seedPhrase}
                            >
                                <Button block style={{ borderRadius: '20px' }} color='primary' size='large'>Copy</Button>
                            </CopyToClipboard>
                        </List.Item>
                    </StyledList>
                </StyledBody>
            </WindowWrapperCom.Body>
        </WindowWrapperCom>
    );
};

export default SeedRecoveryPage;
