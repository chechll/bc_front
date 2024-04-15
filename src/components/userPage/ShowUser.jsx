import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function ShowUser({ handleEdit, userData, onLoginChange }) {
    const handleLogout = () => {
        onLoginChange();
    };

    const handleDelete = async (e) => {
        e.preventDefault();

        const isConfirmed = window.confirm('Are you sure you want to delete your account?');

        if (isConfirmed) {
            try {
                const response = await axios.delete('https://localhost:7290/api/User/Delete', {
                    params: {
                        userId: userData.idUser,
                    },
                    headers: { Authorization: `Bearer ${operatingData.token}` }
                });
                console.log('Deleted successfully');
                onLoginChange(response.data);
            } catch (error) {
                console.error('Error during delete:', error);
                toast.error('Error during delete');
            }
        } else {
            console.log('User chose not to delete the account.');
        }
    };

    return (
        <div className="main-c  main-b">
            <h1>User Information</h1>
            <div>
                <strong>Username:</strong> <p>{userData.username}</p>
            </div>
            <div>
                <ul className="user-buttons">
                    <li>
                        <button className="button" onClick={handleEdit}>Update</button>
                    </li>
                    <li>
                        <button className="button" onClick={handleDelete}>Delete</button>
                    </li>
                    <li>
                        <button className="button" onClick={handleLogout}>Log Out</button>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default ShowUser;