import { Outlet } from "react-router-dom";
import Navbar from "./navbar";



export default function UserLayout () {

  return (
    <>
    <Navbar/>
    <div className="main-content">
      <Outlet/>
    </div>
    </>
  )
}