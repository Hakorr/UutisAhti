import React from 'react';
import Config from './Config';
import './Header.css';

const Header = () => {
    const configStrings = Config.strings[Config.language];
    return (
    <div className="header">
        <div className="header">
            <a className="logo" href="https://github.com/Hakorr/UutisAhti" target="_blank" rel="noopener">UutisAhti<div className="betaTag">Beta</div></a>
            <div className="header-right">
                <a className="active" href="https://github.com/Hakorr/UutisAhti" target="_blank" rel="noopener">Github</a>
                <a href="https://github.com/Hakorr/UutisAhti" target="_blank" rel="noopener">{configStrings.header_about}</a>
            </div>
        </div>
    </div>
    );
};

export default Header;