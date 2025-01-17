import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import {useDispatch, useSelector} from "react-redux";
import { setSuccess, setSuccessMessage } from "../../../../redux/actions";
import {selectAccessToken} from "../../../../redux/selectors";

const Import = () => {
    const [errors, setErrors] = useState([]);
    const [isFileValid, setIsFileValid] = useState(false);
    const [currentFile, setCurrentFile] = useState(null);
    const dispatch = useDispatch();
    const accessToken = useSelector(selectAccessToken);
    const onDrop = useCallback((acceptedFiles) => {
        if (currentFile) {
            setErrors(["You already have a file loaded. Please remove the current file to upload a new one."]);
            return;
        }

        const file = acceptedFiles[0];
        setCurrentFile(file);

        const reader = new FileReader();

        reader.onabort = () => console.log("File reading was aborted");
        reader.onerror = () => console.log("File reading has failed");
        reader.onload = () => {
            const fileContent = reader.result;

            try {
                const parsedData = JSON.parse(fileContent);

                const validationErrors = validateData(parsedData);
                if (validationErrors.length > 0) {
                    setErrors(validationErrors);
                    setIsFileValid(false);
                    console.error("Validation errors:", validationErrors);
                } else {
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

    const validateData = (data) => {
        const errors = [];

        if (!Array.isArray(data.listMarines)) {
            errors.push("JSON file must contain a list of objects");
            return errors;
        }

        data.listMarines.forEach((item, index) => {
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

    const handleSubmit = async () => {
        if (!isFileValid || !currentFile) {
            setErrors(["File is not valid or not loaded"]);
            return;
        }

        const formData = new FormData();
        formData.append("file", currentFile);

        try {
            const response = await fetch("/api/v1/import", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                },
                body: formData
            });

            if (response.ok) {
                console.log("File successfully sent to the server");
                setErrors([]);
                setIsFileValid(false);
                setCurrentFile(null);
                dispatch(setSuccess(true));
                dispatch(setSuccessMessage("File imported successfully!"))
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

    const handleRemoveFile = () => {
        setCurrentFile(null);
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
                    Send File to Server
                </button>
            )}
        </div>
    );
};

export default Import;