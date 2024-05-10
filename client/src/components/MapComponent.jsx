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

function MapComponent() {
    const mapContainerRef = useRef(null);
    const navigate = useNavigate();
    const { state } = useParams(); // Get the state parameter from the URL
    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorE1Heatmap,setAnchorElHeatmap] = useState(null);
    const [anchorE1HeatmapDistricts, setAnchorElHeatmapDistricts] = useState(null);
    const [anchorE1HeatmapPrecincts, setAnchorElHeatmapPrecincts] = useState(null);
    const [showPieChartPopulation, setShowPieChartPopulation] = useState(false);
    const [showLineGraph, setShowLineGraph] = useState(false);
    const [showMap, setShowMap] = useState(true);
    const [showBarGraph, setShowBarGraph] = useState(false);
    const [showStateAssemblyTable, setShowStateAssemblyTable] = useState(false);
    const [showBarGraphStateAssembly, setShowBarGraphStateAssembly] = useState(false);
    const [showEcologicalInference, setShowEcologicalInference] = useState(false);
    const [ethnicity, setEthnicity] = useState(null);
    const [legend, setLegend] = useState(null);
    const [precinctHeatmap, setPrecinctHeatMap] = useState(false);
    const [stateAssemblyTableRowClicked, setStateAssemblyTableRowClicked] = useState(null);

    const coordinates = {
        Nevada: [39.876019, -117.224121],
        Mississippi: [32.3547, -89.3985],
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        setStateAssemblyTableRowClicked(null);
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

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleStateTable = () => {
        setShowStateAssemblyTable(!showStateAssemblyTable);
        setShowBarGraphStateAssembly(false);
        setShowEcologicalInference(false);
        handleClose();
    };

    const handleClickBarGraphStateAssembly = () => {
        setShowBarGraphStateAssembly(!showBarGraphStateAssembly);
        setShowStateAssemblyTable(false);
        setShowEcologicalInference(false);
        handleClose();
    }

    const handleClickEcologicalInference = () => {
        setShowBarGraphStateAssembly(false);
        setShowStateAssemblyTable(false);
        setShowEcologicalInference(!showEcologicalInference);
        handleClose();
    }

    const handleNavigate = (path) => {
        setShowStateAssemblyTable(false);
        setShowBarGraphStateAssembly(false);
        handleClose();
        navigate(path);
        setShowPieChartPopulation(false);
        setShowLineGraph(false);
        setShowBarGraph(false);
        setShowMap(true);
        setShowEcologicalInference(false);
    };

    const handleStateChange = () => {
        if (state === 'Nevada') {
            handleNavigate('/map/Mississippi');
        }
        else {
            handleNavigate('/map/Nevada');
        }
    }

    const handleChartDisplay = (showPieChartAssembly, showPieChartPopulation, showLineGraph, showBarGraph) => {
        setShowPieChartPopulation(showPieChartPopulation);
        setShowLineGraph(showLineGraph);
        setShowBarGraph(showBarGraph);
        setShowMap(!( showPieChartPopulation || showLineGraph || showBarGraph));
        setAnchorEl(false);
        setAnchorElHeatmap(false);
    }

    const handleGoBack = () => {
        setShowStateAssemblyTable(false);
        setShowBarGraphStateAssembly(false);
        handleChartDisplay(false, false, false, false);
        setEthnicity(null);
    }

    // const handleClickPieChartAssembly = () => {
    //     setLegend(null);
    //     handleChartDisplay(true, false, false, false);
    // };

    const handleClickPieChartPopulation = () => {
        setLegend(null);
        handleChartDisplay(false, true, false, false);
    }

    const handleClickLineGraph = () => {
        setLegend(null);
        handleChartDisplay(false, false, true, false);
    }

    const handleClickBarGraph = () => {
        setLegend(null);
        handleChartDisplay(false, false, false, true);
    }

    const handleEthnicityOptionClickDistricts = (ethnicity) => {
        setAnchorElHeatmapDistricts(false);
        console.log(ethnicity);
        setEthnicity(ethnicity);
        setPrecinctHeatMap(false);
    };

    const handleEthnicityOptionClickPrecincts = (ethnicity) => {
        setAnchorElHeatmapPrecincts(false);
        console.log(ethnicity);
        setEthnicity(ethnicity);
        setPrecinctHeatMap(true);
    };

    const handleDistrictClick = (district) => {
        console.log('Clicked district:', district);
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
                const districtResponse = await axios.get(`http://localhost:8080/districts/${state}`);
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
                    const colorScale = chroma.scale(['#fee5d9','#fcae91','#fb6a4a','#de2d26','#a50f15']).domain([0, 0.125, 0.25, 0.5]);
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
                    const precinctResponse = await axios.get(`http://localhost:8080/precincts/${state}`);
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
    }, [state, showMap, ethnicity, showStateAssemblyTable, showBarGraphStateAssembly, precinctHeatmap, stateAssemblyTableRowClicked]);

    return (
        <div>
            <Header state={state} ethnicity={ethnicity} handleClick={handleClick} />
            <div ref={mapContainerRef} className="fullscreen-map" style={{ 
                width: showBarGraphStateAssembly ? '50%' : 
                    showStateAssemblyTable ? '50%' : 
                    showEcologicalInference ? '50%' : '100%',
                float: 'left',
                display: 'flex'
            }}>
                <div style={{ position: 'absolute', zIndex: 1000, width: '100%' }}>
                    <div style={{ position: 'absolute', zIndex: 1000, top: '20px', left: '20px' }}>
                    </div>
                    <MapMenu
                        anchorEl={anchorEl} anchorE1HeatmapDistricts={anchorE1HeatmapDistricts} anchorE1HeatmapPrecincts={anchorE1HeatmapPrecincts}
                        handleClose={handleClose} handleCloseHeatMap={handleCloseHeatMap}
                        handleGoBack={handleGoBack}
                        handleStateChange={handleStateChange}
                        handleStateTable={handleStateTable}
                        handleClickHeatMapDistricts={handleClickHeatMapDistricts} handleClickHeatMapPrecincts={handleClickHeatMapPrecincts}
                        handleEthnicityOptionClickDistricts={handleEthnicityOptionClickDistricts} handleEthnicityOptionClickPrecincts={handleEthnicityOptionClickPrecincts}
                        handleClickBarGraphStateAssembly={handleClickBarGraphStateAssembly} handleClickPieChartPopulation={handleClickPieChartPopulation} handleClickLineGraph={handleClickLineGraph} handleClickBarGraph={handleClickBarGraph}
                        showLineGraph={showLineGraph} showBarGraph={showBarGraph} showPieChartPopulation={showPieChartPopulation}
                        state={state}
                        handleClickEcologicalInference={handleClickEcologicalInference}
                    />

                </div>
            </div>
            {showStateAssemblyTable && (
                <div className="state-assembly-table" style={{ position: 'absolute', width: '50%', height: '100%', top: '60px', right: '0px', border: '2px solid #000000', }}>
                    <StateTable state={state}/>
                    <StateAssemblyTable state={state} handleDistrictClick={handleDistrictClick}/>
                </div>
            )}
            {showBarGraphStateAssembly && (
                <div className="state-assembly-bar-graph" style={{ position: 'absolute', width: '50%', height: '100%', top: '60px', right: '0px', border: '2px solid #000000' }}>
                    <StateAssemblyBarChart state={state}/>
                </div>
            )}
            {showEcologicalInference && (
                <div className="ecological-inference" style={{ position: 'absolute', width: '50%', height: '100%', top: '60px', right: '0px', border: '2px solid #000000', backgroundColor: 'white' }}>
                    <EcologicalInference state={state}/>
                </div>
            )}
        </div>
    );

}

export default MapComponent;