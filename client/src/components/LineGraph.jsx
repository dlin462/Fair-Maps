import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const LineGraphComponent = ({ showLineGraph, state }) => {
    const chartContainerRefMinority = useRef(null);
    const chartRef = useRef(null);

    useEffect(() => {
        const ctx = chartContainerRefMinority.current && chartContainerRefMinority.current.getContext('2d');

        if (ctx) {
            // Destroy existing chart instance
            if (chartRef.current) {
                chartRef.current.destroy();
            }

            if (showLineGraph) {
                let data;
                const startYear = 1990;
                const endYear = 2018;
                const interval = 4;
                const labels = Array.from(
                    { length: Math.floor((endYear - startYear) / interval) + 1 },
                    (_, index) => startYear + index * interval
                );
                if (state === "nevada") {
                    data = {
                        labels: labels,
                        datasets: [
                            {
                                label: 'WHITE',
                                data: [51.3, 51, 48, 50, 52, 47, 45.8, 57.5],
                                fill: false,
                                borderColor: 'rgb(75, 192, 192)',
                                tension: 0.1
                            },
                            {
                                label: 'BLACK',
                                data: [42.5, 40, 41.8, 43, 42.5, 42.7, 40.6, 51.4],
                                fill: false,
                                borderColor: 'rgb(54, 162, 235)',
                                tension: 0.1
                            },
                            {
                                label: 'ASIAN',
                                data: [40.2, 40, 34.5, 33.5, 34, 33.5, 26.9, 40.2],
                                fill: false,
                                borderColor: 'rgb(255, 205, 86)',
                                tension: 0.1
                            },
                            {
                                label: 'HISPANIC',
                                data: [36.0, 34.5, 33.8, 33.5, 34.2, 33.5, 27, 40.4],
                                fill: false,
                                borderColor: 'rgb(128, 128, 128)',
                                tension: 0.1
                            }
                        ]
                    };
                } else {
                    data = {
                        labels: labels,
                        datasets: [
                            {
                                label: 'WHITE',
                                data: [48, 52, 41, 52, 54, 49, 44, 51.5],
                                fill: false,
                                borderColor: 'rgb(75, 192, 192)',
                                tension: 0.1
                            },
                            {
                                label: 'BLACK',
                                data: [42.0, 41, 41.2, 49, 42.0, 42.1, 42.6, 53.4],
                                fill: false,
                                borderColor: 'rgb(54, 162, 235)',
                                tension: 0.1
                            },
                            {
                                label: 'ASIAN',
                                data: [41.2, 40, 36.5, 33.5, 33, 33.5, 28.9, 45.2],
                                fill: false,
                                borderColor: 'rgb(255, 205, 86)',
                                tension: 0.1
                            },
                            {
                                label: 'HISPANIC',
                                data: [31.0, 37.5, 33.9, 43.5, 44.2, 43.5, 37, 41.4],
                                fill: false,
                                borderColor: 'rgb(128, 128, 128)',
                                tension: 0.1
                            }
                        ]
                    };
                }

                const options = {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: `VOTER TURNOUT FOR ${state.toUpperCase()}`,
                            font: {
                                size: 24
                            },
                            color: '#333333'
                        }
                    }
                };
                chartRef.current = new Chart(ctx, {
                    type: 'line',
                    data: data,
                    options: options
                });
            }
        }
    }, [showLineGraph, state]);

    return (
        <div>
            {showLineGraph && (
                <div>
                    <canvas ref={chartContainerRefMinority} width={600} height={400} />
                </div>
            )}
        </div>
    );
};

export default LineGraphComponent;