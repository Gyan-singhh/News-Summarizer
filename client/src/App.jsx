import { Outlet, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { useAuth } from "./context/AuthContext";
import { FaRobot } from "react-icons/fa";

function App() {
  const { loading } = useAuth();

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-4xl animate-spin">🔄</span>
      </div>
    );

  return (
    <div>
      <Navbar />
      <Outlet />
      <Footer />

      <Link
        to="/chats"
        className="fixed bottom-6 right-6 flex flex-col items-center text-white"
      >
        <div className="bg-purple-600 hover:bg-purple-700 p-4 rounded-full shadow-lg transition-transform transform hover:scale-110">
          <FaRobot className="w-6 h-6" />
        </div>
        <span className="mt-2 text-sm font-medium">Verify News</span>
      </Link>
    </div>
  );
}

export default App;
