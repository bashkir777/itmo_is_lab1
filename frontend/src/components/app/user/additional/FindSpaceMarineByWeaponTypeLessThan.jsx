import React, { useState } from 'react';
import styles from '../../../../css/SpaceMarinesTable.module.css';
import { WEAPON_LESS_THAN_URL } from "../../../../tools/consts";

const FindSpaceMarineByWeaponTypeLessThan = () => {
    const [weaponType, setWeaponType] = useState('');
    const [marines, setMarines] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchSpaceMarinesByWeaponType = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${WEAPON_LESS_THAN_URL}?weaponType=${weaponType}`);
            if (!response.ok) {
                throw new Error('Network response was not ok or there are no space marines with this weapon type');
            }
            const data = await response.json();
            setMarines(data);
        } catch (error) {
            console.error('Error fetching space marines by weapon type:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        fetchSpaceMarinesByWeaponType();
    };

    return (
        <div className={styles.tableContainer} style={{ paddingBottom: '3%', borderRadius: '12px', width: '70%' }}>
            <h2 className="text-center" style={{ marginBottom: '3%' }}>Find Space Marines by Weapon Type Less Than</h2>
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
                <select
                    value={weaponType}
                    onChange={(e) => setWeaponType(e.target.value)}
                    style={{
                        marginRight: '10px',
                        padding: '5px',
                        width: '150px',
                        height: '46px',
                        borderRadius: '6px',
                        border: '1px solid #ddd'
                    }}
                >
                    <option value="">Select Weapon Type</option>
                    <option value="FLAMER">FLAMER</option>
                    <option value="HEAVY_FLAMER">HEAVY_FLAMER</option>
                    <option value="MULTI_MELTA">MULTI_MELTA</option>
                </select>
                <button onClick={handleSearch} className={styles.refreshButton} style={{ padding: '10px 30px' }}>Search</button>
            </div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <table className={styles.spaceMarinesTable}>
                        <thead>
                        <tr>
                            <th className="text-center">ID</th>
                            <th className="text-center">Name</th>
                            <th className="text-center">Health</th>
                            <th className="text-center">Category</th>
                            <th className="text-center">Weapon Type</th>
                            <th className="text-center">Melee Weapon</th>
                            <th className="text-center">Chapter Name</th>
                            <th className="text-center">Chapter World</th>
                            <th className="text-center">Coordinates (X, Y)</th>
                        </tr>
                        </thead>
                        <tbody>
                        {marines.length > 0 ? (
                            marines.map(marine => (
                                <tr key={marine.id}>
                                    <td className="text-center">{marine.id}</td>
                                    <td className="text-center">{marine.name.substring(0, 15) + (marine.name.length >= 15 ? "..." : '')}</td>
                                    <td className="text-center">{marine.health}</td>
                                    <td className="text-center">{marine.category}</td>
                                    <td className="text-center">{marine.weaponType}</td>
                                    <td className="text-center">{marine.meleeWeapon}</td>
                                    <td className="text-center">{marine.chapterName.substring(0, 15) + (marine.chapterName.length >= 15 ? "..." : '')}</td>
                                    <td className="text-center">{marine.chapterWorld.substring(0, 15) + (marine.chapterWorld.length >= 15 ? "..." : '')}</td>
                                    <td className="text-center">{marine.x}, {marine.y}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td className="text-center">—</td>
                                <td className="text-center">—</td>
                                <td className="text-center">—</td>
                                <td className="text-center">—</td>
                                <td className="text-center">—</td>
                                <td className="text-center">—</td>
                                <td className="text-center">—</td>
                                <td className="text-center">—</td>
                                <td className="text-center">—</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
};

export default FindSpaceMarineByWeaponTypeLessThan;