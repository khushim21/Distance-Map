import React, { useRef, useState } from 'react'
import {useJsApiLoader, GoogleMap, Marker, Autocomplete, DirectionsRenderer, DirectionsService} from "@react-google-maps/api"
import {AiOutlinePlusCircle} from "react-icons/ai"
import {FaDotCircle,FaMapMarker} from "react-icons/fa"
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
            <p className='heading'>Let's calculate <span style={{fontWeight:"bold"}}> distance</span> from Google maps</p>

        <div className="content-container">


        <div className="locations">

            <div className="location-container">

                <div className="location-inputs" style={{marginRight:80, marginBottom:43}}>
                    
                    <div style={{fontFamily:"IBM Plex Sans",fontWeight:"400",fontSize:14, color:"#000000", marginBottom:-12}}>Origin</div>
                    <div style={{display:"flex", flexDirection:"row", alignItems:"center",backgroundColor:"white"}}>
                    <FaDotCircle style={{marginRight:5, color:"green",marginLeft:3}}/>
                <Autocomplete >
                <input type="text" placeholder='Origin' ref={originRef} style={{border:"0px", backgroundColor:"white",marginBottom:0}}/>
                </Autocomplete>
                </div>

                <div className="waypoints" >
                    <div style={{fontFamily:"IBM Plex Sans",fontWeight:"400",fontSize:14, marginBottom:3,color:"#000000"}}>Stop</div>
                     <div style={{display:"flex", flexDirection:"row", alignItems:"center",backgroundColor:"white"}}>
                    <FaDotCircle style={{marginRight:5,marginLeft:3}}/>
                    <Autocomplete>
                    <input type="text" placeholder='Waypoints' ref={waypointRef} style={{border:"0px",backgroundColor:"white",marginBottom:0}}/>
                    </Autocomplete>
                    </div>
                </div>
 <button className='waypoint-btn' style={{ marginTop:-12}} onClick={handleAddWaypoint}><AiOutlinePlusCircle /> Add another stop</button>
                <div className='display-waypoints'>
                {waypoints.map((waypoint, index) => (
                    <div key={index}>{waypoint.location}</div>
                ))}
                </div>
                <div style={{fontFamily:"IBM Plex Sans",fontWeight:"400",fontSize:14, marginBottom:-13,color:"#000000", }}>Destination</div>
                 <div style={{display:"flex", flexDirection:"row", alignItems:"center",backgroundColor:"white"}}>
                    <FaMapMarker style={{marginRight:5,marginLeft:3}}/>
                <Autocomplete>
                <input type="text" placeholder='Destination' ref={destinationRef} style={{border:"0px",marginBottom:0,backgroundColor:"white"}}/>
                 
                </Autocomplete>
                </div>

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

               {  origin !== null && destination !== null && (<div className='distance-text'>
                   
                             <p>The distance between <span style={{fontWeight:"bold"}}>{origin}</span> and <span style={{fontWeight:"bold"}}>{destination}</span> via the seleted route is {distance} kms.</p>
                    
                </div>)}

            </div>
        </div>

        <div className="render-map-box">
            <GoogleMap
                center={center}
                zoom={12}
                mapContainerStyle={{width : 560,  height: 511}}
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