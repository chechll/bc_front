import { useEffect, useState } from 'react';
import React from "react";
import '../CSS/index.css';
import '../CSS/textPages.css';
import Navbar from '../components/Navbar';

function Index({ onLoginChange, operatingData }) {
    useEffect(() => {
        if (operatingData.idUser !== 0 || operatingData.idUser !== undefined) {
            onLoginChange(operatingData.idUser, operatingData.rights, operatingData.token);
        }
    }, []);

    return (
        <div>
            <Navbar operatingData={operatingData} />

            <div className="main-c">
                <div className='wel-sections'>
                <section>
                    <h2>Welcome to QuestMastermind!</h2>
                    <p>Whether you're a budding coder or a seasoned problem solver, our platform is designed to ignite your curiosity and sharpen your skills. Get ready to embark on a thrilling journey of discovery, challenge, and reward.</p>
                </section>

                <section>
                    <h2>Explore Our Key Features:</h2>
                    <ul>
                        <li><strong>Engaging Treasure Hunts</strong>: Dive into immersive quests filled with mysteries and puzzles</li>
                        <li><strong>Collaborative Gameplay</strong>: Join forces with friends to tackle challenges and unlock hidden treasures</li>
                        <li><strong>Customizable Adventures</strong>: Tailor your experience with a variety of quests and difficulty levels. Discover how QuestMastermind can transform learning into an exciting and rewarding adventure!</li>
                    </ul>
                </section>
                </div>
                <section className="testimonials-container">
                    <h2>See What Our Users Say:</h2>
                    <div className="testimonial">
                        <blockquote>
                            "QuestMastermind has revolutionized the way my students engage with coding challenges!"
                        </blockquote>
                        <p className="testimonial-author">- Sarah, Middle School Teacher</p>
                    </div>
                    <div className="testimonial">
                        <blockquote>
                            "The collaborative aspect of QuestMastermind makes learning fun and interactive for my students."
                        </blockquote>
                        <p className="testimonial-author">- Michael, Educational Coordinator</p>
                    </div>
                    <div className="testimonial">
                        <blockquote>
                            "I've never seen my students so motivated to solve problems and work together as a team. QuestMastermind is a game-changer!"
                        </blockquote>
                        <p className="testimonial-author">- Emily, Computer Science Instructor</p>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default Index;