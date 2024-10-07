import React from 'react';
import MostRecentlyAddedMarine from "./MostRecentlyAddedMarine";

const AdditionalWrapper = () => {
    const backgroundImageUrl = 'url(/img/sea.jpg)';

    const backgroundStyle = {
        backgroundImage: backgroundImageUrl,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    };
    return (
        <div style={backgroundStyle}>
            <MostRecentlyAddedMarine/>
        </div>
    );
};

export default AdditionalWrapper;