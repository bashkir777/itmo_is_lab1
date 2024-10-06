import React, { useState } from 'react';
import { MDBBtn, MDBInput } from 'mdb-react-ui-kit';
import styles from '../../../css/CreateOrdenForm.module.css';
import { ORDENS_URL } from "../../../tools/consts";

const CreateOrdenForm = ({ close, handleRefresh }) => {
    const [title, setTitle] = useState('');
    const [error, setError] = useState('');

    const onCreate = async () => {
        if (title.length < 7) {
            setError('Title must be at least 7 characters long');
            return;
        }

        try {
            const response = await fetch(ORDENS_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify({ title: title })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            handleRefresh();
        } catch (error) {
            console.error('Error creating orden:', error);
        } finally {
            close();
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.formContainer}>
                <h3 className="text-center mb-3">Create New Orden</h3>
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
                        <MDBBtn onClick={onCreate} style={{color: "white"}} type="submit" color="success" disabled={title.length < 7}>Create</MDBBtn>
                        <MDBBtn onClick={close} color="danger">Cancel</MDBBtn>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateOrdenForm;