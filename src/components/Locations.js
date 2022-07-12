import {useState} from "react";

export default function Locations(props) {
    /**
     * Funtion that checks the lenth and it will print if there are no locations yet or it will print the list of
     * different locations, each location will have a cart and an option to delete it
     */
    const [inputs, setInputs] = useState({})
    const [isValid, setIsValid] = useState(false);

    const locationsList = props.locations.length === 0 ? (
        <div key=""> No locations yet </div>) : (props.locations.map(location => (

            <div className="col-sm-6" class="d-flex justify-content-center">

            <div class="text-light bg-dark"    className="card text-center">
                <div className="card-header">
                    Location
                </div>
                <div className="card-body">
                    <div key={location.name}>
                        {location.name}
                        <button className="btn btn-danger" onClick={() => props.deleteFunc(location.name)}>x</button>
                    </div>
                </div>
            </div>

    </div>




    )))

    const handleChange = (event) => {
        /**
         *
         *
         * in case that there are any changes
         */
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}))
    }

    return (
        <>

            <h1>Locations</h1>
            <ul>{locationsList}</ul>
            <form
                onSubmit={event => {
                    if (props.locations.find(element => element.name === inputs.name) === undefined) {
                        props.addFunc(
                            inputs.name,
                            inputs.latitude,
                            inputs.longitude
                        )
                        setInputs(values => ({...values, "name": "", "latitude": "", "longitude": ""}))
                        setIsValid(false)
                    } else {
                        setIsValid(true)
                    }
                    event.preventDefault()
                }}>
                <div className="row">
                    <div className="col">
                        <input className="un form-control" value={inputs.name || ""} type="text" id="name"
                               onChange={handleChange}
                               name="name" placeholder="name" required/>
                    </div>
                    <div className="col">
                        <input className="un form-control" type="number" step="any" value={inputs.latitude || ""}
                               id="latitude"
                               onChange={handleChange}
                               name="latitude" min="-90" max="90" placeholder="latitude" required/>
                    </div>
                    <div className="col">
                        <input className={"un form-control"} type="number" step="any" value={inputs.longitude || ""}
                               id="longitude"
                               onChange={handleChange}
                               name="longitude" min="-180" max="180" placeholder="longitude" required/>
                    </div>

                    {isValid ? (
                        <div className="alert alert-danger" role="alert">
                            The name already exits in the system , please try a different one!
                        </div>
                    ) : null}
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>

        </>
    )

}