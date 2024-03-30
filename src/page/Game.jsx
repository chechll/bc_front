import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../CSS/index.css';
import '../CSS/game.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPerson } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/Navbar';

const Game = (operatingData) => {
  const { idGame } = useParams();
  const [actualTeam, setActualTeam] = useState(0);
  const [boardArray, setBoardArray] = useState([]);
  const [tasksData, setTasksData] = useState([]);
  const [isLogged, setIsLoged] = useState(false);
  const [teamData, setTeamData] = useState([]);
  const [board, setBoard] = useState({
    idBoard: 0,
    board1: '',
    idGame: 0,
    size: 0
  });
  const [userAns, setUserAns] = useState([]);
  const [teamD, setTeamD] = useState({
    name: '',
    password: '',
  });
  const [correctAnswers, setCorrectAnswers] = useState([]);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const response = await axios.get('https://localhost:7290/api/Board/GetBoard', {
          params: {
            id: idGame,
          },
        });
        setBoard(response.data);
      } catch (error) {
        console.error('Error fetching board:', error);
      }
    };

    const fetchTasksData = async () => {
      try {
        const response = await axios.get('https://localhost:7290/api/Task/GetTasks', {
          params: {
            idGame: idGame,
          },
        });
        setTasksData(response.data);
        setUserAns(prevUserAns => {
          const newUserAns = [...prevUserAns];
          for (let i = newUserAns.length; i < response.data.length; i++) {
            newUserAns.push({ answer: '' });
          }
          return newUserAns;
        });
      } catch (error) {
        console.error('Error fetching teams data:', error);
        toast.error('Error fetching teams data');
      }
    };

    const fetchTeamsData = async () => {
      try {
        const response = await axios.get('https://localhost:7290/api/Team/GetTeams', {
          params: {
            idGame: idGame,
          },
        });
        setTeamData(response.data);
        setTeamD(prevData => ({ ...prevData, idTeam: response.data[0].idTeam }))

      } catch (error) {
        console.error('Error fetching teams data:', error);
        toast.error('Error fetching teams data');
      }
    };

    fetchTeamsData();
    fetchTasksData();
    fetchBoard();
  }, [idGame]);

  useEffect(() => {
    const parseBoardString = () => {
      if (board.board1 && board.size > 0) {
        const rowLength = board.size;
        const newArray = [];
        for (let i = 0; i < board.board1.length; i += rowLength) {
          newArray.push(board.board1.slice(i, i + rowLength).split('').map(Number));
        }
        setBoardArray(newArray);
      }
    };

    parseBoardString();
  }, [board]);

  const updateBoardString = () => {
    const boardString = boardArray.map(row => row.join('')).join('');

    console.log('boardString:', boardString, typeof boardString);

    setBoard(prevBoard => {
      return { ...prevBoard, board1: boardString };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(teamD);
    try {
      const response = await axios.get('https://localhost:7290/api/Team/LogIn', {
        params: {
          password: teamD.password,
          id: teamD.idTeam,
        },
      });

      setActualTeam(response.data);
      setIsLoged(true);
    } catch (error) {
      console.error('Error during sign in:', error);
      toast.error('Error during sign-in. Please check your credentials and try again.');
    }
  };

  useEffect(() => {
    const fetchCorrectAnswers = async () => {
      try {
        const response = await axios.get('https://localhost:7290/api/AnsweredTask/GetAns', {
          params: {
            teamId: actualTeam,
          },
        });
        setCorrectAnswers(response.data);
        console.log('corA ', response.data);
      } catch (error) {
        console.error('Error fetching correct answers:', error);
        toast.error('Error fetching correct answers');
      }
    };

    if (actualTeam !== 0 && isLogged) {
      fetchCorrectAnswers();
    }
  }, [isLogged]);

  const movePlayer = (difRow, difCell) => {
    console.log(teamData);
    console.log(actualTeam);
    console.log(board);
    const teamIndex = teamData.findIndex(team => team.idTeam === actualTeam);
    const newRow = teamData[teamIndex].positionY + difRow;
    const newCell = teamData[teamIndex].positionX + difCell;

    if (
      newRow >= 0 &&
      newRow < board.size &&
      newCell >= 0 &&
      newCell < board.size &&
      correctAnswers.length - teamData[teamIndex].steps > 0
    ) {
      const newValue = boardArray[newRow][newCell];
      const prevValue = teamData[teamIndex].score;
      const updatedTeamData = [...teamData];
      updatedTeamData[teamIndex].positionX = newCell;
      updatedTeamData[teamIndex].positionY = newRow;
      updatedTeamData[teamIndex].score = prevValue + newValue;
      updatedTeamData[teamIndex].steps = updatedTeamData[teamIndex].steps + 1;
      setTeamData(updatedTeamData);

      const newBoardArray = [...boardArray];
      newBoardArray[newRow][newCell] = 0;
      setBoardArray(newBoardArray);

      updateBoardString();
    }
  };

  const handleChangeAns = (index, e) => {
    const { name, value } = e.target;
    setUserAns(prevUserAns => {
      const updatedAns = [...prevUserAns];
      updatedAns[index] = { ...updatedAns[index], [name]: value };
      return updatedAns;
    });
  };

  const handleKeyPress = (index, e) => {
    if (e.key === 'Enter') {
      if (userAns[index]?.answer === tasksData[index].answer) {
        const isCorrectAnswerIncluded = correctAnswers.some(ans => ans.idTask === tasksData[index].idTask);
  
        if (!isCorrectAnswerIncluded) {
          const newCorrectAnswer = {id: 0,idTask: tasksData[index].idTask, idTeam: actualTeam };
          setCorrectAnswers(prevCorrectAnswers => [...prevCorrectAnswers, newCorrectAnswer]);
        }
      }
      console.log(userAns[index]?.answer,' ',tasksData[index].answer);

    
    console.log('TasD',tasksData);
    console.log('CA',correctAnswers);
    console.log(userAns);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, ' ', value);
    if (name === 'id') {
      setTeamD((prevData) => ({ ...prevData, [name]: parseInt(value) }));
    } else { setTeamD((prevData) => ({ ...prevData, [name]: value })); }
  };

  const logOut = async (e) => {
    e.preventDefault();
    updateBoardString();
    console.log('board', board);
    try {
      const teamToUpdate = teamData.find(team => team.idTeam === actualTeam);
      if (teamToUpdate) {
        console.log(teamToUpdate);
        await axios.put('https://localhost:7290/api/Team/UpdateTeam', teamToUpdate);
      } else {
        console.error('Team not found with id:', actualTeam);
      }
      await axios.post('https://localhost:7290/api/AnsweredTask/CreateATs', correctAnswers);
      await axios.post('https://localhost:7290/api/Board/Update', {idBoard: board.idBoard,
      board1: board.board1});
    } catch (error) {
      console.error('Error updating board/teams/creating answered tasks:', error);
      toast.error('Error during logout');
    }
    setUserAns([]);
    setCorrectAnswers([]);
    setIsLoged(false);
    setTeamD({ name: teamData[0].name, password: '', idTeam: teamData[0].idTeam });
  };

  return (
    <div className="main-w main-c">
      <Navbar operatingData={operatingData} />
      {isLogged ? (<div>
        <div className="game-container ">
          <div className="board-container">
            <table className="board">
              <tbody>

                {boardArray.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={`${rowIndex}-${cellIndex}`} className={teamData.some(team => team.positionY === rowIndex && team.positionX === cellIndex) ? 'player' : ''}>
                        {teamData.map((team, teamIndex) => (
                          team.positionY === rowIndex && team.positionX === cellIndex ? (
                            <FontAwesomeIcon key={teamIndex} icon={faPerson} style={{ color: team.colour }} />

                          ) : null
                        ))}
                        {!teamData.some(team => team.positionY === rowIndex && team.positionX === cellIndex) && cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="left-container">
            <div className="game-info">
              <h2>You can move {correctAnswers.length - teamData[teamData.findIndex(team => team.idTeam === actualTeam)].steps} times</h2>
              {teamData.map((team, index) => (
                <h3 key={index}>{team.name}: {team.score}</h3>
              ))}
            </div>
            <div className="user-actions">
              <button className="button" onClick={() => movePlayer(-1, 0)}>Up</button>
              <ul className="user-buttons">
                <li><button className="button" onClick={() => movePlayer(0, -1)}>Left</button></li>
                <li><button className="button" onClick={() => movePlayer(1, 0)}>Down</button></li>
                <li><button className="button" onClick={() => movePlayer(0, 1)}>Right</button></li>
              </ul>
            </div>
            <button className="button" onClick={logOut}>log out</button>

          </div>
        </div>
        <div className="task-inputs">
          {tasksData.map((task, index) => (
            <div key={task.Number} className="task-input">
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
        </div> </div>) : (<div> <div className='main-c  main-b'>
          <form onSubmit={handleSubmit}>
            <select value={teamD.idTeam} onChange={handleChange} name="idTeam">
              {teamData.map((item, index) => (
                <option key={index} value={item.idTeam}>
                  {item.name}
                </option>
              ))}
            </select>
            <label>
              <input
                placeholder='password'
                type="password"
                name="password"
                value={teamD.password}
                onChange={handleChange}
              />
            </label>
            <button className="button">Sign In</button>
          </form>
        </div> </div>)}
    </div>
  );


};

export default Game;
