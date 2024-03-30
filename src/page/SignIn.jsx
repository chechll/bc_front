import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../CSS/index.css';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const SignIn = ({onLoginChange, operatingData, setOperatingData }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.get('https://localhost:7290/api/User/LogIn', {
                params: {
                    username: formData.username,
                    user_password: formData.password,
                },
            });

            const userData = {
                idUser: response.data.idUser,
                rights: response.data.rights,
            };
            
            setOperatingData(userData);
            console.log(operatingData);
        } catch (error) {
            console.error('Error during sign in:', error);
            toast.error('Error during sign-in. Please check your credentials and try again.');
        }

    };

    useEffect(() => {
        console.log(operatingData.rights, ' idu ', operatingData.idUser);
        if (operatingData.idUser !== 0 && operatingData.idUser !== undefined && operatingData.rights !== undefined) {
            onLoginChange(operatingData.idUser, operatingData.rights);
        }
    }, [operatingData.idUser, operatingData.rights]);

    return (
        <div className='main-c'>
            <Navbar operatingData={operatingData} />
            <div className='main-b'>
                <h1>Sign In</h1>
                <form onSubmit={handleSubmit}>
                    <label>
                        <input
                            placeholder='username'
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        <input
                            placeholder='password'
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </label>
                    <button className="button">Sign In</button>
                </form>
                <Link to="/sign_up" className="link">i don't have an acount</Link>
            </div>
        </div>
    );
};

export default SignIn;