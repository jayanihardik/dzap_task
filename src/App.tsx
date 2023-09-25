import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Disperse from "./component/Disperse";

function App() {
  return (
    <div className="w-full p-1 h-screen">
      <Disperse />
      <ToastContainer />
    </div>
  );
}

export default App;
