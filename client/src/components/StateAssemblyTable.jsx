import React, { useState, useEffect } from 'react';
import axios from 'axios';

function StateAssemblyTable() {
    const [stateAssemblyData, setStateAssemblyData] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8080/stateAssemblyTable')
            .then(response => {
                console.log('Response from server:', response.data);
                setStateAssemblyData(response.data);
            })
            .catch(error => {
                console.error('Error fetching stateAssembly data:', error);
            });
    }, []);

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
                        stateInfo.state === "Nevada" && (
                            <tr key={stateInfo.id.timestamp}>
                                <td>{stateInfo.office}</td>
                                <td>{stateInfo.name}</td>
                                <td>{stateInfo.party}</td>
                                <td>{stateInfo.ethnicity}</td>
                                <td>{stateInfo.vote_Margin}%</td>
                                <td>{stateInfo.date_assumed_office}</td>
                                <td>
                                    <img src={stateInfo.image} alt="District Representative" style={{ width: '150px', height: '150px' }} />
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