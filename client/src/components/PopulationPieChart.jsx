import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const PopulationPieChartComponent = ({ showPieChartPopulation, state }) => {
    const chartContainerRefPopulation = useRef(null);
    const chartRef = useRef(null);

    useEffect(() => {
        const ctx = chartContainerRefPopulation.current && chartContainerRefPopulation.current.getContext('2d');

        if (ctx) {
            // Destroy existing chart instance
            if (chartRef.current) {
                chartRef.current.destroy();
            }

            if (showPieChartPopulation) {
                let data;
                if (state === "nevada") {
                    data = {
                        labels: ['WHITE', 'HISPANIC', 'BLACK', 'ASIAN', 'OTHER'],
                        datasets: [{
                            label: 'RACIAL DEMOGRAPHICS',
                            data: [40, 40, 13, 6, 1],
                            backgroundColor: [
                                'rgb(255, 99, 132)',
                                'rgb(54, 162, 235)',
                                'rgb(255, 205, 86)',
                                'rgb(75, 192, 192)',
                                'rgb(128, 128, 128)'
                            ],
                            hoverOffset: 4
                        }]
                    };
                } else {
                    data = {
                        labels: ['WHITE', 'LATINO', 'ASIAN', 'BLACK', 'NATIVE AMERICAN'],
                        datasets: [{
                            label: 'RACIAL DEMOGRAPHICS',
                            data: [37, 39, 15, 5, 4],
                            backgroundColor: [
                                'rgb(255, 99, 132)',
                                'rgb(54, 162, 235)',
                                'rgb(255, 205, 86)',
                                'rgb(75, 192, 192)',
                                'rgb(128, 128, 128)'
                            ],
                            hoverOffset: 4
                        }]
                    };
                }

                const options = {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: `${state.toUpperCase()} POPULATION RACIAL DEMOGRAPHICS`,
                            font: {
                                size: 24
                            },
                            color: '#333333'
                        }
                    }
                };

                chartRef.current = new Chart(ctx, {
                    type: 'doughnut',
                    data: data,
                    options: options,
                });
            }
        }
    }, [showPieChartPopulation, state]);

    return (
        <div>
            {showPieChartPopulation && (
                <div>
                    <canvas ref={chartContainerRefPopulation} width={600} height={600} />
                </div>
            )}
        </div>
    );
};

export default PopulationPieChartComponent;