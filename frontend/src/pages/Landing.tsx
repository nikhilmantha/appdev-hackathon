import "../index.css";
import { useNavigate } from 'react-router-dom';
import Silk from "../components/Silk";

export default function Landing() {
    const navigate = useNavigate();

  return (
    <div className="flex flex-col w-dvw text-white overflow-y-scroll">
      <div className="w-dvw h-dvh flex flex-col justify-center content-center relative">
        <nav className="flex justify-between items-center z-10 fixed left-1/2 transform -translate-x-1/2 w-[80dvw] p-2 box-border top-2 rounded-full bg-white/10 border shadow-md border-white/15 backdrop-blur-sm">
          <div className="flex items-center">
            <img className="h-15 mx-5" src="https://www.cs.umd.edu/sites/default/files/images/article/2024/logo_0.png" alt="app dev logo" />
            <h1 className="text-4xl font-extrabold">TerpQuest</h1>
          </div>
          <button className="text-white text-lg font-bold bg-white/0 p-3 rounded-2xl me-4 w-30 transition-all duration-200 hover:shadow-lg/20 hover:-translate-y-0.5 hover:bg-white/5" onClick={() => navigate("/login")}>LOGIN</button>
        </nav>

        <div className="absolute text-8xl font-extrabold z-5 top-1/3 left-[10%] text-left">
          <h1 className="text-shadow-lg/20">Your Journey.<br></br>Your Deck.</h1>
        </div>

        <div className="absolute text-3xl font-extrabold z-5 top-3/4 left-[10%] text-left mx-2">
          <h1 className="text-shadow-lg/20"> Level up while Trading Cards</h1>
        </div>
              
        <Silk
          speed={5}
          scale={1}
          color="#0091ff"
          noiseIntensity={1.5}
          rotation={0}
        />
      </div>

      <div className="bg-gray-900 w-dvw h-dvh flex items-center justify-center">
        <h1>HI</h1>
      </div>
    </div>
  );
}
