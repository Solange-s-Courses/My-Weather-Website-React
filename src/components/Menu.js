import {Link} from "react-router-dom";
import {Outlet} from "react-router";
export default function Menu(props) {
    /**
     * This is the main menu that will appear in all pages and will have the option to go to either the page of the
     * forecast or the page of the location, here we are setting the objects to be in the middle and the image to be
     * fluid, so we can keep the website responsible
     *
     */

    return (
        <>
            <div className="row" style={{textAlign: "center"}}>
                <img src="../images/image.png" width="500px" className="img-fluid" alt="logo"/>
                <h1>My Weather Forecast</h1>
                <h6>By Esther Wahnon And Idan Baumer</h6>
                <div className="col">
                    <Link to="/">Forecast </Link>
                </div>
                <div className="col">
                    <Link to="/locations">Locations</Link>
                </div>
            </div>
            <Outlet/>
        </>
    );
}