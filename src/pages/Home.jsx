import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { HiArrowTrendingUp } from "react-icons/hi2";
import { GoArrowUp } from "react-icons/go";
import { LiaUnlockSolid } from "react-icons/lia";
import { IoArrowForwardCircleSharp } from "react-icons/io5";
import "bootstrap/dist/css/bootstrap.min.css";
import AOS from "aos";
import "aos/dist/aos.css";
import '../style/Home.css';

const Home = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });

    // Fix side scrolling
    document.documentElement.style.overflowX = "hidden";
    document.body.style.overflowX = "hidden";

    return () => {
      document.documentElement.style.overflowX = "auto";
      document.body.style.overflowX = "auto";
    };
  }, []);

  return (
    <div className="container-fluid bg-dark text-light min-vh-100 home-page">
      {/* Hero Section */}
      <div className="container text-center py-5 w-100">
        <h1 className="display-1 fw-bold" data-aos="fade-down">Trak.</h1>

        <div className="row justify-content-center mt-5 w-100">
          <div className="col-12 col-sm-6 col-md-4 text-center" data-aos="fade-up">
            <span className="h1 text-warning"><HiArrowTrendingUp /></span>
            <h3>Track your progress.</h3>
          </div>

          <div className="col-12 col-sm-6 col-md-4 text-center" data-aos="fade-up" data-aos-delay="200">
            <span className="h1 text-warning"><GoArrowUp /></span>
            <h3>Level-up your skills.</h3>
          </div>

          <div className="col-12 col-sm-6 col-md-4 text-center" data-aos="fade-up" data-aos-delay="400">
            <span className="h1 text-warning"><LiaUnlockSolid /></span>
            <h3>Unlock your potential.</h3>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="container py-5 w-100">
        <div className="row align-items-center text-center text-md-start w-100">
          <div className="col-12 col-md-6 bg-black rounded" data-aos="fade-right">
            <h2 className="fw-bold">
              Trak has the largest library of exercises to choose from. Pick your current level, track your progress, and reach new heights!
            </h2>
          </div>

          <div className="col-12 col-md-6 text-center mt-4 mt-md-0" data-aos="fade-left">
            <h2 className="fw-bold">Start your journey now!</h2>
            <Link className="btn btn-warning btn-lg mt-3 d-inline-flex align-items-center" to="/register">
              Register <IoArrowForwardCircleSharp className="ms-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
