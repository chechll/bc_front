import React from "react";
import '../CSS/index.css';
import '../CSS/textPages.css';
import Navbar from '../components/Navbar';

function Rules({ operatingData }) {

    return (
        <div>
            <Navbar operatingData={operatingData} />

            <div className="main-c">
            <section className="rules">
            <h2>Embark on an exciting adventure with Treasure Hunt, the ultimate computer-based game.</h2>
            <p>Gather your friends, form teams, and dive into the thrilling world of code-breaking and puzzle-solving.</p>
            <h3>Here's how to get started:</h3>
            <ol>
                <li><strong>Team Setup:</strong> Enter the names of your teams by clicking on the colored rectangles. You
                    can have up to 6 teams, each with a unique name and color.</li>
                <li><strong>Admin Access:</strong> The game organizer will enter the admin password to start the game</li>
                <li><strong>Gameplay:</strong> Once the game starts, you'll be presented with a 9x9 - 25-25 grid representing the
                    game area. Each cell contains a value from 0 to 9, representing the treasure in that location.</li>
                <li><strong>Solving Challenges:</strong> Team members will solve challenges to earn codes. These codes must be entered correctly to progress in the game.</li>
                <li><strong>Time Limit:</strong> Be quick! Each team has a limited time to play. Make sure to use your time wisely.</li>
                <li><strong>Saving Progress:</strong> In case of unexpected interruptions, the game progress is automatically
                    saved. You can resume your game by entering the admin password and selecting the "Return to Game" option.</li>
                <li><strong>Default Values:</strong> If any essential files are missing or insufficient data is provided,
                    default values will be used. These include default passwords, codes, and the game grid.</li>
            </ol>
            <p>Start your adventure today and see if your team has what it takes to uncover the treasure!</p>
        </section>
            </div>
        </div>
    )
}

export default Rules;