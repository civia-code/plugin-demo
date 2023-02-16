import React, { FC, useEffect, useCallback, useState } from 'react';
import styled from 'styled-components';

const StyledImageWrapper = styled.div`
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
`;

const useNftImage = () => {
    const [src, setSrc] = useState<string|undefined>();
    const [info, setInfo] = useState({});

    const NftImage = useCallback(({ style = {}, src: realSrc = null, ...props }) => {
        return React.createElement(StyledImageWrapper, {
            style: {
                ...info,
                backgroundImage: `url(${realSrc || src}), url(${src})`,
                ...style
            },
            ...props
        });
    }, [info, src]);

    useEffect(() => {
        if (src) {
            const [, width, height] = (src.match(/(\w+)x(\w+)$/) || [1, 1, 1]) as Array<string>;
            setInfo({
                paddingTop: `${parseFloat(height) * 100 / parseFloat(width)}%`
            });
        }
    }, [src]);

    return {
        src,
        info,
        NftImage,
        setSrc
    };
};

export default useNftImage;
