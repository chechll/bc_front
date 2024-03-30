import React, {useEffect, useState} from 'react';
import axios from 'axios';
import '../../CSS/index.css';
import { toast } from 'react-toastify';

const HomeAdmin = ( { onLoginChange, operatingData} ) => {
  const [user, setUsers] = useState([]);
  const [isEditing, setEditing] = useState(false);
  const [choosedUser, setChoosedUser] = useState({});
  const [prevEditing, setPrevEditing] = useState(isEditing);

  useEffect(() => {
    if (operatingData.idUser === 0 || operatingData.idUser === undefined) {
      onLoginChange(operatingData.idUser, operatingData.rights);
    }
    if( prevEditing === isEditing) {
      const fetchUsers = async () => {
        try {
            const response = await axios.get('https://localhost:7290/api/User/GetAllUsers');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    fetchUsers();
    }
  }, [operatingData.idUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setChoosedUser((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleDelete = async (idUser) => {
  
      const isConfirmed = window.confirm('Are you sure?');
  
      if (isConfirmed) {
        try {
          const response = await axios.delete('https://localhost:7298/api/User/UserDelete', {
            params: {
              idUser: idUser,
            },
          });
          console.log('Deleted successfully');
          setUsers((prevUsers) => prevUsers.filter((user) => user.id !== idUser));
        } catch (error) {
          console.error('Error during delete:', error);
          toast.error('Error during delete');
        }
      }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      formData.append('idUser', userData.idUser);
      formData.append('name', userData.name);
      formData.append('surname', userData.surname);
      formData.append('email', userData.email);
      formData.append('userPassword', userData.userPassword);
      formData.append('rights', userData.rights);
    
      console.log('Updating');

      const response = await axios.put('https://localhost:7298/api/User/Update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    
      console.log('User updated successfully:', response.data);
      toast.success('User updated successfully:', response.data);
    } catch (error) {
    console.error('Error during update:', error);
    toast.error('Error during update');
    }
    
    handleEdit(choosedUser);
  };

  const handleEdit = (user) => {
    setEditing(!isEditing);
    setChoosedUser(user);
  };

  return (
    <div className='main-c'>
      
      {!isEditing ? (
        <>          
          <h2>All Users</h2>
          <ul className="item-list">
          {user.map((user) => (
              <li key={user.id} className="item">
              <strong>Email:</strong> {user.email}
              <div className="user-buttons">
                <button className="button" onClick={() => handleEdit(user)}>
                    Update
                </button>
                <button className="button" onClick={() => handleDelete(user.id)}>
                    Delete
                </button>
              </div>
              </li>
          ))}
          </ul>
        </>
      ) : (
        <>
          <div>
            <label>
              <strong>Name: </strong>
              <input type="text" name="name" value={choosedUser.name} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              <strong>Surname: </strong>
              <input type="text" name="surname" value={choosedUser.surname} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              <strong>Email: </strong>
              <input type="text" name="email" value={choosedUser.email} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              <strong>isAdmin:</strong>
              <input type="number" name="Admin" value={choosedUser.Admin} onChange={handleChange} />
            </label>
          </div>
          <div className="user-actions">
            <ul>
              <li><button className="button" onClick={handleUpdate}>Update</button></li>
              <li><button className="button" onClick={() => handleEdit(choosedUser)}>Back</button></li>
            </ul> 
          </div> 
        </>
      )}   
    </div>
  );
};
  
export default HomeAdmin;