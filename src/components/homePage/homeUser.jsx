import React, { useEffect, useState } from 'react';
import '../../CSS/index.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';

function HomeUser({ onLoginChange, operatingData }) {
    const [games, setGames] = useState([]);
    const [preparedGames, setPreparedGames] = useState([]);
    const [completedGames, setCompletedGames] = useState([]);
    const [isThereAnyGame, setIsThereAnyGame] = useState(true);
    const [runningGames, setRunningGames] = useState([]);
    const navigate = useNavigate();

    const fetchGames = async () => {
        try {
            const response = await axios.get('https://localhost:7290/api/Game/GetAllGames', {
                params: { iduser: operatingData.idUser },
                headers: { Authorization: `Bearer ${operatingData.token}` }
            });
            if (response.data && response.data.length > 0) {
                const currentTime = new Date();
                const preparedGames = [];
                const runningGames = [];
                const completedGames = [];

                await Promise.all(response.data.map(async (game) => {
                    if (!game.dateGame) {
                        preparedGames.push(game);
                    } else {
                        const differenceInMillis = currentTime - new Date(game.dateGame);
                        const differenceInHours = differenceInMillis / (1000 * 60 * 60);
                        if (differenceInHours < 1 && (await checkIfRunning(game.idGame))) {
                            runningGames.push(game);
                        } else {
                            completedGames.push(game);
                        }
                    }

                    if (!game.dateGame && (await checkGameData(game.idGame))) {
                        game.hasError = true;
                    }
                }));

                setPreparedGames(preparedGames);
                setRunningGames(runningGames);
                setCompletedGames(completedGames);
                setGames(response.data);
                setIsThereAnyGame(true);
            } else {
                setIsThereAnyGame(false);
                console.log('No data received from the server.');
            }
        } catch (error) {
            console.error('Error fetching games:', error);
        }
    };


    useEffect(() => {
        if (operatingData.idUser === 0 || operatingData.idUser === undefined) {
            onLoginChange(operatingData.idUser, operatingData.rights, operatingData.token);
        }

        fetchGames();
    }, []);

    const handleCreate = () => {
        navigate('/create_game');
    };

    const checkIfRunning = async (idG) => {
        try {
            const response = await axios.get('https://localhost:7290/api/Game/CheckGame', {
                params: {
                    idGame: idG,
                },
                headers: { Authorization: `Bearer ${operatingData.token}` }
            });
            if (response.data == "Yes") {
                return true;
            } else {
                return false;
            }

        } catch (error) {
            console.error('Error fetching teams data:', error);
            toast.error('Error fetching teams data');
        }
    };

    const handleStartGame = async (idGame) => {
        try {
            await axios.put(`https://localhost:7290/api/Game/Start?idGame=${idGame}`, null, { headers: { Authorization: `Bearer ${operatingData.token}` } });
            console.log('Added successfully');
            toast.success('Cloned successfully');
            navigate(`/game/${idGame}`);
        } catch (error) {
            console.error('Error during start:', error.response.data);
            toast.error('Error during clone');
        }
    };

    const handleClone = async (idGame) => {
        const isConfirmed = window.confirm('Are you sure?');
        if (isConfirmed) {
            try {
                await axios.get('https://localhost:7290/api/Game/CloneGame', { params: { idGame: idGame }, headers: { Authorization: `Bearer ${operatingData.token}` } });
                console.log('Cloned successfully');
                toast.success('Cloned successfully');
                fetchGames();
            } catch (error) {
                console.error('Error during clone:', error);
                toast.error('Error during clone');
            }
        }
    };

    const handleDelete = async (idGame) => {
        const isConfirmed = window.confirm('Are you sure?');
        if (isConfirmed) {
            try {
                await axios.delete('https://localhost:7290/api/Game/DeleteGame', {
                    headers: { Authorization: `Bearer ${operatingData.token}` },
                    params: { idGame: idGame, },
                });
                console.log('Deleted successfully');
                toast.success('Deleted successfully');
                setGames((prevGames) => prevGames.filter((game) => game.idGame !== idGame));
                setPreparedGames((prevGames) => prevGames.filter((game) => game.idGame !== idGame));
                setCompletedGames((prevGames) => prevGames.filter((game) => game.idGame !== idGame));
                if (games === null) {
                    setIsThereAnyGame(false);
                }
            } catch (error) {
                console.error('Error during delete:', error);
                toast.error('Error during delete');
            }
        }
    };

    const checkGameData = async (idGame) => {
        try {
            const response = await axios.get('https://localhost:7290/api/Game/CheckGameData', {
                params: { id: idGame },
                headers: { Authorization: `Bearer ${operatingData.token}` }
            });
            return false;
        } catch (error) {
            console.error('Error checking game data:', error);
            return true;
        }
    };

    return (
        <div className='main-w'>
            {isThereAnyGame ? (
                <div>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <button className="button" onClick={handleCreate}>
                            Create new
                        </button>
                    </div>
                    <hr className='hr-style' />
                    <h1>Running Games:</h1>
                    <ul className="item-list">
                        {runningGames.map((game) => (
                            <li key={game.idGame} className="item">
                                <strong>Name</strong> {game.name} , <strong>Date:</strong> {new Date(game.dateGame).toLocaleString()}
                                <div className='buttons'>
                                    <Link className='button-link' to={`/stats/${game.idGame}`}>Stats</Link>
                                    <button className="button" onClick={() => handleClone(game.idGame)}>
                                        Clone
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div className='item list'>
                        <hr className='hr-style' />
                        <h1>Prepared Games:</h1>
                        <ul className="item-list">
                            {preparedGames.map((game) => (
                                <li key={game.idGame} className="item">
                                    <strong>Name</strong> {game.name}
                                    <div className='buttons'>
                                        {!game.hasError && (
                                            <button className='button' onClick={() => handleStartGame(game.idGame)}>Start</button>
                                        )}
                                        <Link className='button-link' to={`/update_game/${game.idGame}`}>Update</Link>
                                        <button className="button" onClick={() => handleDelete(game.idGame)}>
                                            Delete
                                        </button>
                                    </div>
                                    {game.hasError && <span style={{ color: 'red' }}>Error: Game not fully created</span>}
                                </li>
                            ))}
                        </ul>

                        <hr className='hr-style' />
                        <h1>Completed Games:</h1>
                        <ul className="item-list">
                            {completedGames.map((game) => (
                                <li key={game.idGame} className="item">
                                    <strong>Name</strong> {game.name} , <strong>Date:</strong> {new Date(game.dateGame).toLocaleString()}
                                    <div className='buttons'>
                                        <Link className='button-link' to={`/stats/${game.idGame}`}>Stats</Link>
                                        <button className="button" onClick={() => handleClone(game.idGame)}>
                                            Clone
                                        </button>
                                        <button className="button" onClick={() => handleDelete(game.idGame)}>
                                            Delete
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                    <p>You don't have any game yet. Let's make some</p>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <button className="button" onClick={handleCreate}>
                            Create new
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default HomeUser;