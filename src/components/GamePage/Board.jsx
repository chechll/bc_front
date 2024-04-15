import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPerson } from '@fortawesome/free-solid-svg-icons';

const GameBoard = ({ boardArray, teamData}) => {
  return (
    <div className="board-container">
        <table className="board">
          <tbody>

                {boardArray.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={`${rowIndex}-${cellIndex}`} className={teamData.some(team => team.positionY === rowIndex && team.positionX === cellIndex) ? 'player' : ''}>
                        {teamData.map((team, teamIndex) => (
                          team.positionY === rowIndex && team.positionX === cellIndex ? (
                            <FontAwesomeIcon key={teamIndex} icon={faPerson} style={{ color: team.colour }} />

                          ) : null
                        ))}
                        {!teamData.some(team => team.positionY === rowIndex && team.positionX === cellIndex) && cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
  );
};

export default GameBoard;
