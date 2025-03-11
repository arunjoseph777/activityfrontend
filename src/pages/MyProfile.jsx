import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../services/ApiService";
import Navbar from "../components/Navbar";
import LastWeekChart from "../components/LastWeekChart";
import Footer from "./Footer";

const MyProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await ApiService.getLoggedInUser();
        setUser(response.user);
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || error.message);
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <Navbar/>
      <div className="container-fluid">
        <div className="row"> 
          <div className="col">
            {user ? (
              <div className="container mt-4">
                <div className="card shadow p-4">
                  <div className="card-body text-center">
                    <h1 className="text-primary fw-bold">Hello, {user.name}</h1>
                    <div className="profile-details-body mt-3">
                      <p className="text-muted fw-bold">Age : {user.age} years old</p>
                      <p className="text-muted fw-bold">Height : {user.height} cm</p>
                      <p className="text-muted fw-bold">Weight : {user.weight} kg</p>
                    </div>

                    {/* Edit Profile Button */}
                    <button onClick={handleEditProfile} className="btn btn-primary mt-3">
                      Edit Profile
                    </button>
                  </div>
                </div>

                {/* Last Week Chart */}
                <div className="card shadow mt-4 p-4">
                  <div className="card-body">
                    <h5 className="text-center">Last Week Performance</h5>
                    <LastWeekChart />
                  </div>
                </div>
              </div>
            ) : (
              <div className="alert alert-danger mt-4">User not found</div>
            )}
          </div>
        </div>
      </div>
      <Footer/>
    </div>
);
};
export default MyProfile;
