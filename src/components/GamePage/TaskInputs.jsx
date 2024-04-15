import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const TaskInputs = ({ tasksData, userAns, correctAnswers, setUserAns, setCorrectAnswers, actualTeam, token}) => {
    const handleChangeAns = (index, e) => {
        const { name, value } = e.target;
        setUserAns(prevUserAns => {
          const updatedAns = [...prevUserAns];
          updatedAns[index] = { ...updatedAns[index], [name]: value };
          return updatedAns;
        });
    };
    
    const handleKeyPress = async (index, e) => {
        if (e.key === 'Enter') {
          const isCorrectAnswerIncluded = correctAnswers.some(ans => ans.idTask === tasksData[index].idTask);
          if (!isCorrectAnswerIncluded) {
            try {
              const response = await axios.get('https://localhost:7290/api/AnsweredTask/CheckAns', {
                params: {
                  idTeam: actualTeam,
                  idTask: tasksData[index].idTask,
                  answer: userAns[index].answer,
                },
                headers: { Authorization: `Bearer ${token}` }
              });
              //console.log(response);
              const newCorrectAnswer = { id: 0, idTask: tasksData[index].idTask, idTeam: actualTeam };
              setCorrectAnswers(prevCorrectAnswers => [...prevCorrectAnswers, newCorrectAnswer]);
            } catch (error) {
              console.error('Error:', error);
            }
    
          }
        }
    };
  return(
    <div className="task-inputs">
          {tasksData.map((task, index) => (
            <div key={task.idTask} className="task-input">
              <p>{index + 1}:</p>
              {(correctAnswers.some(answer => answer.idTask === task.idTask)) ? (
                <p>OK</p>
              ) : (
                <input
                  placeholder='answer'
                  type="text"
                  name="answer"
                  value={userAns[index]?.answer || ''}
                  onChange={(e) => handleChangeAns(index, e)}
                  onKeyDown={(e) => handleKeyPress(index, e)}
                  required
                />
              )}
            </div>
        ))}
    </div>
  );
};

export default TaskInputs;