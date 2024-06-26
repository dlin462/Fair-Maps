import React, { useState, useEffect } from 'react';
import axios from 'axios';

function StateTable({ state }) {
    const [stateData, setStateData] = useState(null); // Initialize with null

    useEffect(() => {
        axios.get(`http://fairmaps.us-east-2.elasticbeanstalk.com/state-measures/${state}`)
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
                            <th>Total</th>
                            <th>White</th>
                            <th>Black</th>
                            <th>Asian</th>
                            <th>Hispanic</th>
                            <th>Party Control</th>
                        </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>{stateData.state}</td>
                        <td>{stateData.demographicData.vap.toLocaleString()}</td>
                        <td>{stateData.demographicData.whiteVAP.toLocaleString()}</td>
                        <td>{stateData.demographicData.blackVAP.toLocaleString()}</td>
                        <td>{stateData.demographicData.asianVAP.toLocaleString()}</td>
                        <td>{stateData.demographicData.hispanicVAP.toLocaleString()}</td>
                        <td>{stateData.partyControl}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default StateTable;