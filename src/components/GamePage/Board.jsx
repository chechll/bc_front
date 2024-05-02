import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPerson } from '@fortawesome/free-solid-svg-icons';

const GameBoard = ({ boardArray, teamData, actualTeamId }) => {
    return (
        <div className="board-container">
            <table className="board">
                <tbody>
                    {boardArray.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => {
                                const actualTeamCell = teamData.find(team => team.idTeam === actualTeamId && team.positionY === rowIndex && team.positionX === cellIndex);
                                if (actualTeamCell) {
                                    return (
                                        <td key={`${rowIndex}-${cellIndex}`} className="player">
                                            <FontAwesomeIcon icon={faPerson} style={{ color: actualTeamCell.colour }} />
                                        </td>
                                    );
                                } else {
                                    const matchingTeam = teamData.find(team => team.idTeam !== actualTeamId && team.positionY === rowIndex && team.positionX === cellIndex);
                                    return (
                                        <td key={`${rowIndex}-${cellIndex}`} className={matchingTeam ? 'player' : ''}>
                                            {matchingTeam && (
                                                <FontAwesomeIcon icon={faPerson} style={{ color: matchingTeam.colour }} />
                                            )}
                                            {!matchingTeam && cell}
                                        </td>
                                    );
                                }
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default GameBoard;
