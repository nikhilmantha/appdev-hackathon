import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import "./index.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Landing from "./pages/Landing"
import Catalog from "./pages/Catalog"
import Tasks from "./pages/Tasks"
import Profile from "./pages/Profile"
import NavBar from "./components/NavBar";

function Home() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 to-black text-white">
      <NavBar />
      <Outlet />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={<Login key="login"/>} />
        <Route path="/register" element={<Register key="register" />} />
        <Route element={<Home />}>
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
