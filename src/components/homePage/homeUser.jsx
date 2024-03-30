import React, { useEffect, useState } from 'react';
import '../../CSS/index.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';

function HomeUser ({onLoginChange, operatingData}) {
    const [games, setGames] = useState([]);
    const [preparedGames, setPreparedGames] = useState([]);
    const [completedGames, setCompletedGames] = useState([]);
    const [isThereAnyGame, setIsThereAnyGame] = useState(true);
    const navigate = useNavigate();

    const fetchGames = async () => {
        try {
            const response = await axios.get('https://localhost:7290/api/Game/GetAllGames');
            if (response.data && response.data.length > 0) {
                const preparedGames = response.data.filter(game => game.dateGame === null);
                const completedGames = response.data.filter(game => game.dateGame !== null);
                setPreparedGames(preparedGames);
                setCompletedGames(completedGames);
                console.log(response.data);
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
            onLoginChange(operatingData.idUser, operatingData.rights);
        }

        fetchGames();
    }, []);

    const handleCreate = () => {
        navigate('/create_game'); 
    };

    const handleClone = async (idGame) => {
        const isConfirmed = window.confirm('Are you sure?');
        if (isConfirmed) {
            try {
                console.log(idGame);
                await axios.get('https://localhost:7290/api/Game/CloneGame', { params : {idGame:idGame},});
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
                console.log(idGame);
                await axios.delete('https://localhost:7290/api/Game/DeleteGame', {
                    params: {
                        idGame: idGame,
                    },
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

    return (
        <div className='main-w'>
            <button className="button" onClick={handleCreate}>
                        Create new game
            </button>
            {isThereAnyGame ? (
                <div>
                    <div className='item list'>
                    <hr className='hr-style'/>
                    <h1>Prepared Games:</h1>
                    <ul className="item-list">
                        {preparedGames.map((game) => (
                            <li key={preparedGames.idGame} className="item">
                                <strong>Name</strong> {game.name}
                                <Link className='button-link' to={`/game/${game.idGame}`}>Start</Link>
                                <Link className='button-link' to={`/update_game/${game.idGame}`}>Update</Link>
                                <button className="button" onClick={() => handleDelete(game.idGame)}>
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                    
                    <hr className='hr-style'/>
                    <h1>Completed Games:</h1>
                    <ul className="item-list">
                        {completedGames.map((game) => (
                            <li key={game.idGame} className="item">
                                <strong>Name</strong> {game.name} , <strong>Date:</strong> {game.dateGame}
                                <Link className='button-link' to={`/stats/${game.idGame}`}>Show Stats</Link>
                                <button className="button" onClick={() => handleClone(game.idGame)}>
                                    Clone
                                </button>
                                <button className="button" onClick={() => handleDelete(game.idGame)}>
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                    </div>
                </div>
            ) : (
                <div>
                    <p>You don't have any game yet. Let's make some</p>
                    <button className="button" onClick={handleCreate}>
                        Create
                    </button>
                </div> 
            )}
        </div>
    );
}

export default HomeUser;