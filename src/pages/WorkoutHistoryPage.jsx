import Navbar from '../components/Navbar';
import WorkoutHistory from "../components/WorkoutHistory";
import Footer from './Footer';

const WorkoutHistoryPage = () => {
  return (
    <div>
      <Navbar/>
      <div className="container-fluid">
        <div className="container mt-4">
            <h2 className="text-center text-primary fw-bold">Workout History</h2>
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <WorkoutHistory />
                </div>
            </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}
export default WorkoutHistoryPage