import { FC } from 'react';
import { NavBar, Popover, Button, List, Card, Switch, Avatar, Grid } from 'antd-mobile';
import { AlipaySquareFill, KoubeiFill, ScanningFaceOutline, TravelOutline } from 'antd-mobile-icons';
import styled from 'styled-components';
import { ListItem } from 'antd-mobile/es/components/list/list-item';
import AccountLayout from '@src/pages/layouts/account_layout';

const StyledBody = styled.div`
    min-height:320px;
    margin: 10px 0;
`;

const StyledBtnItem = styled.div`
    text-align:center;
    font-size:40px;
    padding:10px 0;
`;

const AccountDetailPage: FC<any> = () => {
    const handleClick = () => {

    };

    return (
        <AccountLayout>
            <NavBar back={null} right={
                <div>
                    <Popover.Menu
                        actions={[
                            { key: '1', text: 'Testnet' },
                            { key: '2', text: 'mainnet' },
                            { key: '3', text: 'location' }
                        ]}
                        onAction={handleClick}
                        trigger='click'
                        placement='bottom-end'
                    >
                        <Button size='small'>Testnet</Button>
                    </Popover.Menu>
                </div>
            }>
                Accounts
            </NavBar>
            <StyledBody >
                <Card>
                    <Avatar src='https://bafybeibb6xzrzquhddoclhvdeyfnxvi7ehtk4cd4n5mcuff6xwzh7lgy4e.ipfs.w3s.link/16pic_8548796_b.jpeg' style={{ '--size': '90px', margin: '20px auto' }} />
                </Card>
                <Card>
                    <List mode='card'>
                        <List.Item prefix={'Name:'}>Goldroc123456</List.Item>
                        <List.Item prefix={'Civia Id:'}>sss</List.Item>
                        <List.Item prefix={'My SBTs:'} >&nbsp;</List.Item>
                        <List.Item>
                            <Grid columns={3} gap={8}>
                                <Grid.Item>
                                    <StyledBtnItem><KoubeiFill /></StyledBtnItem>
                                </Grid.Item>
                                <Grid.Item>
                                    <StyledBtnItem><ScanningFaceOutline /></StyledBtnItem>
                                </Grid.Item>
                                <Grid.Item>
                                    <StyledBtnItem><AlipaySquareFill /></StyledBtnItem>
                                </Grid.Item>
                                <Grid.Item>
                                    <StyledBtnItem><TravelOutline /></StyledBtnItem>
                                </Grid.Item>
                                <Grid.Item>
                                    <StyledBtnItem><KoubeiFill /></StyledBtnItem>
                                </Grid.Item>
                            </Grid>
                        </List.Item>
                    </List>
                </Card>
                <Card>
                    <List mode='card'>
                        <ListItem>Describe yourself</ListItem>
                        <ListItem prefix='Every one can follows me'><Switch /></ListItem>
                        <ListItem prefix='All friend can watch me'><Switch defaultChecked /></ListItem>
                        <ListItem>Civia Version 0.1.1</ListItem>
                    </List>
                </Card>
            </StyledBody>
        </AccountLayout>
    );
};

export default AccountDetailPage;
