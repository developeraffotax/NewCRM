import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useRef,
} from "react";
import axios from "axios";
import { FaCirclePlay } from "react-icons/fa6";
import { IoStopCircle } from "react-icons/io5";
import { useAuth } from "../context/authContext";

export const Timer = forwardRef(({ clientId, jobId, setIsShow, note }, ref) => {
  const [timerId, setTimerId] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [totalTime, setTotalTime] = useState(null);
  const { anyTimerRunning, setAnyTimerRunning } = useAuth();
  const isInitialMount = useRef(true);

  useEffect(() => {
    const fetchTimerStatus = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/timer/status`,
          {
            params: { clientId, jobId },
          }
        );
        const { _id, startTime, endTime } = response.data.timer;

        if (startTime && !endTime) {
          setTimerId(_id);
          setStartTime(new Date(startTime));
          setIsRunning(true);
          setAnyTimerRunning(true);
          const timeElapsed = Math.floor(
            (new Date() - new Date(startTime)) / 1000
          );
          setElapsedTime(timeElapsed);
        }
      } catch (error) {
        console.error("Error fetching timer status:", error);
      }
    };

    // fetchTimerStatus();
    if (isInitialMount.current) {
      fetchTimerStatus();
      isInitialMount.current = false;
    }
  }, [clientId, jobId, setAnyTimerRunning]);

  useEffect(() => {
    let intervalId;

    if (isRunning) {
      intervalId = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isRunning]);

  const startTimer = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/timer/start/timer`,
        {
          clientId,
          jobId,
          note: "Started work on job",
        }
      );
      setTimerId(response.data.timer._id);
      setIsRunning(true);
      setStartTime(new Date());
      setAnyTimerRunning(true);
    } catch (error) {
      console.error("Error starting timer:", error);
    }
  };

  const stopTimer = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/v1/timer/stop/timer/${timerId}`,
        { note }
      );
      setIsRunning(false);
      setAnyTimerRunning(false);
      setIsShow(false);
      setTimerId(null);
      setElapsedTime(0);
      gettotalTime(timerId);
    } catch (error) {
      console.error("Error stopping timer:", error);
    }
  };

  const gettotalTime = async (id) => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/timer/total_time/${id}`,
        {
          params: { jobId },
        }
      );
      setTotalTime(data.totalTime);
    } catch (error) {
      console.log(error);
    }
  };

  useImperativeHandle(ref, () => ({
    stopTimer,
  }));

  return (
    <>
      <div className="w-full h-full relative">
        <div className="flex items-center gap-[2px]  ">
          <div className="flex space-x-4">
            {!isRunning ? (
              <button
                onClick={startTimer}
                disabled={anyTimerRunning}
                className={`flex items-center justify-center ${
                  anyTimerRunning ? "cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                <FaCirclePlay className="h-6 w-6  text-sky-500 hover:text-sky-600 " />
              </button>
            ) : (
              <button
                onClick={() => setIsShow(true)}
                disabled={!isRunning}
                className="flex items-center justify-center  disabled:cursor-not-allowed"
              >
                <IoStopCircle className="h-6 w-6  text-red-500 hover:text-red-600 animate-pulse " />
              </button>
            )}
          </div>
          {isRunning && (
            <div className="text-[13px] text-gray-800 font-semibold ">
              {Math.floor(elapsedTime / 3600)
                .toString()
                .padStart(2, "0")}
              :
              {Math.floor((elapsedTime % 3600) / 60)
                .toString()
                .padStart(2, "0")}
              :{(elapsedTime % 60).toString().padStart(2, "0")}
            </div>
          )}
        </div>
      </div>
    </>
  );
});
