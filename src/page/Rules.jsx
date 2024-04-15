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
                    <h2>Embark on an exciting adventure with Quest, the ultimate computer-based game.</h2>
                    <h3>Here's how to get started:</h3>
                    <ol>
                        <li><strong>Admin Access:</strong> The game organizer will enter the admin password to start the game.</li>
                        <li><strong>Team Access:</strong> The team will enter the team password to enter the game. Teams play in a queue.</li>
                        <li><strong>Gameplay:</strong> Once the game starts, you'll be presented with a 9x9 - 25x25 grid representing the game area. Each cell contains a value from 0 to 9, representing the treasure in that location.</li>
                        <li><strong>Solving Challenges:</strong> The team must write the answer in the cell with the corresponding number to move the character by 1 cell. This answer must be entered correctly to progress in the game.</li>
                        <li><strong>Time Limit:</strong> Be quick! Each team has only 2 minutes per turn, while the entire game lasts one hour. Make sure to use your time wisely.</li>
                        <li><strong>Saving Progress:</strong> In case of unexpected interruptions, the game progress is automatically saved.</li>
                    </ol>
                    <p>Start your adventure today and see if your team has what it takes to uncover the treasure!</p>
                </section>
            </div>
        </div>
    )
}

export default Rules;