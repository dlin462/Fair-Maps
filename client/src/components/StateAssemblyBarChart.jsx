import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';

const StateAssemblyBarChart = ({ state }) => {
    const [stateAssemblyData, setStateAssemblyData] = useState([]);
    const chartRef = useRef(null);

    useEffect(() => {
        axios.get(`http://localhost:8080/stateAssemblyTable/${state}`)
            .then(response => {
                console.log('Response from server:', response.data);
                setStateAssemblyData(response.data);
            })
            .catch(error => {
                console.error('Error fetching stateAssembly data:', error);
            });
    }, [state]);

    useEffect(() => {
        if (stateAssemblyData.length > 0) {
            renderChart();
        }
    }, [stateAssemblyData]);

    const prepareChartData = () => {
        const colors = ['White', 'Black', 'Asian', 'Hispanic'];
        const data = colors.map(color => {
            const count = stateAssemblyData.filter(item => item.ethnicity === color).length;
            return count;
        });

        return data;
    };

    const renderChart = () => {
        const chartData = prepareChartData();

        if (chartRef.current) {
            chartRef.current.destroy();
        }

        const ctx = document.getElementById('barChart');
        chartRef.current = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['White', 'Black', 'Asian', 'Hispanic'],
                datasets: [{
                    label: 'Ethnicity Count',
                    data: chartData,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, // Important to ensure full height
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Assembly Members',
                            font: {
                                size: 16,
                                weight: 'bold',
                                family: 'Helvetica'
                            },
                            padding: 10
                        },
                        ticks: {
                            autoSkip: false,
                            maxRotation: 0,
                            minRotation: 0
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Ethnicity',
                            font: {
                                size: 16,
                                weight: 'bold',
                                family: 'Helvetica'
                            },
                            padding: 10
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'State Assembly Representation by Ethnicity',
                        font: {
                            size: 24,
                            weight: 'bold',
                            family: 'Helvetica'
                        },
                        padding: 20,
                        color: '#333'
                    }
                }
            }
        });
    };

    return (
        <div style={{ marginTop: '70px', width: '100%', height: '700px' }}>
            <canvas id="barChart"></canvas>
        </div>
    );
};

export default StateAssemblyBarChart;
