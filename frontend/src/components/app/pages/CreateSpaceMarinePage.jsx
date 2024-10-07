import React, {useState} from 'react';
import SpaceMarineForm from "../user/space-marines/SpaceMarineForm";
import CoordinatesTable from "../user/space-marines/CoordinatesTable";
import ChaptersTable from "../user/space-marines/ChaptersTable";

const CreateSpaceMarinePage = () => {
    const [refresh, setRefresh] = useState(false);

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

    const handleRefresh = () => {
        setRefresh(!refresh);
    };

    return (
        <>
            <div style={backgroundStyle}>
                <ChaptersTable refresh={refresh}/>
                <SpaceMarineForm onSuccess={handleRefresh} />
                <CoordinatesTable refresh={refresh} />
            </div>
        </>
    );
};

export default CreateSpaceMarinePage;