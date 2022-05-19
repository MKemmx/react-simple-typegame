import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

function Game() {
  // game Start
  const [gameStart, setGameStart] = useState(false);
  // Const Game Level
  const [gameLevel, setGameLevel] = useState("easy");
  // Random Word
  const [randomWord, setRandomWord] = useState("");
  // Score
  const [score, setScore] = useState(null);
  const [time, setTime] = useState(null);
  // My Answer
  const [answer, setAnswer] = useState("");

  const startGame = () => {
    // Game State
    setGameStart(true);
    // Starting Count Down
    gameLevelSelected();
    // Start Fetching Random Word
    randomWordGenerator();
  };

  // Fetch Random Word
  const randomWordGenerator = async () => {
    setAnswer("");
    try {
      const { data } = await axios.get(
        "https://random-word-api.herokuapp.com/word"
      );
      setRandomWord(data);
    } catch (error) {
      console.log(error);
    }
  };

  // Check Level Selected
  const gameLevelSelected = () => {
    if (gameLevel === "easy") {
      return setTime(10);
    }

    if (gameLevel === "hard") {
      return setTime(15);
    }

    if (gameLevel === "expert") {
      return setTime(20);
    }
  };

  // On Change
  const handleOnChange = (e) => {
    setAnswer(e.target.value);

    // Correct Answer
    if (e.target.value === randomWord[0]) {
      // Add Score
      setScore(score + 1);
      // Fetch Random Generator
      randomWordGenerator();
    }
  };

  //   Check if game is going
  const checkIsGoing = () => {
    if (time === null) {
      return;
    }

    if (time <= 0) {
      alert(`Game over! your score is: ${score}`);
      // Reset Input Field
      setAnswer("");
      // Reset Game Status
      setGameStart(false);
      // Reset Game Score
      setScore(null);
      // Reset Game Level
      setGameLevel("easy");
      // Set Time to Null
      setTime(null);
      // Random Word Back to null
      setRandomWord("");
      return;
    }
  };

  useEffect(() => {
    // Check if game has ended
    checkIsGoing();
    const timer = time > 0 && setInterval(() => setTime(time - 1), 1000);
    return () => clearInterval(timer);
  }, [time]);

  return (
    <div className="app">
      <div className="container">
        {/* Title */}
        <div className="title">
          <h1>Simple Speed Typing</h1>
        </div>

        {/* Game Details */}
        <div className="game-details">
          <div className="card">
            <h6> Score </h6>
            <h1> {score === null ? 0 : score} </h1>
          </div>

          <div className="card">
            <h6> Time </h6>
            <h1> {time === null ? 0 : time}s </h1>
          </div>

          <div className="card">
            <h6> Select Level </h6>
            <select
              className="level-option"
              onChange={(e) => {
                setGameLevel(e.target.value);
              }}
              value={gameLevel}
            >
              <option value="easy">Easy</option>
              <option value="hard">Hard</option>
              <option value="expert">Expert</option>
            </select>
          </div>
        </div>

        {/* Word Container */}
        <div
          onClick={!gameStart ? startGame : undefined}
          className="word-container"
        >
          {randomWord === "" || time === 0 || time === null ? (
            <h1> Click here to start the game! </h1>
          ) : (
            <h1> {randomWord} </h1>
          )}
        </div>

        {gameStart && (
          <>
            {/* Input */}
            <div className="word-input-container">
              <input
                autoComplete="off"
                value={answer}
                name="answer"
                onChange={handleOnChange}
                placeholder="Type Here"
                className="word-input"
                type="text"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Game;
