//import "../style/Sidebar.css";
import { Tooltip } from 'react-tooltip';
import ApiService from "../services/ApiService";
import { Link, useNavigate } from "react-router-dom";
import { LuUser } from "react-icons/lu";
import { TbGymnastics } from "react-icons/tb";
import { IoLogOutSharp } from "react-icons/io5";
import { MdHistory } from "react-icons/md";
import { AiOutlinePlus } from "react-icons/ai";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
        ApiService.logout();
        navigate('/home'); // Redirect to the home page
    }
}

return (
  <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
    <div className="container-fluid">
      <Link className="navbar-brand fw-bold" to="/dashboard">
        Trak.
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav me-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/add-new-workout">
              <AiOutlinePlus className="me-2" /> New Workout
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/exercises">
              <TbGymnastics className="me-2" /> Exercises
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/workout-history">
              <MdHistory className="me-2" /> My Workouts
            </Link>
          </li>
          {ApiService.isAdmin() && (
            <li className="nav-item">
              <Link className="nav-link" to="/add-new-exercise">
                <AiOutlinePlus className="me-2" /> Add Exercise
              </Link>
            </li>
          )}
          <li className="nav-item">
            <Link className="nav-link" to="/my-profile">
              <LuUser className="me-2" /> Profile
            </Link>
          </li>
        </ul>
        <button className="btn btn-outline-light" onClick={handleLogout}>
          <IoLogOutSharp className="me-2" /> Logout
        </button>
      </div>
    </div>
  </nav>
);
};
export default Sidebar;
