import React from 'react';
import ReactDom from 'react-dom';
import { GlobalStyle } from './GlobalStyle';
import { App } from './App';

ReactDom.render(
  <>
    <GlobalStyle />
    <App />
  </>,
  document.getElementById('root'),
);
