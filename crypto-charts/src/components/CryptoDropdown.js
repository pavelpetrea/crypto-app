import React from 'react';
import '../App.css';

const CryptoDropdown = () => {
    return (
        <>
        <div className="crypto-dropdown">
            <div className="custom-select">
                <select id="menu">
                    <option>Bitcoin</option>
                    <option>Ethereum</option>
                    <option>Solana</option>
                    <option>XRP</option>
                    <option>EGLD</option>
                </select>
                <div className="select-icon"></div>
            </div>
        </div>
        </>
    );
};

export default CryptoDropdown;
