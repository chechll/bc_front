import React, { useState, useEffect } from 'react';
import '../../CSS/index.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const CreatingStep3 = ({ operatingData, onLoginChange, createData }) => {

  const [tasksData, setTasksData] = useState([]);

  useEffect(() => {
    if (createData.enQuestions) {
      setTasksData(Array.from({ length: createData.numberOfTasks }, (_, index) => ({ number: index + 1, answer: '', question: '', idGame: createData.idGame })));
    } else {
      setTasksData(Array.from({ length: createData.numberOfTasks }, (_, index) => ({ number: index + 1, answer: '' ,idGame: createData.idGame})));
    }
  }, [createData.numberOfTasks, createData.enQuestions]);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updatedTasksData = [...tasksData];
    updatedTasksData[index] = { ...updatedTasksData[index], [name]: value };
    setTasksData(updatedTasksData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://localhost:7290/api/Task/CreateTasks', tasksData,{headers: { Authorization: `Bearer ${operatingData.token}` }});
      console.log('Tasks created successfully');
      toast.success('Created successfully');
      onLoginChange(operatingData.idUser, operatingData.rights, operatingData.token);
    } catch (error) {
      console.error('Error creating tasks:', error);
      toast.error('Error during creating');
    }
  };

  return (
    <div className='main-c'>
      <h1>Creating game</h1>
      <h2>Step 3: Create Tasks</h2>
      <form onSubmit={handleSubmit}>
        {tasksData.map((task, index) => (
          <div key={index}>
            <label>
              Answer {index + 1}:
              <input
                placeholder='answer'
                type="text"
                name="answer"
                value={task.answer}
                onChange={(e) => handleChange(index, e)}
                required
              />
            </label>
            {createData.enQueastions && (
              <label>
              Question {index + 1}:
              <input
                placeholder='question'
                type="text"
                name="question"
                value={task.question}
                onChange={(e) => handleChange(index, e)}
                required
              />
            </label>
            )}
          </div>
        ))}
        <div className="user-actions">
          <ul className="user-buttons">
            <li><button className='button' type="submit">Finish</button></li>
          </ul>
        </div>
      </form>
    </div>
  );
};

export default CreatingStep3