import { FC, useState, useMemo } from 'react';
import { Image, NavBar, Dialog, List, Toast, Card, Form, TextArea, Input, Empty } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { AddCircleOutline } from 'antd-mobile-icons';
import styled from 'styled-components';
import { nanoid } from 'nanoid';
import { useAddressBook } from '@argentx/packages/extension/src/ui/services/addressBook';
import { useNetworks } from '@argentx/packages/extension/src/ui/features/networks/useNetworks';
//
import { WindowWrapperCom, NavBarCom } from '@src/pages/commponents';
//
import {
    addAddressBookContact
} from '@argentx/packages/extension/src/shared/addressBook';
import { formatTruncatedAddress } from '@argentx/packages/extension/src/ui/services/addresses';
import { getNetworkAccountImageUrl } from '@argentx/packages/extension/src/ui/features/accounts/accounts.service';

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

const StyledForm = styled(Form)`
    --border-top: 0;
    --border-bottom: 0;
    .adm-list-item{
        --padding-left: 0;
        &:nth-of-type(1){
            --border-inner: 0;
        }
    }
    .adm-list-body{
        overflow: inherit;
    }
`;

const AddressBookPage: FC<any> = () => {
    const navigate = useNavigate();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const { contacts } = useAddressBook();
    const [form] = Form.useForm();

    const networks = useNetworks();

    const networksToOptions = useMemo(
        () =>
            networks.map((network) => ({ label: network.name, value: network.id })),
        [networks]
    );

    const handleSubmit = async (addressBookContactNoId: any) => {
        try {
            const savedContact = await addAddressBookContact({
                ...addressBookContactNoId,
                id: nanoid()
            });
            console.log(savedContact);
            Toast.show({ content: 'success' });
            setIsAddDialogOpen(false);
            form.resetFields();
        } catch (e:any) {
            Toast.show({ content: e.toString() });
        }
    };

    return (
        <WindowWrapperCom>
            <WindowWrapperCom.Body>
                <NavBarCom
                    left={
                        <StyledGrayBtn onClick={() => { navigate(-1); }}>{NavBarCom.Back}</StyledGrayBtn>
                    }
                    right={
                        <StyledGrayBtn onClick={() => { setIsAddDialogOpen(true); }}>{NavBarCom.Add}</StyledGrayBtn>
                    }

                />
                <StyledBody >
                    <StyledH3>Address book</StyledH3>
                    <List>
                        {
                            contacts.length ? (
                                contacts.map((item, index) => (
                                    <List.Item key={index}
                                        prefix={
                                            <Image
                                                src={getNetworkAccountImageUrl({
                                                    accountName: item.name,
                                                    accountAddress: item.address,
                                                    networkId: item.networkId
                                                })}
                                                style={{ borderRadius: 12 }}
                                                fit='cover'
                                                width={24}
                                                height={24}
                                            />
                                        }
                                        onClick={() => { form.setFieldsValue({ name: item.name, address: item.address }); setIsAddDialogOpen(true); }}
                                        description={formatTruncatedAddress(item.address)} >{item.name}</List.Item>
                                ))
                            ) : (<Empty />)
                        }
                    </List>

                    <Dialog
                        visible={isAddDialogOpen}
                        content={
                            <Card title='Add Address'>
                                <StyledForm
                                    form={form}
                                    onFinish={handleSubmit}
                                >
                                    <Form.Item name='name'>
                                        <Input placeholder='Name' autoComplete='off' />
                                    </Form.Item>
                                    <Form.Item name='address'>
                                        <TextArea placeholder='Starknet Address' rows={4} />
                                    </Form.Item>
                                    <Form.Item name='networkId' initialValue={'goerli-alpha'}>
                                        <Input readOnly />
                                    </Form.Item>
                                </StyledForm>
                            </Card>
                        }
                        actions={[
                            [
                                {
                                    key: 'cancel',
                                    text: 'Cancel',
                                    className: 'adm-button-default adm-button-shape-default',
                                    onClick: () => { setIsAddDialogOpen(false); }
                                },
                                {
                                    key: 'save',
                                    text: 'Save',
                                    className: 'adm-button-default adm-button-shape-default',
                                    onClick: () => { form.submit(); }
                                }
                            ]
                        ]}
                    />
                </StyledBody>
            </WindowWrapperCom.Body>
        </WindowWrapperCom>
    );
};

export default AddressBookPage;
