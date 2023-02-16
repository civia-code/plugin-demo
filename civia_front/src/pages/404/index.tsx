import { FC } from 'react';
import { ErrorBlock, Button } from 'antd-mobile';
import styled from 'styled-components';

const Error404Page: FC<any> = () => {
    return (
        <ErrorBlock fullPage status='empty' >
            <Button color='primary' onClick={() => { history.go(-1); }}>Back</Button>
        </ErrorBlock>
    );
};

export default Error404Page;
