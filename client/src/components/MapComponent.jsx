import { useEffect, useRef, useState} from 'react';
import L from 'leaflet';
import { useParams } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import axios from 'axios'
import chroma from 'chroma-js';
import Header from './Header';
import MapMenu from './Menu';

function MapComponent() {
    const mapContainerRef = useRef(null);

    const navigate = useNavigate();

    const { state } = useParams(); // Get the state parameter from the URL
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [anchorE1Heatmap, setAnchorElHeatmap] = React.useState(null);
    const [showPieChartAssembly, setShowPieChartAssembly] = useState(false);
    const [showPieChartPopulation, setShowPieChartPopulation] = useState(false);
    const [showLineGraph, setShowLineGraph] = useState(false);
    const [showMap, setShowMap] = useState(true);
    const [showBarGraph, setShowBarGraph] = useState(false);
    const [showStateAssemblyTable, setShowStateAssemblyTable] = useState(false);
    const [ethnicity, setEthnicity] = useState(null);
    const [legend, setLegend] = useState(null);
    const coordinates = {
        nevada: [39.876019, -117.224121],
        mississippi: [32.3547, -89.3985],
    };

    useEffect(() => {
        axios.get(`http://localhost:8080/map/${state}`)
            .then(response => {
                console.log("Server returned: ", response.data);
            })
            .catch(error => {
                console.log("error retreiving data from server: ", error)
            });
    }, [state])

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClickHeatMap = (event) => {
        event.preventDefault();
        setAnchorElHeatmap(event.currentTarget);
        if(anchorE1Heatmap){
            setAnchorElHeatmap(null);
        }
    };

    const handleCloseHeatMap = () => {
        setAnchorElHeatmap(null);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleStateTable = () => {
        setShowStateAssemblyTable(!showStateAssemblyTable);
        handleClose();
    };

    const handleNavigate = (path) => {
        handleClose();
        navigate(path);
        setShowPieChartAssembly(false);
        setShowPieChartPopulation(false);
        setShowLineGraph(false);
        setShowBarGraph(false);
        setShowMap(true);
    };

    const handleStateChange = () => {
        if (state === 'nevada') {
            handleNavigate('/map/mississippi');
        }
        else {
            handleNavigate('/map/nevada');
        }
    }

    const handleChartDisplay = (showPieChartAssembly, showPieChartPopulation, showLineGraph, showBarGraph) => {
        setShowPieChartAssembly(showPieChartAssembly);
        setShowPieChartPopulation(showPieChartPopulation);
        setShowLineGraph(showLineGraph);
        setShowBarGraph(showBarGraph);
        setShowMap(!(showPieChartAssembly || showPieChartPopulation || showLineGraph || showBarGraph));
        setAnchorEl(false);
        setAnchorElHeatmap(false);
    }
    
    const handleGoBack = () => {
        handleChartDisplay(false, false, false, false);
        setEthnicity(null);
    }
    
    const handleClickPieChartAssembly = () => {
        setLegend(null);
        handleChartDisplay(true, false, false, false);
    };
    
    const handleClickPieChartPopulation = () =>{
        setLegend(null);
        handleChartDisplay(false, true, false, false);
    }
    
    const handleClickLineGraph = () =>{
        setLegend(null);
        handleChartDisplay(false, false, true, false);
    }
    
    const handleClickBarGraph = () =>{
        setLegend(null);
        handleChartDisplay(false, false, false, true);
    }

    const handleEthnicityOptionClick = (ethnicity) => {
        setAnchorEl(false);
        setEthnicity(ethnicity);
    };

    const stateDistricts = {
        nevada: '/nv_state_district_2022.geojson',
        mississippi: '/ms_State_Assembly_2022.geojson'
    };

    const statePrecincts = {
        nevada: '/nv_precinct_demographic.geojson',
        mississippi: '/ms_prec_demographic.geojson'
    };

    useEffect(() => {
        if (!showMap) {
            return;
        }

        const map = L.map(mapContainerRef.current).setView(
            coordinates[state] || [40, -74.5],
            6 
        );

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
        
        let colorIndex = 0;
        const districtColors = [
            '#3c8fc6', '#92d68f', '#459d3a', '#e37d7d', '#e35c5c',
            '#e1c150', '#e1a83e', '#b9b0e4', '#9487cb', '#e6e6b3',
            '#a6d2ff', '#3c8fc6', '#92d68f', '#459d3a', '#e37d7d',
            '#e35c5c', '#e1c150', '#e1a83e', '#b9b0e4', '#9487cb',
            '#e6e6b3', '#ffbb4c', '#9487cb', '#a6d2ff', '#3c8fc6'
        ];

        function getNextColor() {
            const color = districtColors[colorIndex];
            colorIndex = (colorIndex + 1) % districtColors.length;
            return color;
        }

        if (stateDistricts[state] && (statePrecincts[state] && !ethnicity) ) {
            fetch(stateDistricts[state])
                .then(response => response.json())
                .then(geojson => {
                    L.geoJSON(geojson, {
                        style: feature => ({
                            color: 'white', 
                            weight: 1,
                            fillColor: getNextColor(), 
                            fillOpacity: 1,
                        }),
                        onEachFeature: (feature, layer) => {
                            const properties = feature.properties;
                            // console.log(properties.ID);
                        }
                    }).addTo(map);
                });
                setLegend(null);
            fetch(statePrecincts[state])
                .then(response => response.json())
                .then(geojson => {
                    L.geoJSON(geojson, {
                        style: {
                            color: 'white',
                            weight: 0.5, 
                            fillOpacity: 0,

                        },
                    }).addTo(map);
                });
        }

        if (statePrecincts[state] && ethnicity) {
            fetch(statePrecincts[state])
                .then(response => response.json())
                .then(geojson => {

                    const maxEthnicityValue = Math.max(
                        ...geojson.features.map(feature => feature.properties[ethnicity.toUpperCase()])
                    );

                    const colorScale = chroma.scale(['#f7fcf5', '#e5f5e0', '#c7e9c0', '#a1d99b', '#74c476', '#41ab5d', '#238b45', '#006d2c', '#00441b']).domain([0, maxEthnicityValue]);
                    const legendScale = chroma.scale(['#f7fcf5', '#e5f5e0', '#c7e9c0', '#a1d99b', '#74c476', '#41ab5d', '#238b45', '#006d2c', '#00441b']).domain([0, 1]);
                    const legendItems = [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]; 
                    const legendColorScales = legendItems.map(value => legendScale(value).hex());

                    const legendContent = (
                        <div className="legend-container" style={{ display: 'flex', alignItems: 'center' }}>
                            {legendItems.map((item, index) => (
                                <div key={index} className="legend-item" style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                                    <span className="legend-color-box" style={{ backgroundColor: legendColorScales[index], width: '20px', height: '20px', display: 'inline-block', marginRight: '5px' }}></span>
                                    <span className="legend-label" style={{ fontSize: "1.2em" }}>{Math.round(item * 100)}%</span>
                                </div>
                            ))}
                        </div>
                    );

                    setLegend(legendContent);

                    L.geoJSON(geojson, {
                        style: feature => ({
                            color: 'black',
                            weight: 0.5, 
                            fillOpacity: 0.7,
                            fillColor: colorScale(feature.properties[ethnicity.toUpperCase()]).hex(),

                        }),
                        //set ethnicity value back to null
                        onEachFeature: (feature, layer) => {
                            const properties = feature.properties;
                            const ethnicityValue = properties[ethnicity.toUpperCase()];
                            const totalPopulation = properties.TOTPOP;
                        }

                        }
                    ).addTo(map);
                });
        }
    
        return () => map.remove();
    }, [state, showMap, ethnicity, showStateAssemblyTable]);

    return (
        <div>
            
            <Header state={state} legend={legend} handleClick={handleClick} />
            <div ref={mapContainerRef} className="fullscreen-map" style={{ width: showStateAssemblyTable ? '50%' : '100%', float: 'left', display: 'flex' }}>            
                <div style={{ position: 'absolute', zIndex: 1000, width: '100%' }}>
                    <div style={{ position: 'absolute', zIndex: 1000, top: '20px', left: '20px' }}>
                    </div>
                    <MapMenu
                        anchorEl={anchorEl}
                        anchorE1Heatmap={anchorE1Heatmap}
                        handleClose={handleClose}
                        handleCloseHeatMap={handleCloseHeatMap}
                        handleGoBack={handleGoBack}
                        handleStateChange={handleStateChange}
                        handleStateTable={handleStateTable}
                        handleClickHeatMap={handleClickHeatMap}
                        handleEthnicityOptionClick={handleEthnicityOptionClick}
                        handleClickPieChartAssembly={handleClickPieChartAssembly}
                        handleClickPieChartPopulation={handleClickPieChartPopulation}
                        handleClickLineGraph={handleClickLineGraph}
                        handleClickBarGraph={handleClickBarGraph}
                        showPieChartAssembly={showPieChartAssembly}
                        showLineGraph={showLineGraph}
                        showBarGraph={showBarGraph}
                        showPieChartPopulation={showPieChartPopulation}
                        state={state}
                    />
                    
                </div>
            </div>
            {showStateAssemblyTable && (
                <div className="state-assembly-table" style={{ position: 'absolute', width: '50%', height: '100%', top: '60px', right: '0' }}>
                    <div className='table-container'>
                        <table>
                            <tbody>
                                {Array.from({ length: 6 }, (_, rowIndex) => (
                                    <tr key={`row-${rowIndex}`}>
                                        {Array.from({ length: 2 }, (_, colIndex) => (
                                            <td key={`cell-${rowIndex}-${colIndex}`}>
                                                Row {rowIndex + 1}, Column {colIndex + 1}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
    
}

export default MapComponent;