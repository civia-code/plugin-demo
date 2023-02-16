import { FC, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, List } from 'antd-mobile';
import { useClickAway } from 'ahooks';
import styled from 'styled-components';
//
import { useNetworks, useCurrentNetwork, useNetworkStatuses } from '@argentx/packages/extension/src/ui/features/networks/useNetworks';
//
import { NetworkStatus } from '@argentx/packages/extension/src/shared/network';
import { useAppState } from '@argentx/packages/extension/src/ui/app.state';
import { recover } from '@argentx/packages/extension/src/ui/features/recovery/recovery.service';
import { assertNever } from '@argentx/packages/extension/src/ui/services/assertNever';

const StyledNetWorkListPanel = styled.div`
    position: relative;
    /* left:unset;
    right:22px;
    top:24px; */
`;

const StyledNetWorkListMenu = styled.div<any>`
    position:absolute;
    right: 0;
    top: 100%;
    left: 0;
    margin: auto;
    z-index: 10;
    border-radius:10px;
    margin-top:4px;
    overflow:hidden;
    display: ${({ isShow }) => isShow ? 'inherit' : 'none'};
    border: 1px solid var(--adm-border-color);

    .adm-list-body{
        border-top: 0px;
        border-bottom:0px;
    }
    .adm-list-item-content-main{
        padding: 8px 0;
        text-align:left;
        font-size:12px;
    }
`;

export type StatusIndicatorColor = 'green' | 'orange' | 'red' | 'transparent'
interface StatusIndicatorProps {
    color?: StatusIndicatorColor
}

export function mapNetworkStatusToColor (
    status?: NetworkStatus
): StatusIndicatorColor {
    switch (status) {
    case 'error':
        return 'red';
    case 'degraded':
        return 'orange';
    case 'ok': // network status shows green by default and has no transparent state
    case 'unknown':
    case undefined:
        return 'green';
    default:
        assertNever(status);
        return 'green';
    }
}

const StatusIndicator = styled.span<StatusIndicatorProps>`
    height: 8px;
    width: 8px;
    border-radius: 8px;
    display: inline-block;;
    margin-left:4px;
    margin-right:4px;
  
    background-color: ${({ color = 'transparent' }) =>
        color === 'green'
            ? 'var(--color-primary)'
            : color === 'orange'
                ? '#ffa85c'
                : color === 'red'
                    ? '#C12026'
                    : 'transparent'};
  `;

export const NetworkStatusIndicator: FC<StatusIndicatorProps> = ({
    color = 'transparent'
}) => {
    return <StatusIndicator color={color} />;
};

const NetworkSwitcherCom: FC<any> = ({ netWorkListMenuStyle = {}, disabled }) => {
    const navigate = useNavigate();
    const allNetworks = useNetworks();
    const { networkStatuses } = useNetworkStatuses();
    const currentNetwork = useCurrentNetwork();
    const [isShow, setIsShow] = useState<boolean>(false);
    const ref = useRef<HTMLDivElement>(null);

    useClickAway(() => {
        setIsShow(false);
    }, ref);
    //
    const handleClick = async (item: any) => {
        navigate('/account/list');
        recover({ networkId: item.key, showAccountList: true });
    };
    //
    return (
        <StyledNetWorkListPanel>
            <div ref={ref} onClick={() => { setIsShow(!isShow); }}>
                <Button size='small' style={{ borderRadius: '30px', overflow: 'hidden' }} block ><NetworkStatusIndicator color={mapNetworkStatusToColor(networkStatuses[currentNetwork.id])} />{currentNetwork.name}</Button>
            </div>
            {
                disabled ? (null) : (
                    <StyledNetWorkListMenu isShow={isShow} style={{ ...netWorkListMenuStyle }}>
                        <List>
                            {
                                allNetworks.map((item) => (
                                    <List.Item key={item.id} onClick={() => { handleClick(item); }} arrow={false}><NetworkStatusIndicator color={mapNetworkStatusToColor(networkStatuses[item.id])} />{item.name}</List.Item>
                                ))
                            }
                        </List>
                    </StyledNetWorkListMenu>
                )
            }
        </StyledNetWorkListPanel>
    );
};

export default NetworkSwitcherCom;
