import { FC, useState } from 'react';
import { SearchBar, List, Grid } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
//
import { ReactComponent as ArrowRightIcon } from '@src/assets/icons/arrow-right.svg';
import { ReactComponent as LockWalletIcon } from '@src/assets/icons/lockWallet.svg';
import { ReactComponent as AddressBookIcon } from '@src/assets/icons/addressBook.svg';
import { ReactComponent as ExtendedViewIcon } from '@src/assets/icons/extendedView.svg';
import { ReactComponent as ManageNetworksIcon } from '@src/assets/icons/manageNetworks.svg';
import { ReactComponent as BlockExplorerIcon } from '@src/assets/icons/blockExplorer.svg';
import { ReactComponent as ShowPhrasesIcon } from '@src/assets/icons/showPhrases.svg';
import { ReactComponent as SupportIcon } from '@src/assets/icons/support.svg';
import { ReactComponent as TwitterLogoIcon } from '@src/assets/icons/Twitter-logo.svg';
import { ReactComponent as GithubLogoIcon } from '@src/assets/icons/Octicons-mark-github.svg';
//
import { WindowWrapperCom, NavBarCom } from '@src/pages/commponents';
//
import { stopSession } from '@argentx/packages/extension/src/ui/services/backgroundSessions';
import { useOpenExtensionInTab } from '@argentx/packages/extension/src/ui/features/browser/tabs';

const StyledBodyWrapper = styled.div`
    --adm-color-background: transparent;
    background: rgba(249, 255, 247, 1);
    --body-wrapper-background: rgba(249, 255, 247, 1);
    height:100%;
    min-height: 100vh;
    left:0;
    top:0;
    width:100%;
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

const StyledBody = styled.div`
     margin:0 32px;
     .adm-list-body{
        --border-bottom: 0px;
     }
`;

const StyledSearchBar = styled.div`
    --adm-color-box:rgba(232, 232, 232, 0.5);
    padding: 10px 13px;
    
    .adm-search-bar-input-box{
        --border-radius: 20px;
        flex-direction: row-reverse;
        padding-right: var(--padding-left);
    }
`;

const StyledIcon = styled.span`
    font-size:20px;
    margin-right:5px;
`;

const StyledConcatLink = styled.a`
    display:flex;
`;

const StyledConcatIcon = styled.span`
    font-size:20px;
    margin-right:5px;
    display:inline-block;
    width:24px;
    height:24px;
    svg{
        width:24px;
        height:24px;
    }
`;

const StyledPrefixIcon = styled(StyledIcon)`
    svg{
        width:18.5px;
        height:18.5px;
        margin-top:8px;
    }
`;

const SettingPage: FC<any> = () => {
    const navigate = useNavigate();
    const openExtensionInTab = useOpenExtensionInTab();
    const [searchedAccount, setSearchedAccount] = useState<string|undefined>();

    const handleSearch = () => {
        //
    };

    return (
        <StyledBodyWrapper>
            <WindowWrapperCom>
                <WindowWrapperCom.Body>
                    <NavBarCom left={<StyledGrayBtn onClick={() => { navigate(-1); }}>{NavBarCom.Back}</StyledGrayBtn>} />
                    <StyledBody >
                        <StyledH3>Global Settings</StyledH3>
                        <StyledSearchBar>
                            <SearchBar
                                placeholder='Search Settings'
                                style={{ '--height': '24px' }}
                                onSearch={handleSearch}
                                value={searchedAccount}
                                onChange={(value) => { setSearchedAccount(value); }}
                            />
                        </StyledSearchBar>
                        <List style={{ '--border-top': '0px' }}>
                            <List.Item
                                prefix={<StyledPrefixIcon><LockWalletIcon /></StyledPrefixIcon>}
                                onClick={() => { stopSession(); navigate('/onboarding/lock_screen'); }}
                                arrow={<ArrowRightIcon />}
                            >
                                Lock Wallet
                            </List.Item>
                            <List.Item
                                prefix={<StyledPrefixIcon><ExtendedViewIcon /></StyledPrefixIcon>}
                                onClick={openExtensionInTab}
                                arrow={<ArrowRightIcon />}
                            >
                                Extended View
                            </List.Item>
                            {/* <List.Item
                                prefix={<StyledPrefixIcon><AddressBookIcon /></StyledPrefixIcon>}
                                onClick={() => { navigate('/settings/address_book'); }}
                                arrow={<ArrowRightIcon />}
                            >
                                Address book
                            </List.Item> */}
                            <List.Item
                                prefix={<StyledPrefixIcon><ShowPhrasesIcon /></StyledPrefixIcon>}
                                onClick={() => { navigate('/settings/seed_recovery'); }}
                                arrow={<ArrowRightIcon />}
                            >
                                Show Phrase
                            </List.Item>
                            {/* <List.Item
                                prefix={<StyledPrefixIcon><ManageNetworksIcon /></StyledPrefixIcon>}
                                onClick={() => { navigate('/settings/networks'); }}
                                arrow={<ArrowRightIcon />}
                            >
                                Manage networks
                            </List.Item> */}
                            <List.Item
                                prefix={<StyledPrefixIcon><BlockExplorerIcon /></StyledPrefixIcon>}
                                onClick={() => { navigate('/settings/block_explorer'); }}
                                arrow={<ArrowRightIcon />}
                            >
                                Block Explorer
                            </List.Item>
                            {/* <List.Item
                                prefix={<StyledPrefixIcon><BlockExplorerIcon /></StyledPrefixIcon>}
                                onClick={() => { navigate('/dapp/disconnect'); }}
                                arrow={<ArrowRightIcon />}
                            >
                                Reset dapp connections
                            </List.Item> */}
                            <List.Item
                                prefix={<StyledPrefixIcon><BlockExplorerIcon /></StyledPrefixIcon>}
                                onClick={() => { navigate('/settings/reset'); }}
                                arrow={<ArrowRightIcon />}
                            >
                                Reset Or Recover
                            </List.Item>
                        </List>
                        {/* <List header={<span style={{ color: ' #000' }}>Help & Suggestions:</span>} style={{ margin: '20px 0', '--border-top': '0' }}>
                            <List.Item>
                                <Grid columns={3} gap={24}>
                                    <Grid.Item><StyledConcatLink ><StyledConcatIcon><SupportIcon /></StyledConcatIcon>Support</StyledConcatLink></Grid.Item>
                                    <Grid.Item><StyledConcatLink ><StyledConcatIcon><TwitterLogoIcon /></StyledConcatIcon>Twitter</StyledConcatLink></Grid.Item>
                                    <Grid.Item><StyledConcatLink ><StyledConcatIcon><GithubLogoIcon /></StyledConcatIcon>Github</StyledConcatLink></Grid.Item>
                                </Grid>
                            </List.Item>
                        </List> */}
                    </StyledBody>
                </WindowWrapperCom.Body>
            </WindowWrapperCom>
        </StyledBodyWrapper>

    );
};

export default SettingPage;
