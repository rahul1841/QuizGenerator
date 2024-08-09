
import React, { useState } from 'react';

const Quiz = ({ questions }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelection = (selectedOption) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [currentQuestion.id]: selectedOption,
    }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((question) => {
      if (userAnswers[question.id] === question.correctAnswer) {
        score += 1;
      }
    });
    return score;
  };

  return (
    <div className="flex flex-col items-start w-full max-w-2xl">
      {quizCompleted ? (
        <div className="text-left">
          <h2 className="text-3xl mb-4">Quiz Completed</h2>
          <p>Your Score: {calculateScore()} / {questions.length}</p>
        </div>
      ) : (
        <div className="text-left w-full">
          <h2 className="text-3xl font-bold mb-6">Quiz</h2>
          <p className="text-xl mb-6">Question {currentQuestionIndex + 1} of {questions.length}</p>
          <p className="text-xl font-medium mb-6">{currentQuestion.question}</p>
          <ul className="mb-6">
            {currentQuestion.options.map((option, index) => (
              <li key={index} className="mb-4">
                <input
                  type="radio"
                  id={`${option}_${index}`}
                  name="answer"
                  value={option}
                  onChange={() => handleAnswerSelection(option)}
                  checked={userAnswers[currentQuestion.id] === option}
                  className="mr-2"
                />
                <label htmlFor={`${option}_${index}`} className="text-lg">{index + 1}. {option}</label>
              </li>
            ))}
          </ul>
          <div className="flex justify-between">
            {currentQuestionIndex + 1 < questions.length && (
              <button 
                className="bg-violet-400 rounded-md p-2 font-medium hover:bg-violet-700"
                onClick={nextQuestion}
              >
                Next Question
              </button>
            )}
            {currentQuestionIndex + 1 === questions.length && (
              <button 
                className="bg-green-600 rounded-md p-2 font-medium hover:bg-green-700"
                onClick={() => setQuizCompleted(true)}
              >
                Finish Quiz
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;
