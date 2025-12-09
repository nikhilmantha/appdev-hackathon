import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Landing from "./pages/Landing"
import Catalog from "./pages/Catalog"
import Tasks from "./pages/Tasks"
import Profile from "./pages/Profile"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={<Login key="login"/>} />
        <Route path="/register" element={<Register key="register" />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}
