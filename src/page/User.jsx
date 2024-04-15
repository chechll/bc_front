import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import ShowUser from '../components/userPage/ShowUser';
import UserUpdate from '../components/userPage/UserUpdate';
import { toast } from 'react-toastify';

function User({ onLoginChange, operatingData }) {
  const [userData, setUserData] = useState({
    username: '',
    password: '',
    idUser: operatingData.idUser,
    rights: operatingData.rights,
  });

  const [isEditing, setEditing] = useState(false);
  const [prevEditing, setPrevEditing] = useState(false);

  useEffect(() => {
    console.log(operatingData);
    if (operatingData.idUser === 0 || operatingData.idUser === undefined) {
      onLoginChange(operatingData.idUser, operatingData.rights, operatingData.token);
    }

    if (prevEditing === isEditing) {

      const fetchUserData = async () => {
        try {
          const response = await axios.get('https://localhost:7290/api/User/GetUser', {
            params: {
              id: operatingData.idUser,
            },
            headers: { Authorization: `Bearer ${operatingData.token}` }
          });

          const user = response.data;

          setUserData((prevdata)=>({...prevdata,
            username: user.username,
          }));
        } catch (error) {
          console.error('Error fetching user data:', error);
          toast.error('Error fetching user data');
        }
      };

      fetchUserData();
    }
  }, [operatingData.idUser, isEditing]);

  const handleEdit = () => {
    setEditing(!isEditing);
  };

  return (
    <div className="main-c">
      <Navbar operatingData={operatingData} />

      {!isEditing ? (
        <ShowUser handleEdit={handleEdit} userData={userData} onLoginChange={onLoginChange} />
      ) : (
        <UserUpdate handleEdit={handleEdit} userData={userData} setUserData={setUserData} />
      )}
    </div>
  );
}

export default User;