import React, { useState, useEffect } from 'react';
import '../../CSS/index.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const CreatingStep2 = ({ operatingData, stepForward, createData }) => {

  const [teamsData, setTeamsData] = useState([]);

  useEffect(() => {
    setTeamsData(Array.from({ length: createData.numberOfTeams }, () => ({ colour: '#000000', name: '', password: '', idGame: createData.idGame, score: 0 })));
  }, [createData.numberOfTeams]);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updatedTeamsData = [...teamsData];
    updatedTeamsData[index] = { ...updatedTeamsData[index], [name]: value };
    setTeamsData(updatedTeamsData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      //console.log(createData.idGame);
      //console.log(createData);
      //console.log(teamsData);
      const response = await axios.post('https://localhost:7290/api/Team/CreateTeams', teamsData,{headers: { Authorization: `Bearer ${operatingData.token}` }});

      
      stepForward();
    } catch (error) {
      console.error('Error creating teams:', error);
      toast.error('Error during creating');
    }
  };

  return (
    <div className='main-c'>
      <h1>Creating game</h1>
      <h2>Step 2: Create Teams</h2>
      <form onSubmit={handleSubmit}>
        {teamsData.map((team, index) => (
          <div key={index}>
            <label>
              Team {index + 1} Name:
              <input
                placeholder='Name'
                type="text"
                name="name"
                value={team.name}
                onChange={(e) => handleChange(index, e)}
                required
              />
            </label>
            <label>
              Password:
              <input
                placeholder='Password'
                type="password"
                name="password"
                value={team.password}
                onChange={(e) => handleChange(index, e)}
                required
              />
            </label>
            <label>
              Colour:
              <input
                placeholder='colour'
                type="color"
                name="colour"
                value={team.colour}
                onChange={(e) => handleChange(index, e)}
                required
              />
            </label>
          </div>
        ))}
        <div className="user-actions">
          <ul className="user-buttons">
            <li><button className='button' type="submit">Next</button></li>
          </ul>
        </div>
      </form>
    </div>
  );
};

export default CreatingStep2