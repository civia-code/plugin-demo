import { FC } from 'react';
import styled from 'styled-components';

const StyledDiv = styled.div`
    @keyframes fade {    
        from {        
            opacity: 1.0;    
        }
        50% {        
            opacity: 0.4;    
        }

        to {        
            opacity: 1.0;    
        }

    }
    animation: fade 1600ms infinite;
`;

const FlashCom: FC<any> = ({ children }) => {
    return <StyledDiv>{children}</StyledDiv>;
};

export default FlashCom;
