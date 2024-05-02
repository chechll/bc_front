import React, {useEffect, useState} from 'react';
import axios from 'axios';
import '../../CSS/index.css';
import { toast } from 'react-toastify';

const HomeAdmin = ( { onLoginChange, operatingData} ) => {
  const [user, setUsers] = useState([]);
  const [isEditing, setEditing] = useState(false);
  const [choosedUser, setChoosedUser] = useState({
    idUser: 0,
    username: '',
    rights:0,
    password:'',
  });
  const [prevEditing, setPrevEditing] = useState(isEditing);

  useEffect(() => {
    if (operatingData.idUser === 0 || operatingData.idUser === undefined) {
      onLoginChange(operatingData.idUser, operatingData.rights, operatingData.token);
    }
    if( prevEditing === isEditing) {
      const fetchUsers = async () => {
        try {
            const response = await axios.get('https://localhost:7290/api/User/GetAllUsers',{headers: { Authorization: `Bearer ${operatingData.token}` }});
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
          const response = await axios.delete('https://localhost:7290/api/User/Delete', {
            params: {
              userId: idUser,
            },
            headers: { Authorization: `Bearer ${operatingData.token}` }
          });
          setUsers((prevUsers) => prevUsers.filter((user) => user.idUser !== idUser));
        } catch (error) {
          console.error('Error during delete:', error);
          toast.error('Error during delete');
        }
      }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    try {
      console.log('Updating');
      const response = await axios.put('https://localhost:7290/api/User/UpdateAdmin', choosedUser, {headers: { Authorization: `Bearer ${operatingData.token}` }});
    
      console.log('User updated successfully:', response.data);
      toast.success('User updated successfully:', response.data);
    } catch (error) {
    console.error('Error during update:', error);
    toast.error('Error during update');
    }
    
    handleEdit(choosedUser);
  };

  const handleEdit = (user) => {
    const userWithPassword = { ...user, password: '' };
  setEditing(!isEditing);
  setChoosedUser(userWithPassword);
  };

  return (
    <div className='main-c'>
      
      {!isEditing ? (
        <>          
          <h2>All Users</h2>
          <ul className="item-list">
          {user.map((user) => (
              <li key={user.idUser} className="item">
              <strong>Username:</strong> {user.username}
              <div className="user-buttons">
                <button className="button" onClick={() => handleEdit(user)}>
                    Update
                </button>
                <button className="button" onClick={() => handleDelete(user.idUser)}>
                    Delete
                </button>
              </div>
              </li>
          ))}
          </ul>
        </>
      ) : (
        <div className="main-c main-b">
          <div>
            <label>
              <strong>Username: </strong>
              <input type="text" name="username" value={choosedUser.username} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              <strong>Rigths:</strong>
              <input type="number" name="rights" value={choosedUser.rights} onChange={handleChange} />
            </label>
          </div>
          <div className="user-actions">
            <ul>
              <li><button className="button" onClick={handleUpdate}>Update</button></li>
              <li><button className="button" onClick={() => handleEdit(choosedUser)}>Back</button></li>
            </ul> 
          </div> 
        </div>
      )}   
    </div>
  );
};
  
export default HomeAdmin;