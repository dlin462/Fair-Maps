import React, { useState, useEffect } from 'react';
import axios from 'axios';

function StateTable({ state }) {
    const [stateData, setStateData] = useState(null); // Initialize with null

    useEffect(() => {
        axios.get(`http://localhost:8080/state-measures/${state}`)
            .then(response => {
                console.log('Response from server:', response.data);
                setStateData(response.data);
            })
            .catch(error => {
                console.error('Error fetching state data:', error);
            });
    }, [state]);

    if (stateData === null) {
        return <p>Loading...</p>;
    }

    return (
        <div className="table">
            <div className='table-container'>
                <table>
                    <thead>
                        <tr>
                            <th>State</th>
                            <th>TotalP</th>
                            <th>WhiteP</th>
                            <th>BlackP</th>
                            <th>AsianP</th>
                            <th>HispP</th>
                            <th>Party Control</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{stateData.state}</td>
                            <td>{stateData.demographicData.vap}</td>
                            <td>{stateData.demographicData.whiteVAP}</td>
                            <td>{stateData.demographicData.blackVAP}</td>
                            <td>{stateData.demographicData.asianVAP}</td>
                            <td>{stateData.demographicData.hispanicVAP}</td>
                            <td>{stateData.partyControl}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default StateTable;