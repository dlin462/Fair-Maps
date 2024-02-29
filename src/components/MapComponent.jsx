import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { useParams } from 'react-router-dom';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../App.css';


mapboxgl.accessToken = 'pk.eyJ1IjoibGluY2hlbjEyIiwiYSI6ImNsdDZkdmQ3NzBhcjYycW1pMTZyMGc1N3YifQ.U6H9ILwXSVHMTjHD4-o2sA';

function MapComponent() {
    const mapContainerRef = useRef(null);

    const { state } = useParams(); // Get the state parameter from the URL

    const stateCoordinates = {
        texas: [-99.133209, 31.968599], // Coordinates for Texas
        california: [-119.417932, 36.778261], // Coordinates for California
    };

    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: stateCoordinates[state] || [-74.5, 40], // Default coordinates if state not found
            zoom: 6, // Adjust zoom level as needed
            // attributionControl: false // removes bottom right credits

        });

        return () => map.remove();
    }, [state]); // Re-run effect if state changes

    return (
            
            <div ref={mapContainerRef} className="fullscreen-map" />
    );
            
    
}

export default MapComponent;
