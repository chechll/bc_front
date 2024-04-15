import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../CSS/index.css';
import '../CSS/game.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPerson } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/Navbar';
import Board from '../components/GamePage/Board';

function Stats({ onLoginChange, operatingData }) {
    const { idGame } = useParams();
    const [boardArray, setBoardArray] = useState([]);
    const [tasksData, setTasksData] = useState([]);
    const [teamData, setTeamData] = useState([]);
    const [teamD, setTeamD] = useState(0);
    const [board, setBoard] = useState({
        idBoard: 0,
        board1: '',
        idGame: 0,
        size: 0
    });
    const [correctAnswers, setCorrectAnswers] = useState([]);
    const [runningGame, setRunningGames] = useState(false);

    useEffect(() => {
        console.log(operatingData);
        if (operatingData.idUser === 0 || operatingData.idUser === undefined) {
            onLoginChange(operatingData.idUser, operatingData.rights, operatingData.token);
        }
        const fetchBoard = async () => {
            try {
                const response = await axios.get('https://localhost:7290/api/Board/GetBoard', {
                    params: {
                        id: idGame,
                    },
                    headers: { Authorization: `Bearer ${operatingData.token}` }
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
                    headers: { Authorization: `Bearer ${operatingData.token}` }
                });
                setTasksData(response.data);
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
                    headers: { Authorization: `Bearer ${operatingData.token}` }
                });
                setTeamData(response.data);
                setTeamD(prevData => ({ ...prevData, idTeam: response.data[0].idTeam }))

            } catch (error) {
                console.error('Error fetching teams data:', error);
                toast.error('Error fetching teams data');
            }
        };

        const checkIfRunning = async () => {
            try {
                const response = await axios.get('https://localhost:7290/api/Game/CheckGame', {
                    params: {
                        idGame: idGame,
                    },
                    headers: { Authorization: `Bearer ${operatingData.token}` }
                });
                if (response.data == "Yes" ) {
                    setRunningGames(true);
                }

            } catch (error) {
                console.error('Error fetching teams data:', error);
                toast.error('Error fetching teams data');
            }
        };

        fetchTeamsData();
        fetchTasksData();
        fetchBoard();
        checkIfRunning();
    }, [idGame]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTeamD((prevData) => ({ ...prevData, [name]: parseInt(value) }));
    };

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

    useEffect(() => {
        const fetchCorrectAnswers = async () => {
            try {
                const response = await axios.get('https://localhost:7290/api/AnsweredTask/GetAns', {
                    params: {
                        teamId: teamD.idTeam,
                    },
                    headers: { Authorization: `Bearer ${operatingData.token}` }
                });
                setCorrectAnswers(response.data);
                //console.log('corA ', response.data);
            } catch (error) {
                console.error('Error fetching correct answers:', error);
                toast.error('Error fetching correct answers');
            }
        };

        if (teamD !== 0) {
            fetchCorrectAnswers();
        }
    }, [teamD]);

    const stopGame = async(e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`https://localhost:7290/api/Game/End?idGame=${idGame}`,null ,{headers: { Authorization: `Bearer ${operatingData.token}` }});
            setRunningGames(false);
        } catch (error) {
            console.error('Error fetching correct answers:', error);
            toast.error('Error fetching correct answers');
        };
    }

    return (
        <div className="main-c main-w">
            <Navbar operatingData={operatingData} />

            
            <div className="game-container ">
                <Board boardArray={boardArray} teamData={teamData}/>
                <div className="left-container">
                    <div className="game-info">
                        {teamData.map((team, index) => (
                            <h3 key={index}>{team.name}: {team.score}</h3>
                        ))}
                    </div>
                </div>
            </div>
            
            {runningGame && <div><button className="button" onClick={stopGame}>Stop</button></div>}

            <select value={teamD.idTeam} onChange={handleChange} name="idTeam">
                {teamData.map((item, index) => (
                    <option key={index} value={item.idTeam}>
                        {item.name}
                    </option>
                ))}
            </select>
            <div className="task-inputs">
                {tasksData.map((task, index) => (
                    <div key={task.Number} className="task-input">
                        <p>
                            {index + 1}: {task.answer} {(correctAnswers.some(answer => answer.idTask === task.idTask)) ? <span style={{ color: 'green' }}>OK</span> : <span style={{ color: 'red' }}>No</span>}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Stats;