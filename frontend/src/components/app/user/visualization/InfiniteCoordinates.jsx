/* global Desmos */
import React, { useEffect, useRef, useState } from 'react';
import { SPACE_MARINES_INFO_URL } from "../../../../tools/consts";


const generateColorFromName = (name) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 50%)`;
};

const InfiniteCoordinates = () => {
    const [calculator, setCalculator] = useState(null);
    const calculatorRef = useRef(null);
    const [marines, setMarines] = useState([]);
    const hitboxRadius = 0.5;

    const fetchSpaceMarines = async () => {
        let page = 0;
        let allMarines = [];
        let totalPages = 1;

        try {
            while (page < totalPages) {
                const response = await fetch(`${SPACE_MARINES_INFO_URL}?page=${page}&size=10`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                allMarines = [...allMarines, ...data.content];
                totalPages = data.totalPages;
                page++;
            }
            setMarines(allMarines);
        } catch (error) {
            console.error('Error fetching space marines:', error);
        }
    };

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://www.desmos.com/api/v1.6/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6';
        script.async = true;
        script.onload = () => {
            const elt = document.getElementById('calculator');
            const calc = Desmos.GraphingCalculator(elt, {
                expressions: false,
                settingsMenu: false,
                zoomButtons: true,
                lockViewport: false,
            });
            setCalculator(calc);

            fetchSpaceMarines();
        };

        document.body.appendChild(script);

        return () => {
            if (calculator) {
                calculator.destroy();
            }
            document.body.removeChild(script);
        };
    }, []);

    useEffect(() => {
        if (calculator && marines.length > 0) {
            marines.forEach((marine, index) => {
                if (marine.x != null && marine.y != null) {
                    const color = generateColorFromName(marine.createdBy || "default");

                    calculator.setExpression({
                        id: `marine${index}`,
                        latex: `(${marine.x}, ${marine.y})`,
                        showLabel: true,
                        label: marine.name || `Marine ${index + 1}`,
                        color: color
                    });
                }
            });
        }
    }, [calculator, marines]);

    useEffect(() => {
        if (calculator && marines.length > 0) {
            const elt = document.getElementById('calculator');

            const handleClick = (event) => {
                const { offsetX, offsetY } = event;
                const graphCoordinates = calculator.pixelsToMath({ x: offsetX, y: offsetY });
                console.log('Координаты клика: ', graphCoordinates);

                marines.forEach((marine, index) => {
                    if (marine.x != null && marine.y != null) {
                        const distanceX = Math.abs(graphCoordinates.x - marine.x);
                        const distanceY = Math.abs(graphCoordinates.y - marine.y);

                        if (distanceX < hitboxRadius && distanceY < hitboxRadius) {
                            console.log(`Космодесантник ${marine.name} (id: ${marine.id})`, marine);
                        }
                    }
                });
            };

            elt.addEventListener('click', handleClick);

            return () => {
                elt.removeEventListener('click', handleClick);
            };
        }
    }, [calculator, marines]);

    return (
        <div>
            <div
                id="calculator"
                style={{ width: '100%', height: '700px' }}
                ref={calculatorRef}
            ></div>
        </div>
    );
};

export default InfiniteCoordinates;
