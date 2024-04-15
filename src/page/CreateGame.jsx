import React, { useEffect, useState } from 'react';
import '../CSS/index.css';
import Navbar from '../components/Navbar';
import CreatingStep1 from '../components/CreatePage/CreatingStep1';
import CreatingStep2 from '../components/CreatePage/CreatingStep2';
import CreatingStep3 from '../components/CreatePage/CreatingStep3';

const CreateGame = ({operatingData, onLoginChange}) => {  
  const [createData, setCreateData] = useState({
    name: '',
    size: 9,
    numberOfTeams: 2,
    numberOfTasks: 10,
    idGame: 0,
    enQuestions: false,
  });

  const updateIdGame = (newIdGame) => {
    setCreateData(prevData => ({
        ...prevData,
        idGame: newIdGame
    }));
  };

  const [step, setStep] = useState(1);

  const stepForward = () => {
    setStep(step+1);
  }; 

  useEffect(() => {
    if (operatingData.idUser === 0 || operatingData.idUser === undefined) {
        onLoginChange(operatingData.idUser, operatingData.rights, operatingData.token);
    }
  }, [operatingData.idUser, onLoginChange]);

  const renderStep = () => {
    switch (step) {
      case 1:
        return <CreatingStep1 operatingData={operatingData} stepForward={stepForward} createData={createData} setCreateData={setCreateData} updateIdGame={updateIdGame}/>;
      case 2:
        return <CreatingStep2 operatingData={operatingData} stepForward={stepForward} createData={createData}/>;
      case 3:
        return <CreatingStep3 operatingData={operatingData} onLoginChange={onLoginChange} createData={createData}/>;
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

export default CreateGame