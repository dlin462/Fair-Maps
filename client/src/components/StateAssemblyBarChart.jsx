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
                    label: '',
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
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Ethnicity'
                        }
                    }
                }
            }
        });
    };

    return (
        <div style={{ width: '90%', margin: '0 auto', height: '500px' }}>
            <h2 style={{ textAlign: 'center', fontSize: '40px' }}>State Assembly Bar Chart</h2>
            <canvas id="barChart"></canvas>
        </div>
    );
};

export default StateAssemblyBarChart;