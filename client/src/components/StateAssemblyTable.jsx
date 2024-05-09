import React, { useState, useEffect } from 'react';
import axios from 'axios';

function StateAssemblyTable({ state, handleDistrictClick }) {
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

    console.log(stateAssemblyData);

    const handleRowClick = (district) => {
        handleDistrictClick(district);
    };

    return (
        <div className="table">
            <div className='table-container' style={{ maxHeight: '800px', overflowY: 'auto' }}>
                <table>
                    <thead>
                        <tr>
                            <th>District</th>
                            <th>Name</th>
                            <th>Party</th>
                            <th>Race/Ethnicity</th>
                            <th>Vote Margin</th>
                            <th>Date Assumed Office</th>
                            <th>Photo</th>
                        </tr>
                    </thead>
                    <tbody>
                    {stateAssemblyData.map(stateInfo => (
                        (
                            <tr key={stateInfo.id.timestamp} onClick={() => handleRowClick(stateInfo.office.slice(-1))}>
                                <td>{stateInfo.office}</td>
                                <td>{stateInfo.name}</td>
                                <td>{stateInfo.party}</td>
                                <td>{stateInfo.ethnicity}</td>
                                <td>{stateInfo.voteMargin}%</td>
                                <td>{stateInfo.dateAssumedOffice}</td>
                                <td>
                                    <img src={stateInfo.photo} alt="District Representative" style={{ width: '60px', height: '60px' }} />
                                </td>
                            </tr>
                        )
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default StateAssemblyTable;