import "../index.css";
import { useNavigate } from 'react-router-dom';
import Silk from "../components/Silk";
import { motion } from "motion/react";
import TiltedCard from "../components/TiltedCard";
import { GlowCard } from "../components/GlowCard";

export default function Landing() {
    const navigate = useNavigate();

  return (
    <div className="flex flex-col w-dvw text-white overflow-y-scroll">
      {/* Hero Section */}
      <div className="w-dvw h-dvh flex flex-col justify-center relative">

        {/* Nav Bar */}
        <motion.div
          initial={{y: -100, opacity: 0}}
          animate={{y: 0, opacity: 1}} 
          transition={{duration: 0.7, type:"spring"}}
          className="flex justify-between items-center z-10 fixed left-1/2 transform -translate-x-1/2 w-[80dvw] p-2 box-border top-2 rounded-full bg-white/10 border shadow-md border-white/15 backdrop-blur-sm">
          <div className="flex items-center">
            <img className="h-15 ml-5 mr-3 transition-all duration-200 hover:shadow-lg/20 hover:-translate-y-0.5 active:translate-y-0" 
                 src="https://www.cs.umd.edu/sites/default/files/images/article/2024/logo_0.png" 
                 alt="app dev logo" />
            <h1 className="text-4xl font-extrabold">TerpQuest</h1>
          </div>
          <button className="text-white text-lg font-bold bg-white/0 p-3 rounded-2xl me-4 w-30 border border-white/10 transition-all duration-200 hover:shadow-lg/20 hover:-translate-y-0.5 hover:bg-white/5 active:translate-y-0" 
                  onClick={() => navigate("/signin")}
                  >Sign In</button>
        </motion.div>

        {/* Splash Text */}
        <div className="absolute text-8xl font-extrabold z-5 top-1/3 left-[10%] text-left text-shadow-lg/20">
          <motion.h1 initial={{x:-100, opacity:0}}
                     animate={{x:0, opacity:1}}
                     transition={{duration: 0.7, type:"spring", delay:0.4}}
                     >Your Journey.</motion.h1>
          <motion.h1 initial={{x:-100, opacity:0}}
                     animate={{x:0, opacity:1}}
                     transition={{duration: 0.7, type:"spring", delay:0.8}}
                     >Your Deck.</motion.h1>
        </div>

        <motion.div initial={{x:100, opacity:0}}
                    animate={{x:0, opacity:1}}
                    transition={{duration: 0.7, type:"spring", delay:1.2}}
                    className="absolute z-5 top-1/2 left-[60%] w-100 rounded-4xl -translate-y-1/2">
                    <TiltedCard
                    imageSrc="../src/assets/cards/Testudo.png"
                    containerHeight="400px"
                    imageHeight="100%"
                    imageWidth="100%"
                    rotateAmplitude={12}
                    scaleOnHover={1.05}
                    showTooltip={false}
                    />
        </motion.div>

        <motion.div initial={{x:-100, opacity:0}}
                    animate={{x:0, opacity:1}}
                    transition={{duration: 0.7, type:"spring", delay:1.4}}
                    className="absolute text-3xl font-extrabold z-5 top-[70%] left-[10%] text-left mx-2 text-shadow-lg/20">
          <h1>Build better habits, one quest at a time.</h1>
        </motion.div>
        

        {/* Background */}
        <Silk
          speed={5}
          scale={1.1}
          color="#0091ff"
          noiseIntensity={1.5}
          rotation={0}
        />
      </div>

      {/* About Section */}
      <div className="bg-linear-to-b from-gray-900 to-black w-dvw h-dvh flex flex-col items-center justify-start pt-[125px]">
        <motion.h1 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true , amount:1}}
          transition={{ duration: 0.7, type:"spring"}}
          className="text-6xl font-extrabold mb-16 text-center">
          About
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-[90%] text-center auto-rows-max">
          <GlowCard delay={0}>
            <p className="text-2xl font-bold mb-4">Technologies Used</p>
            <ul className="text-gray-300 text-left space-y-2 list-disc list-inside">
              <li><span className="font-semibold">Front-End:</span>
                <ul className="ml-8 space-y-1">
                  <li>– HTML, JavaScript</li>
                  <li>– React</li>
                  <li>– Tailwind CSS</li>
                  <li>– Motion</li>
                </ul>
              </li>
              <li><span className="font-semibold">Back-End:</span> FastAPI</li>
              <li><span className="font-semibold">Database:</span> MongoDB</li>
            </ul>
          </GlowCard>

          <GlowCard delay={0.3}>
            <p className="text-2xl font-bold mb-4">TerpQuest</p>
            <img src="https://via.placeholder.com/200" alt="Feature Two" className="w-full h-40 object-cover rounded-lg mb-4" />
            <p className="text-gray-300 font-semibold">Complete daily self-improvement quests to earn Card Packs, then open those packs to collect unique Testudo cards. Level up your collection while leveling up yourself!</p>
          </GlowCard>

          <GlowCard delay={0.6}>
            <p className="text-2xl font-bold mb-4">Team Members</p>
            <p className="text-gray-300">Nikhil Mantha, Vishnu Gunturi, Victoria Xiao, Sonaya Dhuria, Evan Taubenfeld.</p>
          </GlowCard>
        </div>
      </div>
    </div>
  );
}
