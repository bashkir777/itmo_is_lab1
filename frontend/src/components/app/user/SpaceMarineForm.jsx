import React, { useState, useEffect } from 'react';
import { SPACE_MARINES_URL } from "../../../tools/consts";
import styles from '../../../css/SpaceMarineForm.module.css';
import { useDispatch } from "react-redux";
import { setError, setErrorMessage, setSuccess, setSuccessMessage } from "../../../redux/actions";

const SpaceMarineForm = ({ onSuccess, initialData = null }) => {

    const dispatch = useDispatch();

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
        existingChapterId: '',
        existingCoordinateId: '',
    });

    const accessToken = localStorage.getItem('accessToken');

    const [errors, setErrors] = useState({});

    const [useExistingChapter, setUseExistingChapter] = useState(false);
    const [useExistingCoordinate, setUseExistingCoordinate] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                id: initialData.id,
                name: initialData.name || '',
                x: initialData.x || '',
                y: initialData.y || '',
                chapterName: initialData.chapterName || '',
                chapterWorld: initialData.chapterWorld || '',
                health: initialData.health || '',
                category: initialData.category || '',
                weaponType: initialData.weaponType || '',
                meleeWeapon: initialData.meleeWeapon || '',
                existingChapterId: initialData.existingChapterId || '',
                existingCoordinateId: initialData.existingCoordinateId || '',
            });
            setUseExistingChapter(true);
            setUseExistingCoordinate(true);
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        // Очистка полей в зависимости от выбора
        if (name === 'x' || name === 'y') {
            setFormData(prev => ({ ...prev, existingCoordinateId: '' }));
        }
        if (name === 'chapterName' || name === 'chapterWorld') {
            setFormData(prev => ({ ...prev, existingChapterId: '' }));
        }
        if (name === 'existingCoordinateId') {
            setFormData(prev => ({ ...prev, x: '', y: '' }));
        }
        if (name === 'existingChapterId') {
            setFormData(prev => ({ ...prev, chapterName: '', chapterWorld: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name) newErrors.name = 'Name is required';
        if (!useExistingCoordinate) {
            if (!formData.x) newErrors.x = 'X coordinate is required';
            if (!formData.y) newErrors.y = 'Y coordinate is required';
            if (formData.y <= -954) newErrors.y = 'Y must be greater than -954';
        } else {
            if (!formData.existingCoordinateId) newErrors.existingCoordinateId = 'Existing coordinate ID is required';
            if (formData.existingCoordinateId < 1) newErrors.existingCoordinateId = 'Coordinate ID must be greater than 0';
        }
        if (!useExistingChapter) {
            if (!formData.chapterName) newErrors.chapterName = 'Chapter name is required';
            if (!formData.chapterWorld) newErrors.chapterWorld = 'Chapter world is required';
        } else {
            if (!formData.existingChapterId) newErrors.existingChapterId = 'Existing chapter ID is required';
            if (formData.existingChapterId < 1) newErrors.existingChapterId = 'Chapter ID must be greater than 0';
        }
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
                const method = initialData ? 'PATCH' : 'POST';
                const url = initialData ? `${SPACE_MARINES_URL}` : SPACE_MARINES_URL;

                const response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    },
                    body: JSON.stringify(formData),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const result = await response.json();

                dispatch(setSuccess(true));
                dispatch(setSuccessMessage(`SpaceMarine ${initialData ? 'updated' : 'created'} successfully!`));

                resetForm();
                onSuccess();
            } catch (error) {
                dispatch(setError(true));
                dispatch(setErrorMessage(`Error ${initialData ? 'updating' : 'creating'} SpaceMarine. Please, try again later`));
            }
        }
    };

    const resetForm = () => {
        setFormData({
            id: '',
            name: '',
            x: '',
            y: '',
            chapterName: '',
            chapterWorld: '',
            health: '',
            category: '',
            weaponType: '',
            meleeWeapon: '',
            existingChapterId: '',
            existingCoordinateId: '',
        });
        setErrors({});
        setUseExistingChapter(false);
        setUseExistingCoordinate(false);
    };

    const resetCoordinateErrors = () => {
        setErrors(prev => ({ ...prev, x: '', y: '', existingCoordinateId: '' }));
    };

    const resetChapterErrors = () => {
        setErrors(prev => ({ ...prev, chapterName: '', chapterWorld: '', existingChapterId: '' }));
    };

    return (
        <div className={styles.formContainer} >
            <form onSubmit={handleSubmit} className={styles.spaceMarineForm}>
                <h2>{initialData ? 'Update SpaceMarine' : 'Create SpaceMarine'}</h2>
                <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                        <label className="text-center" htmlFor="name">Name</label>
                        <input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                        {errors.name && <p className={styles.error}>{errors.name}</p>}
                    </div>

                    <div className={styles.formGroup}>
                        <div className="mb-2">
                            <label className="text-center">New Coordinates</label>
                            <input
                                type="radio"
                                name="coordinateOption"
                                checked={!useExistingCoordinate}
                                onChange={() => {
                                    setUseExistingCoordinate(false);
                                    resetCoordinateErrors();
                                }}
                            />

                            <label className="text-center">Existing Coordinate ID</label>
                            <input
                                type="radio"
                                name="coordinateOption"
                                checked={useExistingCoordinate}
                                onChange={() => {
                                    setUseExistingCoordinate(true);
                                    resetCoordinateErrors();
                                }}
                            />
                        </div>
                        {!useExistingCoordinate ? (
                            <>
                                <div>
                                    <label className="text-center" htmlFor="x">X coordinate</label>
                                    <input
                                        id="x"
                                        name="x"
                                        type="number"
                                        value={formData.x}
                                        onChange={handleChange}
                                        placeholder="X Coordinate"
                                        className="mb-2"
                                    />
                                    {errors.x && <p className={styles.error}>{errors.x}</p>}
                                </div>
                                <div>
                                    <label className="text-center" htmlFor="y">Y coordinate</label>
                                    <input
                                        id="y"
                                        name="y"
                                        type="number"
                                        value={formData.y}
                                        onChange={handleChange}
                                        placeholder="Y Coordinate"
                                    />
                                    {errors.y && <p className={styles.error}>{errors.y}</p>}
                                </div>
                            </>
                        ) : (
                            <div>
                                <label className="text-center" htmlFor="existingCoordinateId">Existing Coordinate ID</label>
                                <input
                                    id="existingCoordinateId"
                                    name="existingCoordinateId"
                                    type="number"
                                    value={formData.existingCoordinateId}
                                    onChange={handleChange}
                                    placeholder="Existing Coordinate ID"
                                />
                                {errors.existingCoordinateId && <p className={styles.error}>{errors.existingCoordinateId}</p>}
                            </div>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <div className="mb-2">
                            <label className="text-center">New Chapter</label>
                            <input
                                type="radio"
                                name="chapterOption"
                                checked={!useExistingChapter}
                                onChange={() => {
                                    setUseExistingChapter(false);
                                    resetChapterErrors();
                                }}
                            />

                            <label className="text-center">Existing Chapter ID</label>
                            <input
                                type="radio"
                                name="chapterOption"
                                checked={useExistingChapter}
                                onChange={() => {
                                    setUseExistingChapter(true);
                                    resetChapterErrors();
                                }}
                            />
                        </div>
                        {!useExistingChapter ? (
                            <>
                                <div>
                                    <label className="text-center" htmlFor="chapterName">Chapter Name</label>
                                    <input
                                        id="chapterName"
                                        name="chapterName"
                                        value={formData.chapterName}
                                        onChange={handleChange}
                                        placeholder="Chapter Name"
                                        className="mb-2"
                                    />
                                    {errors.chapterName && <p className={styles.error}>{errors.chapterName}</p>}
                                </div>
                                <div>
                                    <label className="text-center" htmlFor="chapterWorld">Chapter World</label>
                                    <input
                                        id="chapterWorld"
                                        name="chapterWorld"
                                        value={formData.chapterWorld}
                                        onChange={handleChange}
                                        placeholder="Chapter World"
                                    />
                                    {errors.chapterWorld && <p className={styles.error}>{errors.chapterWorld}</p>}
                                </div>
                            </>
                        ) : (
                            <div>
                                <label className="text-center" htmlFor="existingChapterId">Existing Chapter ID </label>
                                <input
                                    id="existingChapterId"
                                    name="existingChapterId"
                                    type="number"
                                    value={formData.existingChapterId}
                                    onChange={handleChange}
                                    placeholder="Existing Chapter ID"
                                />
                                {errors.existingChapterId && <p className={styles.error}>{errors.existingChapterId}</p>}
                            </div>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label className="text-center" htmlFor="health">Health</label>
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
                        <label className="text-center" htmlFor="category">Category</label>
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
                        <label className="text-center" htmlFor="weaponType">Weapon Type</label>
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

                    <div className={`${styles.formGroup}  ${styles.centeredItem}`}>
                        <label className="text-center" htmlFor="meleeWeapon">Melee Weapon</label>
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

                <button type="submit" className={styles.submitButton}>{initialData ? 'Update SpaceMarine' : 'Create SpaceMarine'}</button>
            </form>
        </div>
    );
};

export default SpaceMarineForm;