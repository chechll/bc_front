import React,{useState, useEffect} from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const TeamLogIn = ({teamData, teamD, setTeamD ,setActualTeam, actualTeam, setIsLoged, setToken, token, setLog}) => {
  const [resp, setResp] = useState(0);
  const [isWaiting, setIsWaiting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'id') {
          setTeamD((prevData) => ({ ...prevData, [name]: parseInt(value) }));
        } else { setTeamD((prevData) => ({ ...prevData, [name]: value })); }
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.get('https://localhost:7290/api/Team/LogIn', {
            params: {
              password: teamD.password,
              id: teamD.idTeam,
            },
          });
          setResp(response.data.id);
          setToken(response.data.token);
          try {
            const respon = await axios.put(`https://localhost:7290/api/Game/AddTeam?idTeam=${teamD.idTeam}`);
            setActualTeam(parseInt(teamD.idTeam));
            if (respon.data == "Team started") {

            setIsLoged(true);
            } else {
              setIsWaiting(true);
            }
          } catch (error) {
            if (error.data == "There is no such team in active games"){
              setLog(true);
            }
            console.error('Error during add in:', error.response.data);
          }         
        } catch (error) {
          console.error('Error during sign in:', error.response.data);
          toast.error('Error during sign-in. Please check your credentials and try again.');
        }
      };

      useEffect(() => {
        let intervalId;
        if (isWaiting && actualTeam !== 0) {
          intervalId = setInterval(async () => {
            try {
              const response = await axios.get('https://localhost:7290/api/Game/CheckCurrent', {
                params: {
                  idTeam: actualTeam,
                },
              });
              if (response.data == "Ok") {
              setIsWaiting(false);
              clearInterval(intervalId);
              setIsLoged(true);}
            } catch (error) {
              console.error('Error while checking turn:', error);
            }
          }, 5000);
        }
        return () => clearInterval(intervalId);
      }, [isWaiting, teamD.idTeam, resp, setActualTeam, setIsLoged,]);

  return (
    <div className='main-c main-b'>
      {!isWaiting ? (<form onSubmit={handleSubmit} className='form-label'>
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
        </form>) : (<h1>please wait your turn</h1>)}
      </div>
  );
};
export default TeamLogIn;