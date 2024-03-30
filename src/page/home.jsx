import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import '../CSS/index.css';
import HomeAdmin from '../components/homePage/homeAdmin';
import HomeUser from '../components/homePage/homeUser';

function Home({ onLoginChange, operatingData }) {
    useEffect(() => {
        if (operatingData.idUser === 0 || operatingData.idUser === undefined || operatingData.rights === undefined) {
          onLoginChange(operatingData.idUser, operatingData.rights);
        }
      }, [operatingData.idUser]);

    return (
        <div className="main-c">
            <Navbar operatingData={operatingData} />

            {operatingData.rights == 0 ? (
                <HomeUser onLoginChange={onLoginChange} operatingData={operatingData} />
            ) : (
                <HomeAdmin onLoginChange={onLoginChange} operatingData={operatingData} />
            )}
        </div>
    )
}

export default Home;