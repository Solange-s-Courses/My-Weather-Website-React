import {useEffect, useState} from "react";
import axios from 'axios';

/**
 * @type {Map<string, string>} get abbreviation and return data
 */
const weatherStates = new Map([
    ["pcloudy", "partly cloudy"],
    ["vcloudy", "very cloudy"],
    ["ishower", "isolated showers"],
    ["lightrain", "light rain"],
    ["oshowers", "occasional showers"],
    ["mcloudy", "mostly cloudy"]
]);
//in oder to get the date

const getDate = (dateString) => {
    const date = new Date(dateString.substring(0, 4), dateString.substring(4, 6) - 1, dateString.substring(6, 8));
    const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}
    return (
        <>
            {date.toLocaleDateString('en-US', options)}
        </>
    )
}
/**
 * data api for the fetch
 * @returns {[{isLoading: boolean, isError: boolean, data: unknown},((value: unknown) => void)]}
 * data and error handle
 */
const useDataApi = () => {
    const [data, setData] = useState(null); // data to be fetched
    const [url, setUrl] = useState(null); // url to be fetched
    const [isLoading, setIsLoading] = useState(false); // is it fetching?
    const [isError, setIsError] = useState(false); // is there an error?

    // we are using useEffect to fetch data from the API
    // when the url state changes
    useEffect(() => {
        // this code returns a promise, but an effect can only return void or a cleanup function.
        // so we need to wrap the promise in a function that returns void
        if (url != null) {
            const fetchData = async () => {
                setIsError(false); // reset error state
                setIsLoading(true); // set loading state to true to show loading indicator for example
                try {
                    const result = await axios(url);
                    setData(result.data); // set data state
                } catch (error) {
                    setIsError(true); // an error occurred, set error state to true
                }
                setIsLoading(false); // set loading state to false to hide loading indicator
            };
            fetchData(); // execute the function above
        }
    }, [url]); // trigger the effect when url changes

    return [{data, isLoading, isError}, setUrl]; // return the data and the URL setter function
};
/**
 * @param data - convert data from the fetch
 * @returns {JSX.Element} return html from the element
 */
const toWeatherData = (data) => {
    return <>
        <ul>


            {data["dataseries"].map(day => {
                return <div className="card">
                    <div className="card-header">
                        <h3>{getDate(day["date"].toString())}</h3>
                    </div>
                    <div className="card-body" class="p-3 mb-2 bg-secondary text-white">
                        <div key={day["date"]}>

                            <p>{weatherStates.has(day["weather"]) ? weatherStates.get(day["weather"]) : day["weather"]}</p>
                            <p>Temperature: {day["temp2m"]["min"]} to {day["temp2m"]["max"]}</p>
                            <p>Wind speed: {day["wind10m_max"] === "1" ? "No wind" : day["wind10m_max"]}</p>
                        </div>
                    </div>
                </div>



            })}
        </ul>
    </>
}

/**
 *
 * @param props - get Properties
 * @returns {JSX.Element} return page
 * @constructor
 */
export default function Forecast(props) {
    /**
     * This function is in charge of checking if we have clicked in the specific city and will also give us the option
     * to click on a different one , and it will change it
     */
    const [name, setName] = useState(null)
    const [{data, isLoading, isError}, doFetch] = useDataApi()
    const [image, setImage] = useState("")
    //in case that we have not yet introduced any city so the locaion list will be equal to 0
    const locationsList = props.locations.length === 0 ? (
            <p> No locations yet </p>) :
        <div className="btn-group-vertical" role="group"

             aria-label="Basic radio toggle button group">{(props.locations.map(location =>
            <div key={location.name}>
                <input type="radio" className="btn-check" name={location.name} id={location.name} autoComplete="off"
                       checked={location.name === name} onChange={() => {
                    setName(location.name)
                }}>
                </input>
                <label className="btn btn-outline-primary" htmlFor={location.name}>{location.name}</label>

                <button type="button" onClick={() => {
                    props.deleteFunc(location.name)
                }} className="btn btn-danger">X
                </button>

            </div>
        ))}</div>

    return (
        <>
            <div class="row">
                <form onSubmit={event => {
                    event.preventDefault();
                    const location = props.locations.find(element => element["name"] === name)
                    setImage(`https://www.7timer.info/bin/astro.php?%20lon=${location.longitude}&lat=${location.latitude}&ac=0&lang=en&unit=metric&output=internal&tzshift=0`)
                    doFetch(
                        `https://www.7timer.info/bin/api.pl?lon=${location.longitude}&lat=${location.latitude}&product=civillight&output=json`
                    );
                }}>
                    <h1>Locations</h1>
                    {locationsList}
                    <br/>
                    <br/>
                    <input className="btn btn-primary" type="submit" value="Get Weather!"/>
                </form>
                <p>{'\n'}</p>
                {isError && <div>Something went wrong ...</div>}
                {isLoading ? (
                    <div className="alert alert-warning">Loading ...</div>
                ) : (data !== null ? (
                    <>
                        <img className="img-fluid" src={image} alt="Weather data"/>
                        {toWeatherData(data)}
                    </>
                ) : null)}
            </div>
        </>
    )
}