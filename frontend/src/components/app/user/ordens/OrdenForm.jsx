import React, { useState, useEffect } from 'react';
import { MDBBtn, MDBInput } from 'mdb-react-ui-kit';
import styles from '../../../../css/CreateOrdenForm.module.css';
import { ORDENS_URL } from "../../../../tools/consts";

const OrdenForm = ({ close, handleRefresh, init = {} }) => {
    const [title, setTitle] = useState(init.title || '');
    const [error, setError] = useState('');

    const onSubmit = async () => {
        if (title.length < 7) {
            setError('Title must be at least 7 characters long');
            return;
        }

        try {
            const method = init.id ? 'PATCH' : 'POST';

            const response = await fetch(ORDENS_URL, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify(init.id ? { id: init.id, title: title } : {title: title})
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            handleRefresh();
        } catch (error) {
            console.error('Error creating/updating orden:', error);
        } finally {
            close();
        }
    };

    const formTitle = init.id ? 'Update Orden' : 'Create New Orden';

    return (
        <div className={styles.overlay}>
            <div className={styles.formContainer}>
                <h3 className="text-center mb-3">{formTitle}</h3>
                <div>
                    <MDBInput
                        label="Title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    {error && <p className={styles.errorMessage}>{error}</p>}
                    <div className={styles.buttonGroup}>
                        <MDBBtn onClick={onSubmit} style={{color: "white"}} type="submit" color="success" disabled={title.length < 7}>{init.id ? 'Update' : 'Create'}</MDBBtn>
                        <MDBBtn onClick={close} color="danger">Cancel</MDBBtn>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrdenForm;