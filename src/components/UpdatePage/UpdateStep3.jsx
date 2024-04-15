import React, { useState, useEffect } from 'react';
import '../../CSS/index.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const CreatingStep3 = ({ operatingData, onLoginChange, updateData, stepBack }) => {

  const [tasksData, setTasksData] = useState([]);

  useEffect(() => {
    const fetchTasksData = async () => {
        try {
          const response = await axios.get('https://localhost:7290/api/Task/GetTasks', {
            params: {
              idGame: updateData.idGame,
            },
            headers: { Authorization: `Bearer ${operatingData.token}` }
        });
          setTasksData(response.data);
        } catch (error) {
          console.error('Error fetching teams data:', error);
          toast.error('Error fetching teams data');
        }
      };
  
      fetchTasksData();
  }, []);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updatedTasksData = [...tasksData];
    updatedTasksData[index] = { ...updatedTasksData[index], [name]: value };
    setTasksData(updatedTasksData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put('https://localhost:7290/api/Task/UpdateTasks', tasksData,{headers: { Authorization: `Bearer ${operatingData.token}` }});
      console.log('Tasks created successfully');
      onLoginChange(operatingData.idUser, operatingData.rights, operatingData.token);
    } catch (error) {
      console.error('Error  tasks:', error.message);
      toast.error('Error during updating');
    }
  };

  return (
    <div className='main-c'>
      <h1>Updating game</h1>
      <h2>Step 3: Update Tasks</h2>
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
            {updateData.enQueastions && (
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
            <li><button className="button" onClick={stepBack}>Back</button></li>
            <li><button className="button" type="submit">Finish</button></li>
          </ul>
        </div>
      </form>
    </div>
  );
};

export default CreatingStep3