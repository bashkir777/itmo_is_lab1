import React, { useState, useEffect } from 'react';
import styles from '../../../css/ChaptersTable.module.css';
import {CHAPTERS_INFO_URL} from "../../../tools/consts";

const CHAPTERS_URL = '/api/v1/chapters';

const ChaptersTable = ({ refresh }) => {
    const [chapters, setChapters] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const fetchChapters = async (page) => {
        setLoading(true);
        try {
            const response = await fetch(`${CHAPTERS_INFO_URL}?page=${page}&size=10`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setChapters(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Error fetching chapters:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChapters(currentPage);
    }, [currentPage, refresh]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className={styles.tableContainer}>
            <h2 className="text-center">Chapters</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <table className={styles.chaptersTable}>
                        <thead>
                        <tr>
                            <th className="text-center">ID</th>
                            <th className="text-center">Name</th>
                            <th className="text-center">World</th>
                        </tr>
                        </thead>
                        <tbody>
                        {chapters.map(chapter => (
                            <tr key={chapter.id}>
                                <td className="text-center">{chapter.id}</td>
                                <td className="text-center">{chapter.name.substring(0, 15) + (chapter.name.length >= 15? "...": '')}</td>
                                <td className="text-center">{chapter.world.substring(0, 15) +(chapter.world.length >= 15? "...": '')}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <div className={styles.pagination}>
                        {Array.from({ length: totalPages }, (_, i) => i).map(page => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`${currentPage === page ? styles.active : ''}`}
                                style={{borderRadius: '6px'}}
                            >
                                {page + 1}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default ChaptersTable;