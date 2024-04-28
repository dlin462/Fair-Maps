import React, { useState, useEffect } from 'react';
import axios from 'axios';

function StateTable() {
    const [stateData, setStateData] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8080/stateTable')
            .then(response => {
                console.log('Response from server:', response.data);
                setStateData(response.data);
            })
            .catch(error => {
                console.error('Error fetching state data:', error);
            });
    }, []);

    return (
        <div className="state-table">
            <div className='table-container'>
                <table>
                    <thead>
                        <tr>
                            <th>State</th>
                            <th>Total Population</th>
                            <th>White Population</th>
                            <th>Black Population</th>
                            <th>Asian Population</th>
                            <th>Hispanic Population</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stateData.map(stateInfo => (
                            <tr key={stateInfo.id.timestamp}>
                                <td>{stateInfo.name}</td>
                                <td>{stateInfo.tot_POP22}</td>
                                <td>{stateInfo.wht_NHSP22}</td>
                                <td>{stateInfo.blk_NHSP22}</td>
                                <td>{stateInfo.asn_NHSP22}</td>
                                <td>{stateInfo.hsp_POP22}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default StateTable;