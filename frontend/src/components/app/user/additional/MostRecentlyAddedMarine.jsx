import React, { useState, useEffect } from 'react';
import styles from '../../../../css/SpaceMarinesTable.module.css';
import { MOST_RECENTLY_ADDED_MARINE_URL } from "../../../../tools/consts";

const MostRecentlyAddedMarine = () => {
    const [marine, setMarine] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchMostRecentlyAddedMarine = async () => {
        setLoading(true);
        try {
            const response = await fetch(MOST_RECENTLY_ADDED_MARINE_URL);
            if (!response.ok) {
                throw new Error('Network response was not ok or there are no space marines yet');
            }
            const data = await response.json();
            setMarine(data);
        } catch (error) {
            console.error('Error fetching most recently added marine:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMostRecentlyAddedMarine();
    }, []);

    return (

            <div className={styles.tableContainer} style={{paddingBottom: '3%', borderRadius: '12px', marginTop: '0', width: '70%'}}>
                <h2 className="text-center" style={{ marginBottom: '3%' }}>Most Recently Added Marine</h2>
                <button onClick={fetchMostRecentlyAddedMarine} className={styles.refreshButton}>Refresh</button>
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
                            {marine ? (
                                <tr>
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

export default MostRecentlyAddedMarine;