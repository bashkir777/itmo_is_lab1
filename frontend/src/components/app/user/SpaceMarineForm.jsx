import React, { useState } from 'react';
import { SPACE_MARINES_URL } from "../../../tools/consts";
import styles from '../../../css/SpaceMarineForm.module.css';

const SpaceMarineForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        x: '',
        y: '',
        chapterName: '',
        chapterWorld: '',
        health: '',
        category: '',
        weaponType: '',
        meleeWeapon: '',
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.x) newErrors.x = 'X coordinate is required';
        if (!formData.y) newErrors.y = 'Y coordinate is required';
        if (formData.y <= -954) newErrors.y = 'Y must be greater than -954';
        if (!formData.chapterName) newErrors.chapterName = 'Chapter name is required';
        if (!formData.chapterWorld) newErrors.chapterWorld = 'Chapter world is required';
        if (!formData.health) newErrors.health = 'Health is required';
        if (formData.health <= 0) newErrors.health = 'Health must be greater than 0';
        if (!formData.category) newErrors.category = 'Category is required';
        if (!formData.weaponType) newErrors.weaponType = 'Weapon type is required';
        if (!formData.meleeWeapon) newErrors.meleeWeapon = 'Melee weapon is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            try {
                const response = await fetch(SPACE_MARINES_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const result = await response.json();
                console.log('SpaceMarine created:', result);
                alert('SpaceMarine created successfully!');
            } catch (error) {
                console.error('Error creating SpaceMarine:', error);
                alert('Error creating SpaceMarine. Please check the console for details.');
            }
        }
    };

    const backgroundImageUrl = 'url(/img/sea.jpg)';

    const isPhone = window.innerWidth < 768;
    const backgroundStyle = {
        backgroundImage:  backgroundImageUrl,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: isPhone ? '96vh' : '95vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    };

    return (
        <div className={styles.formContainer} style={backgroundStyle}>
            <form onSubmit={handleSubmit} className={styles.spaceMarineForm}>
                <h2>Create SpaceMarine</h2>
                <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                        <label htmlFor="name">Name</label>
                        <input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                        {errors.name && <p className={styles.error}>{errors.name}</p>}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="x">X Coordinate</label>
                        <input
                            id="x"
                            name="x"
                            type="number"
                            value={formData.x}
                            onChange={handleChange}
                        />
                        {errors.x && <p className={styles.error}>{errors.x}</p>}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="y">Y Coordinate</label>
                        <input
                            id="y"
                            name="y"
                            type="number"
                            value={formData.y}
                            onChange={handleChange}
                        />
                        {errors.y && <p className={styles.error}>{errors.y}</p>}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="chapterName">Chapter Name</label>
                        <input
                            id="chapterName"
                            name="chapterName"
                            value={formData.chapterName}
                            onChange={handleChange}
                        />
                        {errors.chapterName && <p className={styles.error}>{errors.chapterName}</p>}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="chapterWorld">Chapter World</label>
                        <input
                            id="chapterWorld"
                            name="chapterWorld"
                            value={formData.chapterWorld}
                            onChange={handleChange}
                        />
                        {errors.chapterWorld && <p className={styles.error}>{errors.chapterWorld}</p>}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="health">Health</label>
                        <input
                            id="health"
                            name="health"
                            type="number"
                            value={formData.health}
                            onChange={handleChange}
                        />
                        {errors.health && <p className={styles.error}>{errors.health}</p>}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="category">Category</label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                        >
                            <option value="">Select Category</option>
                            <option value="SCOUT">SCOUT</option>
                            <option value="DREADNOUGHT">DREADNOUGHT</option>
                            <option value="AGGRESSOR">AGGRESSOR</option>
                            <option value="SUPPRESSOR">SUPPRESSOR</option>
                            <option value="INCEPTOR">INCEPTOR</option>
                        </select>
                        {errors.category && <p className={styles.error}>{errors.category}</p>}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="weaponType">Weapon Type</label>
                        <select
                            id="weaponType"
                            name="weaponType"
                            value={formData.weaponType}
                            onChange={handleChange}
                        >
                            <option value="">Select Weapon Type</option>
                            <option value="FLAMER">FLAMER</option>
                            <option value="HEAVY_FLAMER">HEAVY_FLAMER</option>
                            <option value="MULTI_MELTA">MULTI_MELTA</option>
                        </select>
                        {errors.weaponType && <p className={styles.error}>{errors.weaponType}</p>}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="meleeWeapon">Melee Weapon</label>
                        <select
                            id="meleeWeapon"
                            name="meleeWeapon"
                            value={formData.meleeWeapon}
                            onChange={handleChange}
                        >
                            <option value="">Select Melee Weapon</option>
                            <option value="CHAIN_AXE">CHAIN_AXE</option>
                            <option value="MANREAPER">MANREAPER</option>
                            <option value="POWER_BLADE">POWER_BLADE</option>
                        </select>
                        {errors.meleeWeapon && <p className={styles.error}>{errors.meleeWeapon}</p>}
                    </div>
                </div>

                <button type="submit" className={styles.submitButton}>Create SpaceMarine</button>
            </form>
        </div>
    );
};

export default SpaceMarineForm;