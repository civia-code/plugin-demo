import React, { FC } from 'react';
import {
    DefaultTheme,
    ThemeProvider,
    createGlobalStyle
} from 'styled-components';

const white = '#FFFFFF';
const black = '#000000';

export const colors = {
    white,
    black
};

export const theme: DefaultTheme = {
    ...colors
};

export const GlobalThemeProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <ThemeProvider theme={theme} >
            {children}
        </ThemeProvider>
    );
};

export interface GlobalStyleProps {
    extensionIsInTab: boolean | undefined
}

export const FixedGlobalStyle = createGlobalStyle<GlobalStyleProps>`
    :root{
      --color-primary: #4CD130;
      --color-hover:#72de57;
      --color-active: #31ab1f;

      --adm-color-primary: var(--color-primary);
      --adm-color-hover: var(--color-hover);
      --adm-color-active: var(--color-active);
      --adm-center-popup-z-index: 1500;

      --centered: {
    display: flex;
    align-items: center;
    justify-content: center;
  };
      
    }
  
    body {
      font-family: 'Barlow', sans-serif;
      -webkit-font-smoothing: antialiased;
    }
  
    html, body {
      min-width: 360px;
      min-height: 600px;
      max-width:750px;
      margin: auto;
  
      width: ${({ extensionIsInTab }) => (extensionIsInTab ? 'unset' : '360px')};
      height: ${({ extensionIsInTab }) => (extensionIsInTab ? 'unset' : '600px')};
      
      &::-webkit-scrollbar {
        display: none;
      }
    }
  
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      margin-block: 0;
    }
  
    a {
      text-decoration: none;
      color: inherit;
    }
    .adm-button:active::before{
      opacity: 0;
    }

    .adm-button{
      transition: background 1s cubic-bezier(0.075, 0.82, 0.165, 1);
    }
    .adm-button-default:not(.adm-button-disabled){
      :hover{
        color: var(--adm-color-hover);;
        border-color: var(--adm-color-hover);;
      }
      :active{
        color: var(--adm-color-active);
        border-color: var(--adm-color-active);
      }
    }
    .adm-button-primary:not(.adm-button-disabled){
      &:hover{
        color:#fff;
        --background-color:var(--adm-color-hover);
      }
      &:active{
        color:#fff;
        --background-color:var(--adm-color-active);
      }
    }
  `;

export const GlobalThemedStyle = createGlobalStyle`

`;
