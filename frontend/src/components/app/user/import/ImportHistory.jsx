import React, { useEffect } from 'react';
import styles from '../../../../css/UserAccountInfo.module.css';
import { useDispatch } from "react-redux";
import { setError, setErrorMessage } from "../../../../redux/actions";

const ImportHistory = () => {
    const [importList, setImportList] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const dispatch = useDispatch();

    const backgroundImageUrl = 'url(/img/sea.jpg)';

    const backgroundStyle = {
        backgroundImage: backgroundImageUrl,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '93vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    };

    useEffect(() => {
        const fetchImportHistory = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const response = await fetch('/api/v1/import', {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });

                if (!response.ok) {
                    const message = "Не удалось получить историю импорта";
                    throw new Error(message);
                }

                const data = await response.json();
                setImportList(data);
            } catch (error) {
                dispatch(setError(true));
                dispatch(setErrorMessage(error.message));
            } finally {
                setLoading(false);
            }
        };

        fetchImportHistory();
    }, [dispatch]);

    return (
        <div style={backgroundStyle}>
            <div className={`${styles.userAccountInfo} shadow p-4 bg-white`}>
                <h2 className="text-center mb-4">История импорта</h2>
                {loading && <p>Загрузка...</p>}
                {!loading && (
                    <table className={styles.userInfoTable}>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Статус</th>
                            <th>Имя создателя</th>
                            <th>Счетчик</th>
                            <th>Ссылка на скачивание</th>
                        </tr>
                        </thead>
                        <tbody>
                        {importList.length > 0 ? (
                            importList.map((importItem) => (
                                <tr key={importItem.id}>
                                    <td>{importItem.id}</td>
                                    <td>{importItem.status}</td>
                                    <td>{importItem.creatorName}</td>
                                    <td>{importItem.counter !== null ? importItem.counter : '—'}</td>
                                    <td>{importItem.link !== null ? <a href={importItem.link} download>Скачать</a> : '—'}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td className="text-center"> —</td>
                                <td className="text-center"> —</td>
                                <td className="text-center"> —</td>
                                <td className="text-center"> —</td>
                                <td className="text-center"> —</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ImportHistory;