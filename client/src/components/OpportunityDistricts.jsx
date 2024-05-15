import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import '../App.css';

function OpportunityDistricts({ state }) {
    const [data, setData] = useState([]);
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        axios.get(`http://localhost:8080/opportunityDistrict/${state}`)
            .then(response => {
                console.log('Response from server:', response.data);
                setData(response.data);
                updateChart(response.data);
            })
            .catch(error => {
                console.error('Error fetching Opportunity District data:', error);
            });
    }, [state]);

    const updateChart = (data) => {
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            const races = data.map(item => item.race);
            const enacted = data.map(item => Math.floor(item.enactedOpp));
            const firstThresholdAvg = data.map(item => Math.floor(item.firstThreshold.ensembleAvg));
            const secondThresholdAvg = data.map(item => Math.floor(item.secondThreshold.ensembleAvg));
            const thirdThresholdAvg = data.map(item => Math.floor(item.thirdThreshold.ensembleAvg));

            chartInstance.current = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: races,
                    datasets: [
                        {
                            label: 'Enacted',
                            data: enacted,
                            backgroundColor: 'rgba(255, 99, 132, 0.8)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1
                        },
                        {
                            label: 'First Threshold',
                            data: firstThresholdAvg,
                            backgroundColor: 'rgba(54, 162, 235, 0.8)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1
                        },
                        {
                            label: 'Second Threshold',
                            data: secondThresholdAvg,
                            backgroundColor: 'rgba(255, 206, 86, 0.8)',
                            borderColor: 'rgba(255, 206, 86, 1)',
                            borderWidth: 1
                        },
                        {
                            label: 'Third Threshold',
                            data: thirdThresholdAvg,
                            backgroundColor: 'rgba(75, 192, 192, 0.8)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: `Opportunity Districts by Race in ${state}`,
                            font: {
                                size: 18
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    };

    return (
        <div >
        <div className="table">
            <div className='table-container'>
                <table>
                    <thead>
                        <tr>
                            <th>Race</th>
                            <th>Ideal Population</th>
                            <th>Race Population</th>
                            <th>Enacted</th>
                            <th>First Threshold</th>
                            <th>Second Threshold</th>
                            <th>Third Threshold</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index}>
                                <td>{item.race}</td>
                                <td>{Math.ceil(item.idealPop)}</td>
                                <td>{item.racePop}</td>
                                <td>{Math.floor(item.enactedOpp)}</td>
                                <td>{Math.floor(item.firstThreshold.ensembleAvg)}</td>
                                <td>{Math.floor(item.secondThreshold.ensembleAvg)}</td>
                                <td>{Math.floor(item.thirdThreshold.ensembleAvg)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        <div className="chart-container" style={{ marginLeft:'10px',marginTop: '60px', height: '500px', width:'95%'}}>
            <canvas ref={chartRef}  ></canvas>
        </div>
    </div>

        
    );
}

export default OpportunityDistricts;
