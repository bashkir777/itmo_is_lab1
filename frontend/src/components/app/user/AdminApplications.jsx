import { useEffect, useState } from 'react';
import { MDBBtn } from "mdb-react-ui-kit";
import { ACCEPT_APPLICATION, ADMIN_APPLICATIONS, REJECT_APPLICATION } from "../../../tools/consts";
import styles from '../../../css/SpaceMarinesTable.module.css';

const AdminApplications = () => {
    const [applications, setApplications] = useState([]);
    const [refresh, setRefresh] = useState(true);

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        fetch(ADMIN_APPLICATIONS, { headers: { "Authorization": `Bearer ${accessToken}` } })
            .then(response => response.json())
            .then(data => setApplications(data))
            .catch(error => console.error("Ошибка при загрузке заявок:", error));
    }, [refresh]);

    const handleAccept = (id) => {
        const accessToken = localStorage.getItem("accessToken");
        fetch(ACCEPT_APPLICATION, {
            method: "POST", body: JSON.stringify({ id: id }),
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${accessToken}` },
        })
            .then(response => {
                if (response.ok) {
                    console.log('Заявка успешно одобрена');
                    setRefresh(!refresh);
                } else {
                    throw new Error(response.statusText);
                }
            })
            .catch(error => console.error("Не удалось одобрить заявку"));
    };

    const handleReject = (id) => {
        const accessToken = localStorage.getItem("accessToken");
        fetch(REJECT_APPLICATION, {
            method: "POST",
            body: JSON.stringify({ id: id }),
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${accessToken}` }
        })
            .then(response => {
                if (response.ok) {
                    setRefresh(!refresh);
                    console.log('Заявка успешно отклонена');
                } else {
                    throw new Error(response.statusText);
                }
            })
            .catch(error => console.error("Не удалось отклонить заявку заявку"));
    };

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

    return (
        <div style={backgroundStyle}>
            <div className={styles.tableContainer} style={{paddingBottom: '3%', borderRadius: '12px'}}>
                <h2 className="text-center" style={{ marginBottom: '3%' }}>Список заявок на получение прав администратора</h2>
                <table className={styles.spaceMarinesTable}>
                    <thead>
                    <tr>
                        <th className="text-center">Имя пользователя</th>
                        <th className="text-center">Имя</th>
                        <th className="text-center">Фамилия</th>
                        <th className="text-center">Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {applications.length > 0 ? (
                        applications.map(application => (
                            <tr key={application.id}>
                                <td className="text-center">{application.username}</td>
                                <td className="text-center">{application.firstname}</td>
                                <td className="text-center">{application.lastname}</td>
                                <td className="text-center">
                                    <MDBBtn color="success" size="sm" className="me-2"
                                            onClick={() => handleAccept(application.id)}>Принять</MDBBtn>
                                    <MDBBtn color="danger" size="sm"
                                            onClick={() => handleReject(application.id)}>Отклонить</MDBBtn>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td className="text-center">—</td>
                            <td className="text-center">—</td>
                            <td className="text-center">—</td>
                            <td className="text-center">—</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminApplications;