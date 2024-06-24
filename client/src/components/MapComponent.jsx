import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useParams } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import axios from 'axios'
import chroma from 'chroma-js';
import Header from './Header';
import MapMenu from './MainMenu';
import StateTable from './StateTable';
import StateAssemblyTable from './StateAssemblyTable';
import wellknown from 'wellknown';
import StateAssemblyBarChart from './StateAssemblyBarChart';
import EcologicalInference from './EcologicalInference';
import ScatterPlot from './GinglesPlot';
import Box from './BoxWhiskerPlot';
import OpportunityDistricts from './OpportunityDistricts';

function MapComponent() {
    const mapContainerRef = useRef(null);
    const navigate = useNavigate();
    const { state } = useParams();
    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorE1Heatmap,setAnchorElHeatmap] = useState(null);
    const [anchorE1HeatmapDistricts, setAnchorElHeatmapDistricts] = useState(null);
    const [anchorE1HeatmapPrecincts, setAnchorElHeatmapPrecincts] = useState(null);
    const [anchorE1Gingles, setAnchorE1Gingles] = useState(null);
    const [showMap, setShowMap] = useState(true);
    const [showStateAssemblyTable, setShowStateAssemblyTable] = useState(false);
    const [showBarGraphStateAssembly, setShowBarGraphStateAssembly] = useState(false);
    const [showEcologicalInference, setShowEcologicalInference] = useState(false);
    const [showGingles, setShowGingles] = useState(false);
    const [ethnicity, setEthnicity] = useState(null);
    const [precinctHeatmap, setPrecinctHeatMap] = useState(false);
    const [stateAssemblyTableRowClicked, setStateAssemblyTableRowClicked] = useState(null);

    const [showOpportunityDistricts, setShowOpportunityDistricts] = useState(null);

    const [anchorE1EcologicalInference,setAnchorE1EcologicalInference] = useState(null);
    const [election, setElection] = useState(null);
    const [anchorE1EcologicalInferenceEthnicity, setAnchorE1EcologicalInferenceEthnicity] = useState(null);

    const [anchorE1Box,setAnchorE1Box] = useState(null);
    const [showBox, setShowBox] = useState(false);

    const coordinates = {
        Nevada: [39.876019, -117.224121],
        Mississippi: [32.3547, -89.3985],
    };


    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        setStateAssemblyTableRowClicked(null);
        setElection(null);
        // setEthnicity(null);
    };

    const handleClickHeatMapDistricts = (event) => {
        event.preventDefault();
        setAnchorElHeatmapDistricts(event.currentTarget);
        if (anchorE1HeatmapDistricts) {
            setAnchorElHeatmapDistricts(null);
        }
    };

    const handleClickHeatMapPrecincts = (event) => {
        event.preventDefault();
        setAnchorElHeatmapPrecincts(event.currentTarget);
        if (anchorE1HeatmapPrecincts) {
            setAnchorElHeatmapPrecincts(null);
        }
    };

    const handleCloseHeatMap = () => {
        setAnchorElHeatmap(null);
    };

    const handleCloseEcologicalInference = () => {
        setAnchorE1EcologicalInference(null);
    };

    const handleCloseBox= () => {
        setAnchorE1Box(null);
    };

    const handleCloseEcologicalInferenceEthnicity = () => {
        setAnchorE1EcologicalInferenceEthnicity(null);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleStateTable = () => {
        setShowStateAssemblyTable(!showStateAssemblyTable);
        setShowBarGraphStateAssembly(false);
        setShowEcologicalInference(false);
        setShowGingles(false);
        setShowOpportunityDistricts(false);
        setShowBox(false);
        handleClose();
    };

    const handleOpportunityDistricts = () => {
        setShowOpportunityDistricts(true);
        setShowBarGraphStateAssembly(false);
        setShowEcologicalInference(false);
        setShowGingles(false);
        setEthnicity(null);
        handleClose();
        setShowStateAssemblyTable(false);
        setShowBox(false);
    };

    const handleClickBarGraphStateAssembly = () => {
        setShowBarGraphStateAssembly(!showBarGraphStateAssembly);
        setShowStateAssemblyTable(false);
        setShowEcologicalInference(false);
        setShowOpportunityDistricts(false);
        setShowBox(false);
        setEthnicity(null);
        setShowGingles(false);
        handleClose();
    }
    const handleClickEcologicalInference = (event) => {
        event.preventDefault();
        setAnchorE1EcologicalInference(prev => prev ? null : event.currentTarget);
    };


    const handleClickBox = (event) => {
        event.preventDefault();
        setAnchorE1Box(prev => prev ? null : event.currentTarget);
    };


    const handleClickElectionEcologicalInference = (event, election) => {
        event.preventDefault();
        event.stopPropagation(); 
        setElection(election);
        setAnchorE1EcologicalInferenceEthnicity(event.currentTarget);
    };

    const handleNavigate = (path) => {
        setShowStateAssemblyTable(false);
        setShowBarGraphStateAssembly(false);
        handleChartDisplay(false, false, false, false);
        handleClose();
        navigate(path);
        setShowMap(true);
        setEthnicity(null);
        setShowEcologicalInference(false);
        setShowOpportunityDistricts(false);
        setShowGingles(false);
        setShowBox(false);
    };

    const handleStateChange = () => {
        if (state === 'Nevada') {
            handleNavigate('/map/Mississippi');
        }
        else {
            handleNavigate('/map/Nevada');
        }
    }

    const handleChartDisplay = (showPieChartPopulation, showLineGraph, showBarGraph) => {
        setShowMap(!( showPieChartPopulation || showLineGraph || showBarGraph));
        setAnchorEl(false);
        setAnchorElHeatmap(false);
    }

    const handleGoBack = () => {
        setShowStateAssemblyTable(false);
        setShowBarGraphStateAssembly(false);
        handleChartDisplay(false, false, false, false);
        setEthnicity(null);
        setShowGingles(false);
        setShowBox(false);
        setShowOpportunityDistricts(false);
        setShowEcologicalInference(false);
        setShowOpportunityDistricts(false);
    }

    const handleClickGingles = (event) => {
        event.preventDefault();
        setAnchorE1Gingles(event.currentTarget);
        if (anchorE1Gingles) {
            setAnchorE1Gingles(null);
          }
      };
  
    const handleCloseGingles = () => {
        setAnchorE1Gingles(null);
    };

    const handleGinglesClickRace = (ethnicity) => {
        setAnchorE1Gingles(false);
        setEthnicity(ethnicity);
        setShowGingles(true);
        setShowBox(false);
        setShowEcologicalInference(false);
        setShowOpportunityDistricts(false);
    }

    const handleEthnicityOptionClickDistricts = (ethnicity) => {
        setAnchorElHeatmapDistricts(false);
        setEthnicity(ethnicity);
        setShowBox(false);
        setPrecinctHeatMap(false);
        setShowGingles(false);
        setShowEcologicalInference(false);
        setShowOpportunityDistricts(false);
    };

    const handleEthnicityOptionClickPrecincts = (ethnicity) => {
        setAnchorElHeatmapPrecincts(false);
        setEthnicity(ethnicity);
        setPrecinctHeatMap(true);
        setShowBox(false);
        setShowGingles(false);
        setShowEcologicalInference(false);
    };

    const handleEthnicityOptionClickEcologicalInference = (ethnicity) => {
        setAnchorE1EcologicalInferenceEthnicity(null); 
        setAnchorE1EcologicalInference(null);
        setShowOpportunityDistricts(false);
        setShowBarGraphStateAssembly(false);
        setShowStateAssemblyTable(false);
        setAnchorElHeatmapPrecincts(false);
        setEthnicity(ethnicity);
        setPrecinctHeatMap(false);
        setShowGingles(false);
        setShowEcologicalInference(true);
        setShowBox(false);
        handleClose();
    };

    const handleEthnicityOptionClickBox = (ethnicity) => {
        setAnchorE1EcologicalInferenceEthnicity(null); 
        setAnchorE1EcologicalInference(null);
        setShowBarGraphStateAssembly(false);
        setShowStateAssemblyTable(false);
        setAnchorElHeatmapPrecincts(false);
        setEthnicity(ethnicity);
        setPrecinctHeatMap(false);
        setShowGingles(false);
        setShowEcologicalInference(false);
        setShowOpportunityDistricts(false);
        setShowBox(true);
        handleClose();
    };

    const handleDistrictClick = (district) => {
        setStateAssemblyTableRowClicked(district);
    };

    useEffect(() => {
        const map = L.map(mapContainerRef.current).setView(coordinates[state] || [40, -74.5], 6);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
        const fetchData = async () => {
            try {
                const districtResponse = await axios.get(`https://FairMap.us-east-2.elasticbeanstalk.com/districts/${state}`);
                const districtsData = districtResponse.data;
                const districtData = {
                    type: "FeatureCollection",
                    features: districtsData.map(district => ({
                        type: "Feature",
                        geometry: wellknown.parse(district.geometry),
                        properties: {
                            whitePop: district.demographicData.whiteVAP,
                            blackPop: district.demographicData.blackVAP,
                            asianPop: district.demographicData.asianVAP,
                            hispanicPop: district.demographicData.hispanicVAP,
                        }
                    }))
                };

                L.geoJSON(districtData, {
                    style: {
                        color: 'blue', 
                        weight: 1,
                        fillOpacity: 0.1
                    }
                }).addTo(map);

                if (stateAssemblyTableRowClicked) {
                    districtsData.forEach(district => {
                        if (district.districtNum === +stateAssemblyTableRowClicked) {
                            const bounds = L.geoJSON(wellknown.parse(district.geometry)).getBounds();
                            const districtLayer = L.geoJSON(wellknown.parse(district.geometry), {
                                style: {
                                    color: 'red',
                                    weight: 3, 
                                    fillOpacity: 0.1 
                                }
                            });
                            districtLayer.addTo(map);
                            map.fitBounds(bounds, { maxZoom: 18 });
                        }
                    });
                }


                if(ethnicity != null && !precinctHeatmap &&!stateAssemblyTableRowClicked){
                    const allPopulations = ['whiteVAP', 'blackVAP', 'asianVAP', 'hispanicVAP'];
                    const EthnicityValues = districtsData.flatMap(district => allPopulations.map(population => district.demographicData[population]));
                    const maxValue = Math.max(...EthnicityValues);
                    const colorScale = chroma.scale(['#fee5d9','#fcbba1','#fc9272','#fb6a4a','#cb181d']).domain([0, 0.125, 0.25, 0.5]);
                    let geojsonLayer = L.geoJSON(districtData, {
                        style: feature => {
                            const demographicData = feature.properties[`${ethnicity}Pop`];
                            if (demographicData) {
                                const percentage = (demographicData / maxValue) * 100;
                                let color;
                                if (percentage <= 12.5) {
                                    color = colorScale(0).hex();
                                } else if (percentage <= 25) {
                                    color = colorScale(0.125).hex();
                                } else if (percentage <= 50) {
                                    color = colorScale(0.25).hex();
                                } else {
                                    color = colorScale(1).hex();
                                }
                                return {
                                    fillColor: color,
                                    color: 'black',
                                    weight: 1,
                                    fillOpacity: 0.7
                                };
                            }
                        },
                        onEachFeature: (feature, layer) => {
                            const demographicData = feature.properties;
                            if (demographicData) {
                                const value = demographicData[`${ethnicity}Pop`];
                                layer.bindPopup(`Value: ${value}`);
                                layer.on({
                                    mouseover: (e) => {
                                        layer.openPopup();
                                    },
                                    mouseout: (e) => {
                                        layer.closePopup();
                                    }
                                });
                            }
                        }
                    });
                    geojsonLayer.addTo(map);
                }

                if(ethnicity != null && precinctHeatmap &&!stateAssemblyTableRowClicked){
                    const precinctResponse = await axios.get(`https://FairMap.us-east-2.elasticbeanstalk.com/precincts/${state}`);
                    const precinctsData = precinctResponse.data;
                    const precinctData = {
                        type: "FeatureCollection",
                        features: precinctsData.map(precinct => ({
                            type: "Feature",
                            geometry: wellknown.parse(precinct.geometry),
                            properties: {
                                whitePop: precinct.demographicData.whiteVAP,
                                blackPop: precinct.demographicData.blackVAP,
                                asianPop: precinct.demographicData.asianVAP,
                                hispanicPop: precinct.demographicData.hispanicVAP,
                            }
                        }))
                    };

                    const allPopulations = ['whiteVAP', 'blackVAP', 'asianVAP', 'hispanicVAP'];
                    const EthnicityValues = precinctsData.flatMap(precinct => allPopulations.map(population => precinct.demographicData[population]));
                    const maxValue = Math.max(...EthnicityValues);
                    const colorScale = chroma.scale(['#fee5d9','#fcae91','#fb6a4a','#de2d26','#a50f15']).domain([0, 0.125, 0.25, 0.5]);
                    let geojsonLayer = L.geoJSON(precinctData, {
                        style: feature => {
                            const demographicData = feature.properties[`${ethnicity}Pop`];
                            if (!demographicData) {
                                return {
                                    fillColor: colorScale(0).hex(),
                                    color: 'black',
                                    weight: 1,
                                    fillOpacity: 0.7
                                };
                            }
                            if (demographicData) {
                                const percentage = (demographicData / maxValue) * 100;
                                let color;
                                if (percentage <= 12.5) {
                                    color = colorScale(0).hex();
                                } else if (percentage <= 25) {
                                    color = colorScale(0.125).hex();
                                } else if (percentage <= 50) {
                                    color = colorScale(0.25).hex();
                                } else {
                                    color = colorScale(1).hex();
                                }

                                return {
                                    fillColor: color,
                                    color: 'black',
                                    weight: 1,
                                    fillOpacity: 0.7
                                };
                            }
                        },
                        onEachFeature: (feature, layer) => {
                            const demographicData = feature.properties;
                            if (demographicData) {
                                const value = demographicData[`${ethnicity}Pop`];
                                layer.bindPopup(`Value: ${value}`);
                                layer.on({
                                    mouseover: (e) => {
                                        layer.openPopup();
                                    },
                                    mouseout: (e) => {
                                        layer.closePopup();
                                    }
                                });
                            }
                        }
                    });
                    geojsonLayer.addTo(map);

                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
        return () => map.remove();
    }, [state, showMap, ethnicity, showStateAssemblyTable, showBarGraphStateAssembly, precinctHeatmap, stateAssemblyTableRowClicked, showGingles,
    ]);

    return (
        <div>
            <Header state={state} ethnicity={ethnicity} handleClick={handleClick} />
            <div ref={mapContainerRef} className="fullscreen-map" style={{ 
                width: showBarGraphStateAssembly ? '50%' : 
                    showStateAssemblyTable ? '50%' : 
                    showGingles ? '50%' : 
                    showOpportunityDistricts ? '50%' : 
                    showBox ? '50%' :
                    showEcologicalInference ? '25%' : '100%',
                float: 'left',
                display: 'flex'
            }}>
                <div style={{ position: 'absolute', zIndex: 1000, width: '100%' }}>
                    <div style={{ position: 'absolute', zIndex: 1000, top: '20px', left: '20px' }}>
                    </div>
                    <MapMenu
                        // anchorE1Ecological={anchorE1Ecological} 
                        // anchorE1EcologicalEthnicity={anchorE1EcologicalEthnicity}
                        handleClickEcologicalInference={handleClickEcologicalInference}
                        // handleElectionTypeSelect={handleElectionTypeSelect}
                        // handleElectionSetEthnicity={handleElectionSetEthnicity}
                        // handleEcologicalMenuClose={handleEcologicalMenuClose}
                        // electionType={electionType}
                        anchorE1EcologicalInference={anchorE1EcologicalInference}
                        handleCloseEcologicalInference={handleCloseEcologicalInference}
                        handleClickElectionEcologicalInference={handleClickElectionEcologicalInference}
                        anchorE1EcologicalInferenceEthnicity={anchorE1EcologicalInferenceEthnicity}
                        election={election}
                        handleCloseEcologicalInferenceEthnicity={handleCloseEcologicalInferenceEthnicity}
                        handleEthnicityOptionClickEcologicalInference={handleEthnicityOptionClickEcologicalInference}
                        
                        handleClickBox={handleClickBox} handleCloseBox={handleCloseBox} anchorE1Box={anchorE1Box} handleEthnicityOptionClickBox={handleEthnicityOptionClickBox}

                        handleOpportunityDistricts={handleOpportunityDistricts}

                        anchorEl={anchorEl} anchorE1HeatmapDistricts={anchorE1HeatmapDistricts} anchorE1HeatmapPrecincts={anchorE1HeatmapPrecincts} anchorE1Gingles={anchorE1Gingles}
                        state={state} handleClose={handleClose} handleCloseHeatMap={handleCloseHeatMap} handleGoBack={handleGoBack} handleStateChange={handleStateChange} handleStateTable={handleStateTable} handleClickGingles={handleClickGingles} handleCloseGingle={handleCloseGingles} handleGinglesClickRace={handleGinglesClickRace}
                        handleClickHeatMapDistricts={handleClickHeatMapDistricts} handleClickHeatMapPrecincts={handleClickHeatMapPrecincts} handleEthnicityOptionClickDistricts={handleEthnicityOptionClickDistricts} handleEthnicityOptionClickPrecincts={handleEthnicityOptionClickPrecincts} handleClickBarGraphStateAssembly={handleClickBarGraphStateAssembly}
                        />

                </div>
            </div>
            {showStateAssemblyTable && (
                <div className="state-assembly-table" style={{ position: 'absolute', width: '50%', height: '100%', top: '60px', right: '0px', border: '2px solid #000000', }}>
                    <StateTable state={state}/>
                    <StateAssemblyTable state={state} handleDistrictClick={handleDistrictClick}/>
                </div>
            )}
            {showOpportunityDistricts && (
                <div className="OpportunityDistricts" style={{ position: 'absolute', width: '50%', height: '100%', top: '60px', right: '0px', border: '2px solid #000000', }}>
                    <OpportunityDistricts state={state}/>
                </div>
            )}
            {showBarGraphStateAssembly && (
                <div className="state-assembly-bar-graph" style={{ position: 'absolute', width: '50%', height: '100%', top: '60px', right: '0px', border: '2px solid #000000' }}>
                    <StateAssemblyBarChart state={state}/>
                </div>
            )}
            {showEcologicalInference && (
                <div className="ecological-inference" style={{ position: 'absolute', width: '75%', height: '100%', top: '60px', right: '0px', border: '2px solid #000000', backgroundColor: 'white' }}>
                    <EcologicalInference state={state} election={election} ethnicity={ethnicity}/>
                </div>
            )}
            {showGingles && (
                <div className="gingles" style={{ position: 'absolute', width: '50%', height: '100%', top: '60px', right: '0px', backgroundColor: 'white', border: 'none' }}>
                    <ScatterPlot state={state} ethnicity={ethnicity}/>
                </div>
            )}
            {showBox && (
                <div className="box" style={{ position: 'absolute', width: '50%', height: '100%', top: '60px', right: '0px', border: '2px solid #000000', backgroundColor: 'black' }}>
                    <Box state={state} ethnicity={ethnicity}/>
                </div>
            )}
        </div>
    );

}

export default MapComponent;