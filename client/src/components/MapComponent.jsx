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
import MapMenu from './Menu';
import StateTable from './StateTable';
import StateAssemblyTable from './StateAssemblyTable';
import wellknown from 'wellknown';

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

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClickHeatMap = (event) => {
        event.preventDefault();
        setAnchorElHeatmap(event.currentTarget);
        if (anchorE1Heatmap) {
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
            handleNavigate('/map/Mississippi');
        }
        else {
            handleNavigate('/map/Nevada');
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

    const handleEthnicityOptionClick = (ethnicity) => {
        setAnchorEl(false);
        console.log(ethnicity)
        setEthnicity(ethnicity);
    };

    // useEffect(() => {
    //     axios.get('http://localhost:8080/nevadaDistricts')
    //         .then(response => {
    //             console.log('Response from server:', response.data);
    //         })
    //         .catch(error => {
    //             console.error('Error fetching stateAssembly data:', error);
    //         });
    // }, []);

    const mergeData = (geometries, demographics) => {
        const mergedData = [];
        const minLength = Math.min(geometries.length, demographics.length);
        for (let i = 0; i < minLength; i++) {
            const mergedObject = { ...geometries[i], ...demographics[i] };
            mergedData.push(mergedObject);
        }
        return mergedData;
    };

    useEffect(() => {
        const map = L.map(mapContainerRef.current).setView(coordinates[state] || [40, -74.5], 6);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
        console.log(state);
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/districts/${state}`);
                const nevadaDistrictsData = response.data;
                const districtData = {
                    type: "FeatureCollection",
                    features: nevadaDistrictsData.map(district => ({
                        type: "Feature",
                        geometry: wellknown.parse(district.geometry)
                    }))
                };
                L.geoJSON(districtData, {
                    style: {
                        color: 'blue', 
                        weight: 1,
                        fillOpacity: 0.1
                    }
                }).addTo(map);
                // const response1 = await axios.get(`http://localhost:8080/districts/${StateName.state}`);
                // const raw_geometries = response1.data;
                // convert to geojson 
                // const wktGeometries = raw_geometries.map(feature => wellknown.parse(feature.coordinates));
                // const response2 = await axios.get('http://localhost:8080/demographicDataNevada');
                // const demographic = response2.data;
                // const mergedData = mergeData(wktGeometries, demographic);
                   
                const extractCoords = (mergedData) => {
                    return mergedData.map(item => ({
                      type: item.type,
                      coordinates: item.coordinates, 
                    }));
                };
                const extractEthnicity = (mergedData) => {
                    return mergedData.map(item => ({
                        type: item.type,
                        coordinates: item.coordinates, 
                        value: item[ethnicity]
                    }));
                };
                // let geojsonLayer = L.geoJSON(extractCoords(mergedData), {
                //     style: {
                //         color: 'red',
                //         weight: 0.5,
                //         fillOpacity: 0,
                //     }
                // });
                if(ethnicity != null){
                    const EthnicityValues = extractEthnicity(districtData);
                    const maxValue = Math.max(...EthnicityValues.map(item => item.value));
                    const colorScale = chroma.scale(['white', 'red']).domain([0, maxValue]);
                    // console.log(extractEthnicity(districtData));
                    // console.log(maxValue); 
                    const geojsonData = {
                        type: "FeatureCollection",
                        features: EthnicityValues.map(item => ({
                            type: "Feature",
                            properties: {
                                value: item.value
                            },
                            geometry: {
                                type: item.type,
                                coordinates: item.coordinates
                            }
                        }))
                    };
                    geojsonLayer = L.geoJSON(geojsonData, {
                        style: feature => {
                            const value = feature.properties.value;
                            const color = colorScale(value).hex();
                            return {
                                fillColor: color,
                                color: 'black',
                                weight: 1,
                                fillOpacity: 0.7
                            };
                        },
                        onEachFeature: (feature, layer) => {
                            const value = feature.properties.value;
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
                    });
                    geojsonLayer.addTo(map);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
        return () => map.remove();
    }, [state, showMap, ethnicity, showStateAssemblyTable]);

    return (
        <div>
            <Header state={state} ethnicity={ethnicity} handleClick={handleClick} />
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
                    <StateTable />
                    <StateAssemblyTable />
                </div>
            )}
        </div>
    );

}

export default MapComponent;