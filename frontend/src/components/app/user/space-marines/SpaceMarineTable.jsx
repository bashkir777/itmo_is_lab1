import React, { useState, useEffect } from 'react';
import styles from '../../../../css/SpaceMarinesTable.module.css';
import { SPACE_MARINES_INFO_URL } from "../../../../tools/consts";
import { useDispatch } from "react-redux";
import { setError, setErrorMessage } from "../../../../redux/actions";
import PatchSpaceMarinePage from "../../pages/PatchSpaceMarinePage";
import { getUserInfoFromToken } from "../../../../tools/functions";

const SPACE_MARINES_URL = '/api/v1/space-marines';

const SpaceMarineTable = () => {
    const [spaceMarines, setSpaceMarines] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const [filterField, setFilterField] = useState('');
    const [filterValue, setFilterValue] = useState('');
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');

    const dispatch = useDispatch();

    const fetchSpaceMarines = async (page) => {
        setLoading(true);
        try {
            const response = await fetch(`${SPACE_MARINES_INFO_URL}?page=${page}&size=10`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setSpaceMarines(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Error fetching space marines:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSpaceMarines(currentPage);
    }, [currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleRefresh = () => {
        fetchSpaceMarines(currentPage);
    };

    const [showPatchForm, setShowPatchForm] = useState(false);

    const handleDelete = async (id) => {
        fetch(`${SPACE_MARINES_URL}/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
        }).then((response) => {
            if (!response.ok) {
                dispatch(setError(true));
                dispatch(setErrorMessage("Не удалось удалить объект. Повторите попытку позже"));
                setTimeout(() => {
                    dispatch(setError(false));
                    dispatch(setErrorMessage(""));
                }, 3000);
            } else {
                handleRefresh();
            }
        });
    };

    const userInfo = getUserInfoFromToken();

    const [formData, setFormData] = useState({
        id: '',
        name: '',
        health: '',
        category: '',
        weaponType: '',
        meleeWeapon: '',
        existingChapterId: '',
        existingCoordinateId: '',
    });

    const applyFilter = () => {
        if (!filterField || !filterValue) return spaceMarines;

        return spaceMarines.filter(marine => {
            const fieldValue = marine[filterField]?.toString().toLowerCase();
            return fieldValue?.includes(filterValue.toLowerCase());
        });
    };

    const applySort = (filteredMarines) => {
        if (!filteredMarines.length) return filteredMarines;

        // Сортировка по умолчанию по ID
        let sortedMarines = [...filteredMarines].sort((a, b) => a.id - b.id);

        if (sortField) {
            sortedMarines = sortedMarines.sort((a, b) => {
                const aValue = a[sortField];
                const bValue = b[sortField];
                if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return sortedMarines;
    };

    const handleFilter = () => {
        setSortField(''); // Сбрасываем сортировку при применении фильтрации
        setSortOrder('asc'); // Сбрасываем порядок сортировки
    };

    const filteredMarines = applyFilter();
    const sortedMarines = applySort(filteredMarines);

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
            {showPatchForm && <PatchSpaceMarinePage initialData={formData} close={() => {
                setShowPatchForm(false);
                handleRefresh();
            }} />}
            <div className={styles.tableContainer}>
                <h2 className="text-center" style={{ marginBottom: '3%' }}>Space Marines</h2>
                <div className={styles.filterSortContainer}>
                    <div className={styles.filterContainer}>
                        <select
                            value={filterField}
                            onChange={(e) => setFilterField(e.target.value)}
                            className={styles.filterSelect}
                        >
                            <option value="">Select Field to Filter</option>
                            <option value="name">Name</option>
                            <option value="chapterName">Chapter Name</option>
                            <option value="chapterWorld">Chapter World</option>
                            <option value="category">Category</option>
                            <option value="weaponType">Weapon Type</option>
                            <option value="meleeWeapon">Melee Weapon</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Filter Value"
                            value={filterValue}
                            onChange={(e) => setFilterValue(e.target.value)}
                            className={styles.filterInput}
                        />
                        <button onClick={() => {
                            setFilterValue('');
                            handleFilter();
                        }} className={styles.filterButton}>Clear Filter</button>
                    </div>
                    <div className={styles.sortContainer}>
                        <select
                            value={sortField}
                            onChange={(e) => setSortField(e.target.value)}
                            className={styles.sortSelect}
                        >
                            <option value="">Select Field to Sort</option>
                            <option value="name">Name</option>
                            <option value="health">Health</option>
                            <option value="category">Category</option>
                            <option value="weaponType">Weapon Type</option>
                            <option value="meleeWeapon">Melee Weapon</option>
                            <option value="chapterName">Chapter Name</option>
                            <option value="chapterWorld">Chapter World</option>
                        </select>
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className={styles.sortSelect}
                        >
                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                        </select>
                        <button onClick={() => setSortField('')} className={styles.sortButton}>Clear Sort</button>
                    </div>
                </div>
                <button onClick={handleRefresh} className={styles.refreshButton}>Refresh</button>
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
                                <th className="text-center">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {sortedMarines.length === 0 ? (
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
                                    <td className="text-center">—</td>
                                </tr>
                            ) : (
                                sortedMarines.map(marine => {
                                    const canEdit = userInfo && (userInfo.role === 'ADMIN' || userInfo.username === marine.createdBy);
                                    const canDelete = userInfo && (userInfo.role === 'ADMIN' || userInfo.username === marine.createdBy);

                                    return (
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
                                            <td className="text-center">
                                                {canEdit && (
                                                    <button onClick={() => {
                                                        setFormData(marine);
                                                        setShowPatchForm(true);
                                                    }} className={styles.actionButton} style={{ backgroundColor: "#ff8000" }}>Edit</button>
                                                )}
                                                {canDelete && (
                                                    <button onClick={() => handleDelete(marine.id)} className={styles.actionButton} style={{ backgroundColor: "#ff0000" }}>Delete</button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                            </tbody>
                        </table>
                        <div className={styles.pagination}>
                            {Array.from({ length: totalPages }, (_, i) => i).map(page => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`${currentPage === page ? styles.active : ''}`}
                                    style={{ borderRadius: '6px' }}
                                >
                                    {page + 1}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SpaceMarineTable;