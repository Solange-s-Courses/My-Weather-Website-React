import './App.css';
import Forecast from "./components/Forecast";
import Locations from "./components/Locations";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Menu from "./components/Menu";
import NotFound from "./components/NotFound";
import {useReducer} from "react";


function locationsReducer(locations, action) {
    /**
     *We have different options either to add or to delete and we will use the reducer in this exercise in order
     * to perform all the different tasks.
     */
    switch (action.type) {
        case 'added': {
            return [...locations, {
                name: action.name,
                latitude: action.latitude,
                longitude: action.longitude
            }];
        }
        case 'deleted': {
            return locations.filter(l => l.name !== action.name);
        }
        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}


function App() {
    const [locations, dispatch] = useReducer(
        locationsReducer,
        []
    );


    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Menu locations={locations}/>}>
                        <Route index element={<Forecast locations={locations} deleteFunc={(name) => dispatch({
                            type: 'deleted',
                            name: name
                        })}/>}/>
                        <Route path="locations" element={<Locations locations={locations}
                                                                    addFunc={(name, latitude, longitude) => dispatch({
                                                                        type: 'added',
                                                                        name: name,
                                                                        latitude: latitude,
                                                                        longitude: longitude
                                                                    })}
                                                                    deleteFunc={(name) => dispatch({
                                                                        type: 'deleted',
                                                                        name: name
                                                                    })}
                        />}/>
                        <Route path={"*"} element={<NotFound/>}/>
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;