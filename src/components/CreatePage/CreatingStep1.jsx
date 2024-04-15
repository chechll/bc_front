import React, { useState, useEffect } from 'react';
import '../../CSS/index.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const CreatingStep1 = ({ operatingData, stepForward, createData, setCreateData, updateIdGame }) => {

  const [formData, setFormData] = useState({
    name: '',
    idUser: 0,
    size: 0,
  });

  const handleChange = async (e) => {
    const { name, value } = e.target;
    if (name === 'size' || name === 'numberOfTeams') {
      const vale = parseInt(value, 10);
      setCreateData((prevData) => ({ ...prevData, [name]: vale }));
    } else {
      setCreateData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      setFormData({
        size: createData.size,
        name: createData.name,
        idUser: operatingData.idUser
      });
    } catch (error) {
      console.error('Error setting form data:', error);
    }
  };

//   <label>
//   <strong>Enable question:</strong>
//   <select value={createData.enQuestions} onChange={handleChange} name="enQuestions">
//     <option value={true}>true</option>
//     <option value={false}>false</option>
//   </select>
// </label>

  useEffect(() => {
    const fetchData = async () => {
      try {
        //console.log(formData);
        const response = await axios.post('https://localhost:7290/api/Game/CreateGame', formData, {headers: { Authorization: `Bearer ${operatingData.token}` }});
        //console.log(response.data);
        //console.log(createData.idGame);

        updateIdGame(response.data);

        toast.success('Created successfully');
        stepForward();
      } catch (error) {
        if (error.response && error.response.status === 422) {
          const errorMessages = error.response.data[''].errors;
          console.log('Error Messages:', errorMessages);
          errorMessages.forEach((error) => {
            toast.error(`Validation Error: ${error.errorMessage}`);
          });
        } else {
          console.error('Error:', error.message);
        }
      }
    };

    if (formData.name && formData.size && formData.idUser) {
      fetchData();
    }
  }, [formData, stepForward]);

  return (
    <div className='main-c main-b'>
      <h1>Creating game</h1>
      <h2>Step 1</h2>
      <form onSubmit={handleSubmit}>
      <div className="form-container">
  <label className="form-label">
    <strong>Name:</strong>
    <input
      className="form-input"
      placeholder='name'
      type="text"
      name="name"
      value={createData.name}
      onChange={handleChange}
      required
    />
  </label>
  <label className="form-label">
    <strong>Size:</strong>
    <select
      className="form-input"
      value={createData.size}
      onChange={handleChange}
      name="size"
    >
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
  <label className="form-label">
    <strong>Number of teams:</strong>
    <select
      className="form-input"
      value={createData.numberOfTeams}
      onChange={handleChange}
      name="numberOfTeams"
    >
      <option value={2}>2</option>
      <option value={3}>3</option>
      <option value={4}>4</option>
      <option value={5}>5</option>
      <option value={6}>6</option>
    </select>
  </label>
  <label className="form-label">
    <strong>Number of tasks:</strong>
    <input
      className="form-input"
      placeholder='numberOfTasks'
      type="number"
      name="numberOfTasks"
      value={createData.numberOfTasks}
      onChange={handleChange}
      required
    />
  </label>
</div>

        <div className="user-actions">
          <ul className="user-buttons">
            <li><button className="button" type="submit">Next</button></li>
          </ul>
        </div>
      </form>

    </div>
  );
};

export default CreatingStep1