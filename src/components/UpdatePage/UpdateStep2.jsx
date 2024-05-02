import React, { useState, useEffect } from 'react';
import '../../CSS/index.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const UpdateStep2 = ({ operatingData, stepForward, updateData, stepBack }) => {

  const [teamsData, setTeamsData] = useState([]);

  useEffect(() => {
    const fetchTeamsData = async () => {
      try {
        const response = await axios.get('https://localhost:7290/api/Team/GetTeams', {
            params: {
              idGame: updateData.idGame,
            },
            headers: { Authorization: `Bearer ${operatingData.token}` }
        });
        const initialTeamData = response.data.map(team => ({ ...team, password: '' }));
        setTeamsData(initialTeamData);
        
      } catch (error) {
        console.error('Error fetching teams data:', error);
        toast.error('Error fetching teams data');
      }
    };

    fetchTeamsData();
  }, []);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updatedTeamsData = [...teamsData];
    updatedTeamsData[index] = { ...updatedTeamsData[index], [name]: value };
    setTeamsData(updatedTeamsData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put('https://localhost:7290/api/Team/UpdateTeams', teamsData,{headers: { Authorization: `Bearer ${operatingData.token}` }});
      stepForward();
      toast.success('Updated successefully');
    } catch (error) {
      console.error('Error creating teams:', error);
      toast.error('Error during creating');
    }
  };

  return (
    <div className='main-c'>
      <h1>Updating game</h1>
      <h2>Step 2: Update Teams</h2>
      <form onSubmit={handleSubmit}>
        {teamsData.map((team, index) => (
          <div key={index}>
          <hr className='hr-style'/>
            <label>
              Team{index + 1} Name:  &nbsp;
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
              Password:  &nbsp; &nbsp; &nbsp; &nbsp;
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
              Colour:  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
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
          <li><button className="button" onClick={stepBack}>Back</button></li>
          <li><button className="button" type="submit">Save</button></li>
            <li><button className="button" onClick={stepForward}>Next</button></li>
          </ul>
        </div>
      </form>
    </div>
  );
};

export default UpdateStep2