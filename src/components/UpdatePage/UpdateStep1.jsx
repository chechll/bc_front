import React, { useState, useEffect } from 'react';
import '../../CSS/index.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const UpdateStep1 = ({ operatingData, onLoginChange, stepForward, updateData, setUpdateData }) => {
    const handleChange = async (e) => {
        const { name, value } = e.target;
        if (name === 'size' || name === 'numberOfTeams') {
            const vale = parseInt(value, 10);
            setUpdateData((prevData) => ({ ...prevData, [name]: vale }));
        } else {
            setUpdateData((prevData) => ({ ...prevData, [name]: value }));
        }
    };

    const [isSaveClicked, setIsSaveClicked] = useState(false);

    const handleSubmit = async (e) => {
        if (isSaveClicked) {
        const isConfirmed = window.confirm('Are you sure?');

        if (isConfirmed) {
            e.preventDefault();
            try {
                const response = await axios.put('https://localhost:7290/api/Game/UpdateGameByGameData', updateData,{headers: { Authorization: `Bearer ${operatingData.token}` }});
                stepForward();
            } catch (error) {
                console.error('Error creating teams:', error);
                toast.error('Error during updating');
            }
        }
    }
    };

    useEffect(() => {
        if (operatingData.idUser === 0 || operatingData.idUser === undefined) {
            onLoginChange(operatingData.idUser,operatingData.rights, operatingData.token);
        }

        const fetchGameData = async () => {
            try {
                const response = await axios.get('https://localhost:7290/api/Game/GetGameData', {
                    params: {
                        id: updateData.idGame,
                    },
                    headers: { Authorization: `Bearer ${operatingData.token}` }
                });

                const game = response.data;
                setUpdateData({
                    name: game.name,
                    size: game.size,
                    numberOfTeams: game.numberOfTeams,
                    numberOfTasks: game.numberOfTasks,
                    idGame: game.idGame,
                    enQuestions: game.enQuestions,
                });
            } catch (error) {
                console.error('Error fetching game data:', error);
                toast.error('Error fetching game data');
            }
        };

        fetchGameData();
    }, []);

    return (
        <div className='main-c  main-b'>
            <h1>Updating game</h1>
            <h2>Step 1</h2>
            <form onSubmit={handleSubmit}>
            <strong>Name:</strong>
                <label>
                    <input
                        placeholder='name'
                        type="text"
                        name="name"
                        value={updateData.name}
                        onChange={handleChange}
                        required
                    />
                </label>
                    <strong>Size: </strong>
                <label>
                    <select value={updateData.size} onChange={handleChange} name="size">
                        <option value={9}>9</option>
                        <option value={11}>11</option>
                        <option value={13}>13</option>
                        <option value={15}>15</option>
                        <option value={17}>17</option>
                        <option value={19}>19</option>
                        <option value={21}>21</option>
                        <option value={23}>23</option>
                        <option value={25}>25</option>
                    </select>
                </label>

                <strong>Number of teams: </strong>
                <label>
                    <select value={updateData.numberOfTeams} onChange={handleChange} name="numberOfTeams">
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                        <option value={6}>6</option>
                    </select>
                </label>
                    <strong>Number of tasks: </strong>

                <label>
                    <input
                        placeholder='numberOfTasks'
                        type="number"
                        name="numberOfTasks"
                        value={updateData.numberOfTasks}
                        onChange={handleChange}
                        required
                    />
                </label>

                <div className="user-actions">
                    <ul className="user-buttons">
                    <li><button className="button" type="submit" onClick={() => setIsSaveClicked(true)}>Save</button></li>
                        <li><button className="button" onClick={stepForward}>Next</button></li>
                    </ul>
                </div>
            </form>

        </div>
    );
};

export default UpdateStep1