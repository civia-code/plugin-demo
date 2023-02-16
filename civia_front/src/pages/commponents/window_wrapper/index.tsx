import React, { FC, PropsWithChildren, ReactElement, Fragment } from 'react';
import styled from 'styled-components';

import LoadingCom from '../loading';

const StyledWrapper = styled.div``;

const StyledHeadWrapper = styled.div``;

const StyledFooterWrapper = styled.div``;

const StyledBodyWrapper = styled.div`
    min-height:320px;
    /* margin: 10px 0; */
    border-radius: 20px 20px 0 0;
    background:var(--body-wrapper-background, #fff);
`;

const WindowWrapperHeadCom: FC<PropsWithChildren> = (props) => <Fragment {...props} />;

const WindowWrapperBodyCom: FC<PropsWithChildren> = (props) => <Fragment {...props} />;

const WindowWrapperFooterCom: FC<PropsWithChildren> = (props) => <Fragment {...props} />;

type TWindowWrapperComChildren = Exclude<ReactElement, string | number>;
type TWindowWrapperComProps = { loading?: boolean, children: TWindowWrapperComChildren | Array<TWindowWrapperComChildren>};

const WindowWrapperCom: FC<TWindowWrapperComProps> & { Head: typeof WindowWrapperHeadCom, Body: typeof WindowWrapperBodyCom, Footer: typeof WindowWrapperFooterCom } = ({ loading = false, children }) => {
    //
    const { heads, bodys, footers } = React.Children.toArray(children).reduce((results: any, element) => {
        const { type } = element as any;
        if (type.displayName === 'WindowWrapperHeadCom') {
            results.heads.push(element);
        } else if (type.displayName === 'WindowWrapperFooterCom') {
            results.footers.push(element);
        } else {
            results.bodys.push(element);
        }
        return results;
    }, { heads: [], bodys: [], footers: [] });
    //
    return (
        <StyledWrapper>
            {
                heads.length ? (
                    <StyledHeadWrapper>
                        {heads}
                    </StyledHeadWrapper>
                ) : null
            }
            <StyledBodyWrapper>
                {bodys}
            </StyledBodyWrapper>
            {
                footers.length ? (
                    <StyledFooterWrapper>
                        {footers}
                    </StyledFooterWrapper>
                ) : null
            }
            <LoadingCom visible={loading} />
        </StyledWrapper>
    );
};

WindowWrapperCom.Head = (WindowWrapperHeadCom.displayName = 'WindowWrapperHeadCom', WindowWrapperHeadCom);
WindowWrapperCom.Body = (WindowWrapperBodyCom.displayName = 'WindowWrapperBodyCom', WindowWrapperBodyCom);
WindowWrapperCom.Footer = (WindowWrapperFooterCom.displayName = 'WindowWrapperFooterCom', WindowWrapperFooterCom);

export default WindowWrapperCom;
