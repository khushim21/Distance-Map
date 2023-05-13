import React, { useRef, useState } from 'react'
import {useJsApiLoader, GoogleMap, Marker, Autocomplete, DirectionsRenderer, DirectionsService} from "@react-google-maps/api"
import {AiOutlinePlusCircle} from "react-icons/ai"
import {FaDotCircle} from "react-icons/fa"
import "./Home.css"
const Home = () => {

    // const waypoints = [
    //     { location: 'Thodupuzha, Kerala, India' },
    //   ];

    const google = window.google;

    const [origin, setOrigin] = useState(null);
    const [destination, setDestination] = useState(null);
    const [loading, setLoading] = useState(false);
    const [directionsRes, setDirectionsRes] = useState(null)
    const [distance, setDistance] = useState('')
    const [time, setTime] = useState('')
    const [routes, setRoutes] = useState([])
    const [waypoints, setWaypoints] = useState([]);
    // const [currentWaypoint, setCurrentWaypoint] = useState('');



    // waypoints.forEach((waypoint, index) => {
    //     console.log(waypoint.location);
    //   });
    const originRef = useRef()
    const destinationRef = useRef()
    const waypointRef = useRef()

    const {isLoaded} = useJsApiLoader({
            googleMapsApiKey: "AIzaSyAYBivEevsC3sXYWfY6n9803tvASqB0TUI",
            libraries: [
                'places'
            ],
        })

    const center = {lat: 28.6567, lng: 77.2415}
    
    if(!isLoaded) {
        return(
            <p>Loading ...</p>
        )
    }

   async function calculateRoute() {
        if (originRef.current.value === '' || destinationRef.current.value === '') {
            return;
        }
        setLoading(true); // Set loading to true when calculating route
        const directionService = new google.maps.DirectionsService();
        const routeOptions = {
            origin: originRef.current.value,
            destination: destinationRef.current.value,
            waypoints:  [...waypoints.map(waypoint => ({ location: waypoint.location }))],
            travelMode: google.maps.TravelMode.DRIVING,
            provideRouteAlternatives: true // request multiple routes
        };
        const results = await new Promise((resolve, reject) => {
            directionService.route(routeOptions, (response, status) => {
            if (status === 'OK') {
                resolve(response);
            } else {
                reject(status);
                window.alert('Directions request failed due to ' + status);
            }
            });
        });
        setOrigin(originRef.current.value);
        setDestination(destinationRef.current.value);
        setLoading(false);
        setDirectionsRes(results);
        setDistance(results.routes[0].legs[0].distance.text);
        setTime(results.routes[0].legs[0].duration.text);
        setRoutes(results.routes);
    }

    const handleAddWaypoint = () => {
        const newWaypoint = { location: waypointRef.current.value };
        setWaypoints(prevWaypoints => [...prevWaypoints, newWaypoint]);
        waypointRef.current.value = ''; 
      };


   
    function clearRoute(){
        setDirectionsRes([]);
        setDistance('')
        setTime('')
        originRef.current.value = ''
        destinationRef.current.value = ''
    }

    console.log(waypoints)

    
  return (
    <div className="home">

        <div className="container">
            <p className='heading'>Let's calculate distance from Google maps</p>

        <div className="content-container">


        <div className="locations">

            <div className="location-container">

                <div className="location-inputs">
                <Autocomplete>
                <input type="text" placeholder='Origin' ref={originRef}/>
                </Autocomplete>

                <div className="waypoints">

                    <Autocomplete>
                    <input type="text" placeholder='Waypoints' ref={waypointRef} />
                    </Autocomplete>
                    <button className='waypoint-btn' onClick={handleAddWaypoint}><AiOutlinePlusCircle /> Add another stop</button>

                </div>

                <div className='display-waypoints'>
                {waypoints.map((waypoint, index) => (
                    <div key={index}>{waypoint.location}</div>
                ))}
                </div>

                <Autocomplete>
                <input type="text" placeholder='Destination' ref={destinationRef}/>
                </Autocomplete>

                </div>

                <div className="location-buttons">
                    
                <button className = "calc-btn" onClick={calculateRoute}>
                    Calculate
                </button>
                {/* <button onClick={clearRoute}>
                    Clear
                </button> */}

                </div>

            </div>


            <div className="distance">

                <div className="distance-number">
                    <p>Distance</p>
                    <p className='distance-style-number'>{distance}</p>
                </div>

                <div className='distance-text'>
                    {!loading ? (
                        <p>The distance between {origin} and {destination}<br /> via the seleted route is {distance} kms.</p>
                    ) : (
                        <p>Please select a route.</p>
                    )}
                    {loading && <div className="loading">Loading...</div>}
                </div>

            </div>
        </div>

        <div className="render-map-box">
            <GoogleMap
                center={center}
                zoom={12}
                mapContainerStyle={{width : '100%',  height: '100%'}}
                options={{
                    streetViewControl:false,
                    mapTypeControl:false,
                    fullscreenControl: false
                    
                }}
            >

                <Marker position={center}/>
                {directionsRes && <DirectionsRenderer directions={directionsRes}/>}                 
            </GoogleMap>
        </div>
        </div>
        </div>
    </div>
  )
}

export default Home