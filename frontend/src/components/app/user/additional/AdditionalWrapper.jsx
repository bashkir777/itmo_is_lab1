import React from 'react';
import MostRecentlyAddedMarine from "./MostRecentlyAddedMarine";
import FindSpaceMarineByNamePrefix from "./FindSpaceMarineByNamePrefix";
import FindSpaceMarineByWeaponTypeLessThan from "./FindSpaceMarineByWeaponTypeLessThan";

const AdditionalWrapper = () => {
    const backgroundImageUrl = 'url(/img/sea.jpg)';

    const backgroundStyle = {
        backgroundImage: backgroundImageUrl,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '92.2vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
    };

    const scrollableContainerStyle = {
        width: '100%',
        height: '100%',
        overflowY: 'auto',
        padding: '20px',
        paddingTop: '25%',
        paddingBottom: '4%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    };

    return (
        <div style={backgroundStyle}>
            <div style={scrollableContainerStyle} className={"justify-content-center align-items-center"}>
                <MostRecentlyAddedMarine />
                <FindSpaceMarineByNamePrefix />
                <FindSpaceMarineByWeaponTypeLessThan />
            </div>
        </div>
    );
};

export default AdditionalWrapper;