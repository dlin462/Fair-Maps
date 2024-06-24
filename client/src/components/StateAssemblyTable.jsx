import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

function StateAssemblyTable({ state, handleDistrictClick }) {
    const [stateAssemblyData, setStateAssemblyData] = useState([]);
    const [partyFilter, setPartyFilter] = useState('');
    const [raceFilter, setRaceFilter] = useState('');

    useEffect(() => {
        axios.get(`FairMap.us-east-2.elasticbeanstalk.com/stateAssemblyTable/${state}`)
            .then(response => {
                console.log('Response from server:', response.data);
                const sortedData = response.data.sort((a, b) => {
                    const numberA = extractNumber(a.office);
                    const numberB = extractNumber(b.office);
                    return numberA - numberB;
                });
                setStateAssemblyData(sortedData);
            })
            .catch(error => {
                console.error('Error fetching stateAssembly data:', error);
            });
    }, []);

    console.log(stateAssemblyData);

    const handleRowClick = (district) => {
        handleDistrictClick(district);
    };

    const extractNumber = (office) => {
        const lastNumber = office.match(/\d+$/);
        return lastNumber ? parseInt(lastNumber[0]) : null;
    };

    const filteredData = stateAssemblyData.filter(stateInfo => {
        return (
            (partyFilter === '' || stateInfo.party.toLowerCase() === partyFilter.toLowerCase()) &&
            (raceFilter === '' || stateInfo.ethnicity.toLowerCase() === raceFilter.toLowerCase())
        );
    });

    return (
        <div className="table">
            <div className='table-container' style={{ maxHeight: '875px', overflowY: 'auto' }}>
                <table>
                    <thead>
                        <tr>
                            <th>District</th>
                            <th>Name</th>
                            <th>Party <select value={partyFilter} onChange={(e) => setPartyFilter(e.target.value)}>
                                <option value="">All</option>
                                <option value="Republican">Republican</option>
                                <option value="Democratic">Democratic</option>
                            </select></th>
                            <th>Race/Ethnicity <select value={raceFilter} onChange={(e) => setRaceFilter(e.target.value)}>
                                <option value="">All</option>
                                <option value="White">White</option>
                                <option value="Asian">Asian</option>
                                <option value="Black">Black</option>
                                <option value="Hispanic">Hispanic</option>
                            </select></th>
                            <th>Vote Margin</th>
                            <th>Photo</th>
                        </tr>
                    </thead>
                    <tbody>
                    {filteredData.map(stateInfo => (
                        <tr key={stateInfo.id.timestamp} onClick={() => handleRowClick(extractNumber(stateInfo.office))}>
                            <td>{extractNumber(stateInfo.office)}</td>
                            <td>{stateInfo.name}</td>
                            <td>{stateInfo.party}</td>
                            <td>{stateInfo.ethnicity}</td>
                            <td>{stateInfo.voteMargin}%</td>
                            <td>
                                <img src={stateInfo.photo} alt="District Representative" style={{ width: '60px', height: '60px', objectFit: 'cover' }} />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default StateAssemblyTable;