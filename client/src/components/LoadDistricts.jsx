import React, { useEffect } from 'react';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import wellknown from 'wellknown';

const NevadaDistrictsMap = () => {
    useEffect(() => {
        const map = L.map('nevada-districts-map').setView([39.876019, -117.224121], 6);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        const fetchData = async () => {
            try {
                // Fetch Nevada districts data
                const response = await axios.get('http://localhost:8080/nevadaDistricts');
                const nevadaDistrictsData = response.data;

                // Convert the data to GeoJSON format
                const geoJSONData = {
                    type: "FeatureCollection",
                    features: nevadaDistrictsData.map(item => ({
                        type: "Feature",
                        properties: {},
                        geometry: {
                            type: "Polygon", // Assuming the coordinates are for polygons
                            coordinates: wellknown.parse(item.coordinates) // Convert WKT to GeoJSON
                        }
                    }))
                };

                // Create a Leaflet layer for the GeoJSON data
                const geoJSONLayer = L.geoJSON(geoJSONData, {
                    style: {
                        color: 'red',
                        weight: 0.5,
                        fillOpacity: 0.1,
                    }
                });

                // Add the layer to the map
                geoJSONLayer.addTo(map);
            } catch (error) {
                console.error('Error fetching Nevada districts data:', error);
            }
        };

        fetchData(); // Fetch Nevada districts data

        // Cleanup function
        return () => map.remove();
    }, []); // Empty dependency array to run the effect only once when the component mounts

    return (
        <div id="nevada-districts-map" style={{ width: '100%', height: '500px' }}></div>
    );
};

export default NevadaDistrictsMap;