import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../CSS/index.css';
import Navbar from '../components/Navbar';
import UpdateStep1 from '../components/UpdatePage/UpdateStep1';
import UpdateStep2 from '../components/UpdatePage/UpdateStep2';
import UpdateStep3 from '../components/UpdatePage/UpdateStep3';

const UpdateGame = ({operatingData, onLoginChange}) => {  
    const { idGame } = useParams();
  const [updateData, setUpdateData] = useState({
    name: '',
    size: 9,
    numberOfTeams: 2,
    numberOfTasks: 10,
    enQuestions: false,
    idGame: idGame,
  });

  const updateIdGame = (newIdGame) => {
    setUpdateData(prevData => ({
        ...prevData,
        idGame: newIdGame
    }));
  };

  const [step, setStep] = useState(1);

  const stepForward = () => {
    setStep(step+1);
    if (step === 4) {
        onLoginChange(operatingData.idUser, operatingData.rights, operatingData.token);
    }
  }; 

  const stepBack = () => {
    setStep(step-1);
  }

  useEffect(() => {
    if (operatingData.idUser === 0 || operatingData.idUser === undefined) {
        onLoginChange(operatingData.idUser, operatingData.rights, operatingData.token);
    }
  }, [operatingData.idUser, onLoginChange]);

  const renderStep = () => {
    switch (step) {
      case 1:
        return <UpdateStep1 operatingData={operatingData} stepForward={stepForward} updateData={updateData} setUpdateData={setUpdateData} updateIdGame={updateIdGame}/>;
      case 2:
        return <UpdateStep2 operatingData={operatingData} stepForward={stepForward} updateData={updateData} stepBack={stepBack}/>;
      case 3:
        return <UpdateStep3 operatingData={operatingData} onLoginChange={onLoginChange} updateData={updateData} stepBack={stepBack}/>;
      default:
        return null;
    }
  };

  return (
      <div className='main-c'>
        <Navbar operatingData={operatingData} />
        {renderStep()}
      </div>  
  );
};

export default UpdateGame