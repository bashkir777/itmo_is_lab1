import React from 'react';
import MostRecentlyAddedMarine from "./MostRecentlyAddedMarine";
import FindSpaceMarineByNamePrefix from "./FindSpaceMarineByNamePrefix";

const AdditionalWrapper = () => {
    const backgroundImageUrl = 'url(/img/sea.jpg)';

    const backgroundStyle = {
        backgroundImage: backgroundImageUrl,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '93vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    };

    return (
        <div style={backgroundStyle}>
            <MostRecentlyAddedMarine />
            <FindSpaceMarineByNamePrefix />
        </div>
    );
};

export default AdditionalWrapper;