import React from 'react';

const UserActions = ({ teamData, actualTeam, board, boardArray, setTeamData, setBoardArray, updateBoardString, correctAnswers }) => {
  const movePlayer = (difRow, difCell) => {
    const teamIndex = teamData.findIndex(team => team.idTeam === actualTeam);
    const newRow = teamData[teamIndex].positionY + difRow;
    const newCell = teamData[teamIndex].positionX + difCell;

    if (
      newRow >= 0 &&
      newRow < board.size &&
      newCell >= 0 &&
      newCell < board.size &&
      correctAnswers.length - teamData[teamIndex].steps > 0
    ) {
      const newValue = boardArray[newRow][newCell];
      const prevValue = teamData[teamIndex].score;
      const updatedTeamData = [...teamData];
      updatedTeamData[teamIndex].positionX = newCell;
      updatedTeamData[teamIndex].positionY = newRow;
      updatedTeamData[teamIndex].score = prevValue + newValue;
      updatedTeamData[teamIndex].steps = updatedTeamData[teamIndex].steps + 1;
      setTeamData(updatedTeamData);

      const newBoardArray = [...boardArray];
      newBoardArray[newRow][newCell] = 0;
      setBoardArray(newBoardArray);

      updateBoardString();
    }
  };

  return (
    <div className="user-actions">
      <button className="button" onClick={() => movePlayer(-1, 0)}>Up</button>
      <ul className="user-buttons">
        <li><button className="button" onClick={() => movePlayer(0, -1)}>Left</button></li>
        <li><button className="button" onClick={() => movePlayer(1, 0)}>Down</button></li>
        <li><button className="button" onClick={() => movePlayer(0, 1)}>Right</button></li>
      </ul>
    </div>
  );
};

export default UserActions;
