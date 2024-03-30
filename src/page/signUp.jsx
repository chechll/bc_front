import React, { useState, useEffect } from 'react';
import '../CSS/index.css';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const SignUp = ({onLoginChange, operatingData, setOperatingData }) => {
    const [formData, setFormData] = useState({
        username: '',
        userPassword: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('https://localhost:7290/api/User/SignUp', formData);

            setOperatingData({
                idUser: response.data.idUser,
                rights: response.data.rights,
            });

            toast.success('Successfuly, created');

            onLoginChange(operatingData.idUser, operatingData.rights);
        } catch (error) {
            if (error.response && error.response.status === 422) {
                console.error('Validation Error:', error.response.data);
                const errorMessages = error.response.data[''].errors;
                console.log('Error Messages:', errorMessages);
                toast.error('Error Messages:', errorMessages);
            } else {
                console.error('Error:', error.message);
                toString.error('error', error);
            }
        }
        setFormData({
            username: '',
            userPassword: '',
        });
    };

    return (
        <div className='main-c'>
            <Navbar operatingData={operatingData} />
            <div className='main-b'>
                <h1>Sign Up</h1>
                <form onSubmit={handleSubmit}>
                    <label>
                        <input
                            placeholder='username'
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        <input
                            placeholder='password'
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <button className="button" type="submit">Sign Up</button>
                </form>
                <Link to="/sign_in" className="link">I've already had an account</Link>
            </div>
        </div>
    );
};

export default SignUp