import { FC } from 'react';
import { NavBar, List, Footer, Checkbox, SearchBar, Button } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const StyledBody = styled.div`
    min-height:320px;
    margin: 10px 0;
`;

const StyledList = styled(List)`
    margin:20px 10px;
`;
const StyledListItem = styled(List.Item)`
    text-align: right;
`;
const StyledButton = styled(Button)`
    margin: 20px auto;
    display: block;
`;

const StartScreenPage: FC<any> = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/onboarding/password');
    };
    return (
        <div>
            <NavBar back='back' onBack={() => { window.history.go(-1); }} >
                Create Account
            </NavBar>
            <StyledBody>

                <StyledList mode='card' header='Inviter'>
                    <StyledListItem>
                        <SearchBar placeholder='请输入内容' showCancelButton />
                    </StyledListItem>
                    <StyledListItem prefix={<Checkbox>Jake</Checkbox>}>#99865233</StyledListItem>
                    <StyledListItem prefix={<Checkbox>Jede</Checkbox>}>#8769475</StyledListItem>
                    <StyledListItem prefix={<Checkbox>Jeny</Checkbox>}>#50897342</StyledListItem>
                    <StyledListItem prefix={<Checkbox>John</Checkbox>}>#3093826255</StyledListItem>
                    <StyledListItem prefix={<Checkbox>Jake</Checkbox>}>#987634</StyledListItem>
                    <StyledListItem prefix={<Checkbox>Joye</Checkbox>}>#99865233</StyledListItem>
                    <StyledListItem prefix={<Checkbox>July</Checkbox>}>#78745673</StyledListItem>
                </StyledList>
                <StyledButton onClick={handleClick}>Done</StyledButton>
            </StyledBody>
            <Footer content='@Civia 2022' />
        </div>
    );
};

export default StartScreenPage;
