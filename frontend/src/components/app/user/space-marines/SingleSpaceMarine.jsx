import React from 'react';
import styles from '../../../../css/SpaceMarinesTable.module.css';

const SingleSpaceMarine = ({ marine, onClose }) => {
    return (
        <div className={styles.modalOverlay}>
            <div className={`${styles.modalContent} text-end}`}>
                <h2 className="text-center" style={{ marginBottom: '3%' }}>Space Marine Information</h2>

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
                    <tr key={marine.id}>
                        <td className="text-center">{marine.id}</td>
                        <td className="text-center">{marine.name.substring(0, 15) + (marine.name.length >= 15 ? "..." : '')}</td>
                        <td className="text-center">{marine.health}</td>
                        <td className="text-center">{marine.category}</td>
                        <td className="text-center">{marine.weaponType}</td>
                        <td className="text-center">{marine.meleeWeapon}</td>
                        <td className="text-center">{marine.chapterName.substring(0, 15) + (marine.chapterName.length >= 15 ? "..." : '')}</td>
                        <td className="text-center">{marine.chapterWorld.substring(0, 15) + (marine.chapterWorld.length >= 15 ? "..." : '')}</td>
                        <td className="text-center">{`(${marine.x}, ${marine.y})`}</td>
                    </tr>
                    </tbody>
                </table>
                <div className="text-end mt-3">
                    <button className={`btn btn-primary`} onClick={onClose}>
                        Назад
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SingleSpaceMarine;