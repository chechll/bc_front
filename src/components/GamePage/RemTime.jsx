import React, { useEffect } from 'react';

const RemTime = ({eningTime, setEningTime, timeForClock, setTimeForClock}) => {

    useEffect(() => {
        const interval = setInterval(() => {
          setEningTime(prevRemainingTime => prevRemainingTime - 1000);
        },1000);
    
        return () => clearInterval(interval);
      }, [eningTime]);

      useEffect(() => {
            const interval = setInterval(() => {
                setTimeForClock(prevRemainingTime => {
                    if (prevRemainingTime === 0) {
                        clearInterval(interval);
                        return prevRemainingTime - 1;
                    }
                    return prevRemainingTime - 1;
                });
            }, 1000);
    
            return () => clearInterval(interval);
        
      }, [timeForClock]);

    const formatTime = (milliseconds) => {
        let seconds = Math.floor(milliseconds / 1000);
      
        const hours = Math.floor(seconds / 3600);
        seconds %= 3600;
        const minutes = Math.floor(seconds / 60);
        seconds %= 60;
      
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      };
  return (
    <>
    <h2>Remaining Time: {formatTime(eningTime)}</h2>
    <p>Time until logout: {timeForClock} seconds</p>
    </>
  );
};

export default RemTime;