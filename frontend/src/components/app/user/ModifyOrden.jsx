import React, { useState } from 'react';
import ShortSpaceMarineTable from "./ShortSpaceMarineTable";
import styles from '../../../css/ModifyOrden.module.css';
import MarinesOfOrden from "./MarinesOfOrden";

const ModifyOrden = ({ ordenId, close }) => {
    const [refresh, setRefresh] = useState(0);

    const handleRefresh = () => {
        setRefresh(prev => prev + 1);
    };

    return (
        <div className={styles.overlay}>
            <button onClick={close} className={styles.backButton}>Назад</button>
            <div className={styles.content}>
                <MarinesOfOrden ordenId={ordenId} refresh={refresh} handleRefresh={handleRefresh}/>
            </div>
            <div className={styles.content}>
                <ShortSpaceMarineTable ordenId={ordenId} refresh={refresh} handleRefresh={handleRefresh}/>
            </div>
        </div>
    );
};

export default ModifyOrden;