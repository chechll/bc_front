import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../CSS/index.css';
import '../CSS/game.css';
import Navbar from '../components/Navbar';
import TeamLogIn from "../components/GamePage/TeamLogIn";
import TaskInputs from "../components/GamePage/TaskInputs";
import RemTime from "../components/GamePage/RemTime";
import UserActions from "../components/GamePage/UserActions";
import GameBoard from "../components/GamePage/Board";

const Game = (operatingData, onLoginChange) => {
  const { idGame } = useParams();
  const [actualTeam, setActualTeam] = useState(0);
  const [boardArray, setBoardArray] = useState([]);
  const [tasksData, setTasksData] = useState([]);
  const [isLogged, setIsLoged] = useState(false);
  const [teamData, setTeamData] = useState([]);
  const [eningTime, setEningTime] = useState('');
  const [timeforClock, setTimeForClock] = useState('');
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
  const [remainingTime, setRemainingTime] = useState('');
  const [logoutTime, setLogoutTime] = useState(0);
  const [token, setToken] = useState(0);
  const navigate = useNavigate();
  const [log, setLog] = useState(false);

  useEffect(() => {
    if (log) {
      operatingData.onLoginChange(operatingData.operatingData.idUser, operatingData.operatingData.rights, operatingData.operatingData.token);
    }
  }, [log]);

  useEffect(() => {
    const fetchTeamsData = async () => {
      try {
        const response = await axios.get('https://localhost:7290/api/Game/GetGameTeams', {
          params: {
            idGame: idGame,
          },
        });
        setTeamData(response.data);
        setTeamD(prevData => ({ ...prevData, idTeam: response.data[0].idTeam }));
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching teams data:', error);
        setLog(true);
      }
    };

    const fetchDeadline = async () => {
      try {
        const response = await axios.get('https://localhost:7290/api/Game/DateGame', {
          params: {
            idGame: idGame,
          },
        });
        const responseData = response.data;
  
        const deadlineDate = new Date(responseData);
        deadlineDate.setHours(deadlineDate.getHours() + 2);
        const currentTime = new Date();
        const remainingTime = deadlineDate.getTime() - currentTime.getTime();
        setRemainingTime(remainingTime);
        setEningTime(remainingTime);
      } catch (error) {
        console.error('Error fetching deadline:', error.response.data);
        toast.error('Error fetching deadline');
      }
    };

    fetchTeamsData();
    fetchDeadline();
  }, [idGame, token]);

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

    setBoard(prevBoard => {
      return { ...prevBoard, board1: boardString };
    });
  };

  useEffect(() => {
    if (remainingTime != '') {
    
    const deadlineTimeout = setTimeout(() => {
      navigate('/home');
    }, remainingTime);
  
    return () => clearTimeout(deadlineTimeout);}
  
  }, [remainingTime]);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const response = await axios.get('https://localhost:7290/api/Board/GetBoard', {
          params: {
            id: idGame,
          },
          headers: { Authorization: `Bearer ${token}` }
        });
        setBoard(response.data);
      } catch (error) {
        console.error('Error fetching board:', error);
      }
    };

    const fetchTasksData = async () => {
      try {
        const response = await axios.get('https://localhost:7290/api/Task/GetAmountOfTasks', {
          params: {
            idGame: idGame,
          },
          headers: { Authorization: `Bearer ${token}` }
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
    const fetchCorrectAnswers = async () => {
      try {
        const response = await axios.get('https://localhost:7290/api/AnsweredTask/GetAns', {
          params: {
            teamId: actualTeam,
          },
          headers: { Authorization: `Bearer ${token}` }
        });
        setCorrectAnswers(response.data);
      } catch (error) {
        console.error('Error fetching correct answers:', error);
        toast.error('Error fetching correct answers');
      }
    };

    if (actualTeam !== 0 && isLogged && token != null) {
      fetchCorrectAnswers();
      fetchTasksData();
      fetchBoard();
      setLogoutTime(120);
      setTimeForClock(120);
      console.log(actualTeam);
    }
  }, [isLogged]);

  useEffect(() => {
    let logoutTimer;
  
    const handleLogout = () => {
      logOut({ preventDefault: () => {} });
    };
  
    if (isLogged && logoutTime != 0) {
      logoutTimer = setTimeout(handleLogout, logoutTime * 1000);
    }
  
    return () => clearTimeout(logoutTimer);
  
  }, [isLogged, logoutTime]);

  const logOut = async (e) => {
    e.preventDefault();
    updateBoardString();
    if (actualTeam != 0) {
    try {
      const teamToUpdate = teamData.find(team => team.idTeam === actualTeam);
      
      await axios.put(`https://localhost:7290/api/Game/RemoveTeam?idTeam=${actualTeam}`,null,{headers: { Authorization: `Bearer ${token}` }});
      if (teamToUpdate) {
        await axios.put('https://localhost:7290/api/Game/UpdateCurrentTeam', teamToUpdate, {headers: { Authorization: `Bearer ${token}` }});
        await axios.put('https://localhost:7290/api/Team/UpdateTeam', teamToUpdate,{headers: { Authorization: `Bearer ${token}` }});
      } else {
        console.error('Team not found');
      }
      await axios.post('https://localhost:7290/api/AnsweredTask/CreateATs', correctAnswers,{headers: { Authorization: `Bearer ${token}` }});
      await axios.post('https://localhost:7290/api/Board/Update', {
        idBoard: board.idBoard,
        board1: board.board1
      },{headers: { Authorization: `Bearer ${token}` }});
    } catch (error) {
      console.error('Error updating board/teams/creating answered tasks:', error);
    };}
    setActualTeam(0);
    setUserAns([]);
    setCorrectAnswers([]);
    setIsLoged(false);
    setTeamD({ name: teamData[0].name, password: '', idTeam: teamData[0].idTeam });
  };

  return (
    <div className="main-c">
      <Navbar operatingData={operatingData.operatingData} />
      {isLogged ? (<div className="main-b">
        <RemTime eningTime={eningTime} setEningTime={setEningTime} timeForClock={timeforClock} setTimeForClock={setTimeForClock}/>
        
        <div className="game-container">
          <GameBoard boardArray={boardArray} teamData={teamData} actualTeamId={actualTeam}/>
          <div className="left-container">
            <div className="game-info">
            {teamData && actualTeam && teamData[teamData.findIndex(team => team.idTeam === actualTeam)] && 
                teamData[teamData.findIndex(team => team.idTeam === actualTeam)].steps !== undefined && 
                <h2>You can move {correctAnswers.length - teamData[teamData.findIndex(team => team.idTeam === actualTeam)].steps} times</h2>}
                {teamData.map((team, index) => (
                <h3 key={index}>{team.name}: {team.score}</h3>
              ))}
            </div>
            <UserActions teamData={teamData} actualTeam={actualTeam} board={board} boardArray={boardArray} setTeamData={setTeamData}
              setBoardArray={setBoardArray} updateBoardString={updateBoardString} correctAnswers={correctAnswers}/>
            <button className="button" onClick={logOut}>log out</button>

             

          </div>
          <TaskInputs tasksData={tasksData} userAns={userAns} correctAnswers={correctAnswers} 
            setUserAns={setUserAns} setCorrectAnswers={setCorrectAnswers} actualTeam={actualTeam} token={token}/>
        </div>
        
      </div>) : (<TeamLogIn teamData={teamData} teamD={teamD} setTeamD={setTeamD} setActualTeam={setActualTeam} actualTeam={actualTeam} setIsLoged={setIsLoged}
      setToken={setToken} token={token} setLog={setLog}/>)}
    </div>
  );


};

export default Game;
