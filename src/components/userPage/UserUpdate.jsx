import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function UserUpdate({ handleEdit, userData, setUserData}) {

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {

      console.log('FormData:', userData);
      const response = await axios.put('https://localhost:7290/api/User/Update', userData
      );

      console.log('User updated successfully:', response.data);
      toast.success('Updated successfully');
    } catch (error) {
      console.error('Error during update:', error);
      toast.error('Error during update');
    }

    handleEdit();
  };

  const handleChange = (e) => {
    const { name, value} = e.target;
    setUserData((prevdata)=>({ ...prevdata, [name]: value}));
  };

  return (
    <div className=' main-c  main-b'>
      <h1>User Information</h1>
      <div className="update-user">
        <label>
          <strong>Username:</strong>
          <input type="text" name="username" value={userData.username} onChange={handleChange} />
        </label>
        <label>
            <strong>Password:</strong>
            <input type="password" name="password" value={userData.password} onChange={handleChange} />
        </label>
      
      <div className="user-actions">
        <ul className="user-buttons">
          <li><button className="button" onClick={handleUpdate}>Update</button></li>
          <li><button className="button" onClick={handleEdit}>Back</button></li>
        </ul>
      </div>
      </div>
    </div>
  );
}

export default UserUpdate;