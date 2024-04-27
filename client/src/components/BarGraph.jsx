import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const BarGraphComponent = ({ showBarGraph, state }) => {
    const chartContainerRefBarGraph = useRef(null);
    const chartRef = useRef(null);

    useEffect(() => {
        const ctx = chartContainerRefBarGraph.current && chartContainerRefBarGraph.current.getContext('2d');

        if (ctx) {
            // Destroy existing chart instance
            if (chartRef.current) {
                chartRef.current.destroy();
            }

            if (showBarGraph) {
                let data;
                const labels = ["WHITE", "BLACK", "ASIAN", "HISPANIC", "OTHER"];

                if (state === "nevada") {
                    data = {
                        labels: labels,
                        datasets: [
                            {
                                label: 'Assembly',
                                data: [62, 9, 3, 24, 2],
                                backgroundColor: 'rgba(255, 205, 86, 0.6)',
                                borderColor: 'rgba(255, 205, 86, 1)',
                                borderWidth: 1,
                            },
                            {
                                label: 'Population',
                                data: [40, 13, 6, 40, 1],
                                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                                borderColor: 'rgba(75, 192, 192, 1)',
                                borderWidth: 1,
                            },
                        ]
                    };
                } else {
                    data = {
                        labels: labels,
                        datasets: [
                            {
                                label: 'Assembly',
                                data: [49, 10, 15, 25, 1],
                                backgroundColor: 'rgba(255, 205, 86, 0.6)',
                                borderColor: 'rgba(255, 205, 86, 1)',
                                borderWidth: 1,
                            },
                            {
                                label: 'Voter Population',
                                data: [37, 5, 15, 39, 4],
                                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                                borderColor: 'rgba(75, 192, 192, 1)',
                                borderWidth: 1,
                            },
                        ]
                    };
                }

                const options = {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: `RACIAL GAP ASSESSMENT FOR ${state.toUpperCase()}`,
                            font: {
                                size: 24
                            },
                            color: '#333333'
                        }
                    }
                };

                chartRef.current = new Chart(ctx, {
                    type: 'bar',
                    data: data,
                    options: options
                });
            }
        }
    }, [showBarGraph, state]);

    return (
        <div>
            {showBarGraph && (
                <div>
                    <canvas ref={chartContainerRefBarGraph} width={600} height={400} />
                </div>
            )}
        </div>
    );
};

export default BarGraphComponent;