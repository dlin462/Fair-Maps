import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const PieChartComponent = ({ showPieChartAssembly, state }) => {
    const chartContainerRefAssembly = useRef(null);
    const chartRef = useRef(null);

    useEffect(() => {
        const ctx = chartContainerRefAssembly.current && chartContainerRefAssembly.current.getContext('2d');

        if (ctx) {
            // Destroy existing chart instance
            if (chartRef.current) {
                chartRef.current.destroy();
            }

            if (showPieChartAssembly) {
                let data;
                if (state === 'nevada') {
                    data = {
                        labels: ['WHITE', 'HISPANIC', 'BLACK', 'ASIAN', 'OTHER'],
                        datasets: [
                            {
                                label: 'RACIAL DEMOGRAPHICS',
                                data: [62, 24, 9, 3, 2],
                                backgroundColor: [
                                    'rgb(255, 99, 132)',
                                    'rgb(54, 162, 235)',
                                    'rgb(255, 205, 86)',
                                    'rgb(75, 192, 192)',
                                    'rgb(128, 128, 128)',
                                ],
                                hoverOffset: 4,
                            },
                        ],
                    };
                } else {
                    data = {
                        labels: ['WHITE', 'LATINO', 'ASIAN', 'BLACK', 'NATIVE AMERICAN'],
                        datasets: [
                            {
                                label: 'RACIAL DEMOGRAPHICS',
                                data: [49, 25, 15, 10, 1],
                                backgroundColor: [
                                    'rgb(255, 99, 132)',
                                    'rgb(54, 162, 235)',
                                    'rgb(255, 205, 86)',
                                    'rgb(75, 192, 192)',
                                    'rgb(128, 128, 128)',
                                ],
                                hoverOffset: 4,
                            },
                        ],
                    };
                }

                const options = {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: `RACIAL DEMOGRAPHICS OF STATE ASSEMBLY OF ${state.toUpperCase()}`,
                            font: {
                                size: 24,
                            },
                            color: '#333333',
                        },
                    },
                };

                chartRef.current = new Chart(ctx, {
                    type: 'doughnut',
                    data: data,
                    options: options,
                });
            }
        }
    }, [showPieChartAssembly, state]);

    return (
        <>
            {showPieChartAssembly && (
                <div>
                    <canvas ref={chartContainerRefAssembly} width={600} height={600} />
                </div>
            )}
        </>
    );
};

export default PieChartComponent;