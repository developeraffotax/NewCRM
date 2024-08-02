import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlay, FaStop, FaUser } from "react-icons/fa";
import Layout from "../../components/Loyout/Layout";

const Timer = () => {
  const [startTime, setStartTime] = useState(null);
  const [stopTime, setStopTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerId, setTimerId] = useState(null);

  const startTimer = async () => {
    const start = new Date();
    setStartTime(start);

    try {
      await axios.post("/api/timer/start", { startTime: start });
    } catch (error) {
      console.error("Error sending start time:", error);
    }

    const id = setInterval(() => {
      setElapsedTime((prevTime) => prevTime + 1);
    }, 1000);
    setTimerId(id);
  };

  const stopTimer = async () => {
    clearInterval(timerId);
    const stop = new Date();
    setStopTime(stop);

    try {
      await axios.post("/api/timer/stop", { stopTime: stop });
    } catch (error) {
      console.error("Error sending stop time:", error);
    }

    setElapsedTime(0);
    setTimerId(null);
  };

  useEffect(() => {
    return () => {
      clearInterval(timerId);
    };
  }, [timerId]);

  return (
    <Layout>
      <div className="">Tasks</div>
      {/* <div className="flex flex-col items-center p-6 border border-gray-300 rounded-lg shadow-lg bg-white">
        <div className="flex items-center mb-4">
          <FaUser size="2x" className="text-gray-600 mr-3" />
          <span className="text-lg font-semibold text-gray-800">John Doe</span>
        </div>
        <div className="text-2xl font-bold text-gray-800 mb-6">
          {Math.floor(elapsedTime / 3600)
            .toString()
            .padStart(2, "0")}
          :
          {Math.floor((elapsedTime % 3600) / 60)
            .toString()
            .padStart(2, "0")}
          :{(elapsedTime % 60).toString().padStart(2, "0")}
        </div>
        <div className="flex space-x-4">
          <button
            onClick={startTimer}
            disabled={startTime && !stopTime}
            className="flex items-center justify-center px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <FaPlay className="mr-2" />
            Start
          </button>
          <button
            onClick={stopTimer}
            disabled={!startTime || stopTime}
            className="flex items-center justify-center px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <FaStop className="mr-2" />
            Stop
          </button>
        </div>
      </div> */}
    </Layout>
  );
};

export default Timer;
