


import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import '../App.css';

function OpportunityDistricts({ state }) {
    const [data, setData] = useState([]);
    const chartRef1 = useRef(null);
    const chartRef2 = useRef(null);
    const chartRef3 = useRef(null);
    const chartRef4 = useRef(null);
    const chartInstance1 = useRef(null);
    const chartInstance2 = useRef(null);
    const chartInstance3 = useRef(null);
    const chartInstance4 = useRef(null);

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
        // Destroy existing chart instances if they exist
        if (chartInstance1.current) {
            chartInstance1.current.destroy();
        }
        if (chartInstance2.current) {
            chartInstance2.current.destroy();
        }
        if (chartInstance3.current) {
            chartInstance3.current.destroy();
        }
        if (chartInstance4.current) {
            chartInstance4.current.destroy();
        }
        
        // Create first chart
        if (chartRef1.current) {
            const ctx = chartRef1.current.getContext('2d');
            const races = data.map(item => item.race);
            const enacted = data.map(item => Math.floor(item.enactedOpp));
            const firstThresholdAvg = data.map(item => Math.floor(item.firstThreshold.ensembleAvg));
            const secondThresholdAvg = data.map(item => Math.floor(item.secondThreshold.ensembleAvg));
            const thirdThresholdAvg = data.map(item => Math.floor(item.thirdThreshold.ensembleAvg));

            chartInstance1.current = new Chart(ctx, {
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
                            label: '0.37 Threshold',
                            data: firstThresholdAvg,
                            backgroundColor: 'rgba(54, 162, 235, 0.8)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1
                        },
                        {
                            label: '0.5 Threshold',
                            data: secondThresholdAvg,
                            backgroundColor: 'rgba(255, 206, 86, 0.8)',
                            borderColor: 'rgba(255, 206, 86, 1)',
                            borderWidth: 1
                        },
                        {
                            label: '0.6 Threshold',
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
                            text: `Opportunity Districts by Race in ${state} (5000 Ensembles)`,
                            font: {
                                size: 18
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Number of Opportunity Districts'
                            }
                        }
                    }
                }
            });
        }

    

        // Create second chart
        if (chartRef2.current) {
            const ctx = chartRef2.current.getContext('2d');
            const races = data.map(item => item.race);
            // const firstThresholdAvg = data.map(item => Math.floor(item.firstThreshold.ensembleAvg));
            // const secondThresholdAvg = data.map(item => Math.floor(item.secondThreshold.ensembleAvg));
            // const thirdThresholdAvg = data.map(item => Math.floor(item.thirdThreshold.ensembleAvg));
            const firstThresholdFirstAvg = data.map(item => Math.floor(item.firstThreshold.ensembleAvg));
            const Enacted = data.map(item => Math.floor(formatNumber(Math.floor(item.enactedOpp))));

            chartInstance2.current = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: races,
                    datasets: [
                        {
                            label: 'Average',
                            data: firstThresholdFirstAvg,
                            backgroundColor: 'rgba(255, 206, 86, 0.8)',
                            borderColor: 'rgba(255, 206, 86, 1)',
                            borderWidth: 1
                        },
                        {
                            label: 'Initial',
                            data: Enacted,
                            backgroundColor: 'rgba(75, 192, 192, 0.8)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1
                        },
                    ]
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: `5000 Plans First Threshold ${state}`,
                            font: {
                                size: 18
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Number of Opportunity Districts'
                            }
                        }
                    }
                }
            });
        }
        if (chartRef3.current) {
            const ctx = chartRef3.current.getContext('2d');
            const races = data.map(item => item.race);
            const secondThresholdFirstAvg = data.map(item => Math.floor(item.secondThreshold.ensembleAvg));
            const Enacted = data.map(item => Math.floor(formatNumber(Math.floor(item.enactedOpp))));

            chartInstance3.current = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: races,
                    datasets: [
                        {
                            label: 'Average',
                            data: secondThresholdFirstAvg,
                            backgroundColor: 'rgba(255, 206, 86, 0.8)',
                            borderColor: 'rgba(255, 206, 86, 1)',
                            borderWidth: 1
                        },
                        {
                            label: 'Initial',
                            data: Enacted,
                            backgroundColor: 'rgba(75, 192, 192, 0.8)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1
                        },
                    ]
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: `5000 Plans Second Threshold ${state}`,
                            font: {
                                size: 18
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Number of Opportunity Districts'
                            }
                        }
                    }
                }
            });
        }
        if (chartRef4.current) {
            const ctx = chartRef4.current.getContext('2d');
            const races = data.map(item => item.race);
            const Enacted = data.map(item => Math.floor(formatNumber(Math.floor(item.enactedOpp))));
            const thirdThresholdFirstAvg = data.map(item => Math.floor(item.thirdThreshold.ensembleAvg));

            chartInstance4.current = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: races,
                    datasets: [
                        {
                            label: 'Average',
                            data: thirdThresholdFirstAvg,
                            backgroundColor: 'rgba(255, 206, 86, 0.8)',
                            borderColor: 'rgba(255, 206, 86, 1)',
                            borderWidth: 1
                        },
                        {
                            label: 'Initial',
                            data: Enacted,
                            backgroundColor: 'rgba(75, 192, 192, 0.8)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1
                        },
                    ]
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: `5000 Plans Third Threshold ${state}`,
                            font: {
                                size: 18
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Number of Opportunity Districts'
                            }
                        }
                    }
                }
            });
        }
    };

    const formatNumber = (number) => {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    return (
        <div className="opportunity-districts-container">
            <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ width: '15%', textAlign: 'center', fontWeight: 'bold' }}>Ethnic Group</div>
                <div style={{ width: '15%', textAlign: 'center', fontWeight: 'bold' }}>First Threshold</div>
                <div style={{ width: '15%', textAlign: 'center', fontWeight: 'bold' }}>Second Threshold</div>
                <div style={{ width: '15%', textAlign: 'center', fontWeight: 'bold' }}>Third Threshold</div>
            </div>
            {data.map((item, index) => (
                <div key={index} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', boxShadow: '1px 1px #ECECEC', borderRadius: '10px', marginBottom: '10px', padding: '10px', border: '0.5px solid #ECECEC' }}>
                    <div style={{ width: '15%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <span>{item.race}</span>
                        <span>Pop: {formatNumber(item.racePop)}</span>
                        <span>Ideal Pop: {formatNumber(Math.ceil(item.idealPop))}</span>
                        <span>Enacted: {formatNumber(Math.floor(item.enactedOpp))}</span>
                    </div>
                    <div style={{ width: '15%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <span>Max: {Math.floor(item.firstThreshold.ensembleMax)}</span>
                        <span>Avg: {Math.floor(item.firstThreshold.ensembleAvg)}</span>
                    </div>
                    <div style={{ width: '15%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <span>Max: {Math.floor(item.secondThreshold.ensembleMax)}</span>
                        <span>Avg: {Math.floor(item.secondThreshold.ensembleAvg)}</span>
                    </div>
                    <div style={{ width: '15%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <span>Max: {Math.floor(item.thirdThreshold.ensembleMax)}</span>
                        <span>Avg: {Math.floor(item.thirdThreshold.ensembleAvg)}</span>
                    </div>
                </div>
            ))}
        </div>
            
            {/* <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Race</th>
                            <th>Ideal Population</th>
                            <th>Population</th>
                            <th>Enacted</th>
                            <th>0.37 Threshold</th>
                            <th>0.5 Threshold</th>
                            <th>0.6 Threshold</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index}>
                                <td>{item.race}</td>
                                <td>{Math.ceil(item.idealPop)}</td>
                                <td>{item.racePop}</td>
                                <td>{Math.floor(item.enactedOpp)}</td>
                            </tr>
                        ))}
                    
                    </tbody>
                </table>
            </div> */}
        
        <div className="opportunity-districts-container">
            <div className="chart-container" style={{ display: 'flex' }}>
                <canvas ref={chartRef1} style={{ width: '50%' }}></canvas>
                <canvas ref={chartRef2} style={{ width: '50%', marginLeft: '20px'}}></canvas>
                <canvas ref={chartRef3} style={{ width: '50%', marginLeft: '20px' }}></canvas>
                <canvas ref={chartRef4} style={{ width: '50%', marginLeft: '20px'}}></canvas>
            </div>
        </div>
            {/* <table style={{ marginTop: '40px' }}>
                    <thead>
                        <tr>
                            <th>Race</th>
                            <th colSpan="2">First Threshold</th>
                            <th colSpan="2">Second Threshold</th>
                            <th colSpan="2">Third Threshold</th>
                        </tr>
                        <tr>
                            <th></th>
                            <th>Max</th>
                            <th>Avg</th>
                            <th>Max</th>
                            <th>Avg</th>
                            <th>Max</th>
                            <th>Avg</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index}>
                                <td>{item.race}</td>
                                <td>{Math.floor(item.firstThreshold.ensembleMax)}</td>
                                <td>{Math.floor(item.firstThreshold.ensembleAvg)}</td>
                                <td>{Math.floor(item.secondThreshold.ensembleMax)}</td>
                                <td>{Math.floor(item.secondThreshold.ensembleAvg)}</td>
                                <td>{Math.floor(item.thirdThreshold.ensembleMax)}</td>
                                <td>{Math.floor(item.thirdThreshold.ensembleAvg)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table> */}
        </div>
    );
}

export default OpportunityDistricts;



