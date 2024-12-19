import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

const Import = () => {
    const [errors, setErrors] = useState([]);
    const [jsonData, setJsonData] = useState(null); // Сохраняем данные после валидации
    const [isFileValid, setIsFileValid] = useState(false); // Флаг для проверки валидности файла
    const [currentFile, setCurrentFile] = useState(null); // Текущий файл

    // Обработчик загрузки файла
    const onDrop = useCallback((acceptedFiles) => {
        if (currentFile) {
            setErrors(["You already have a file loaded. Please remove the current file to upload a new one."]);
            return;
        }

        const file = acceptedFiles[0]; // Берем только первый файл
        setCurrentFile(file); // Сохраняем текущий файл

        const reader = new FileReader();

        reader.onabort = () => console.log("File reading was aborted");
        reader.onerror = () => console.log("File reading has failed");
        reader.onload = () => {
            const fileContent = reader.result;

            try {
                const parsedData = JSON.parse(fileContent);

                // Валидация данных
                const validationErrors = validateData(parsedData);
                if (validationErrors.length > 0) {
                    setErrors(validationErrors);
                    setIsFileValid(false);
                    console.error("Validation errors:", validationErrors);
                } else {
                    setJsonData(parsedData); // Сохраняем данные после валидации
                    setIsFileValid(true);
                    setErrors([]);
                    console.log("Parsed and validated JSON:", parsedData);
                }
            } catch (error) {
                console.error("Invalid JSON file:", error);
                setErrors(["Invalid JSON file"]);
                setIsFileValid(false);
            }
        };

        reader.readAsText(file);
    }, [currentFile]);

    // Валидация данных
    const validateData = (data) => {
        const errors = [];

        if (!Array.isArray(data)) {
            errors.push("JSON file must contain a list of objects");
            return errors;
        }

        data.forEach((item, index) => {
            if (!item.name) errors.push(`Item ${index + 1}: Name is required`);
            if (!item.x) errors.push(`Item ${index + 1}: X coordinate is required`);
            if (!item.y) errors.push(`Item ${index + 1}: Y coordinate is required`);
            if (item.y <= -954) errors.push(`Item ${index + 1}: Y must be greater than -954`);
            if (!item.chapterName) errors.push(`Item ${index + 1}: Chapter name is required`);
            if (!item.chapterWorld) errors.push(`Item ${index + 1}: Chapter world is required`);
            if (!item.health) errors.push(`Item ${index + 1}: Health is required`);
            if (item.health <= 0) errors.push(`Item ${index + 1}: Health must be greater than 0`);
            if (!item.category) errors.push(`Item ${index + 1}: Category is required`);
            if (!item.weaponType) errors.push(`Item ${index + 1}: Weapon type is required`);
            if (!item.meleeWeapon) errors.push(`Item ${index + 1}: Melee weapon is required`);
        });

        return errors;
    };

    // Функция отправки данных на сервер
    const handleSubmit = async () => {
        if (!isFileValid || !jsonData) {
            setErrors(["File is not valid or not loaded"]);
            return;
        }

        try {
            const response = await fetch("/api/v1/import", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify({
                    listMarines: jsonData // Отправляем данные в формате { "listMarines": [...] }
                })
            });

            if (response.ok) {
                console.log("Data successfully sent to the server");
                setErrors([]);
                setJsonData(null);
                setIsFileValid(false);
                setCurrentFile(null); // Сбрасываем текущий файл
                alert("Data imported successfully!");
            } else {
                const errorMessage = await response.text();
                setErrors([`Server error: ${errorMessage}`]);
                console.error("Server error:", errorMessage);
            }
        } catch (error) {
            setErrors(["Network error. Please try again later."]);
            console.error("Network error:", error);
        }
    };

    // Функция удаления текущего файла
    const handleRemoveFile = () => {
        setCurrentFile(null);
        setJsonData(null);
        setIsFileValid(false);
        setErrors([]);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
        <div
            className="d-flex flex-column align-items-center justify-content-center vh-100"
            style={{
                backgroundImage: 'url("/img/sea.jpg")',
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            {currentFile ? (
                <div
                    className="dropzone p-4 border border-2 border-dashed rounded-3 text-center bg-light bg-opacity-75"
                    style={{ width: "50%", height: "auto" }}
                >
                    <p className="fs-5 fw-bold">
                        Current file: {currentFile.name}
                    </p>
                    <button
                        className="btn btn-danger"
                        onClick={handleRemoveFile}
                    >
                        Remove File
                    </button>
                </div>
            ) : (
                <div
                    {...getRootProps()}
                    className="dropzone p-5 border border-2 border-dashed rounded-3 text-center bg-light bg-opacity-75"
                    style={{ width: "50%", height: "300px" }}
                >
                    <input {...getInputProps()} />
                    {isDragActive ? (
                        <p className="fs-4 fw-bold">Drop the JSON file here...</p>
                    ) : (
                        <p className="fs-4 fw-bold">
                            Drag and drop a JSON file here, or click to select a file
                        </p>
                    )}
                </div>
            )}

            {errors.length > 0 && (
                <div className="mt-4 bg-danger bg-opacity-10 border border-danger rounded-3 p-3 w-50">
                    <h3 className="text-danger fs-5 mb-3">Validation Errors:</h3>
                    <ul className="list-unstyled m-0">
                        {errors.map((error, index) => (
                            <li key={index} className="text-dark">
                                {error}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {isFileValid && (
                <button
                    className="mt-4 btn btn-primary btn-lg"
                    onClick={handleSubmit}
                >
                    Send Data to Server
                </button>
            )}
        </div>
    );
};

export default Import;