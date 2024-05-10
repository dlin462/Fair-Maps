import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

const StateAssemblyBarChart = ({ state }) => {
    const [stateAssemblyData, setStateAssemblyData] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:8080/stateAssemblyTable/${state}`)
            .then(response => {
                console.log('Response from server:', response.data);
                setStateAssemblyData(response.data);
            })
            .catch(error => {
                console.error('Error fetching stateAssembly data:', error);
            });
    }, []);

    const prepareChartData = () => {
        const colors = ['White', 'Black', 'Asian', 'Hispanic'];
        const data = {
            labels: colors,
            datasets: [{
                label: '',
                data: [0, 0, 0, 0],
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
            }],
        };

        stateAssemblyData.forEach(item => {
            const index = colors.indexOf(item.ethnicity);
            if (index !== -1) {
                data.datasets[0].data[index]++;
            }
        });

        return data;
    };

    return (
        <div style={{ width: '90%', margin: '0 auto', height: '500px' }}>
            <h2 style={{ textAlign: 'center', fontSize: '40px' }}>State Assembly Bar Chart</h2>
            <Bar
                data={prepareChartData()}
                options={{
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
                    },
                    
                }}
            />
        </div>
    );
};

export default StateAssemblyBarChart;