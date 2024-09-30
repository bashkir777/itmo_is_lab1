import React, {useState} from 'react';
import SpaceMarineForm from "../user/SpaceMarineForm";
import CoordinatesTable from "../user/CoordinatesTable";

const CreateSpaceMarinePage = () => {
    const [refreshCoordinates, setRefreshCoordinates] = useState(false);

    const backgroundImageUrl = 'url(/img/sea.jpg)';

    const backgroundStyle = {
        backgroundImage: backgroundImageUrl,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height:  '96vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    };

    const handleRefreshCoordinates = () => {
        setRefreshCoordinates(!refreshCoordinates);
    };

    return (
        <>
            <div style={backgroundStyle}>

                <SpaceMarineForm onSuccess={handleRefreshCoordinates} />
                <CoordinatesTable refresh={refreshCoordinates} />
            </div>
        </>
    );
};

export default CreateSpaceMarinePage;