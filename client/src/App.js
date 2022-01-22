import React from 'react';
import Config from './Config';
import Header from './Header';
import Page from './Page';

const App = () => {
  Config.language = (
    (window.navigator.userLanguage || window.navigator.language) == 'fi'
        ? 'fi'
        : 'en'
  );
  return (
    <>
    <Header />
    <Page />
    </>
  );
};

export default App;