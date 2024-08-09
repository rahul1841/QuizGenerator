
import React, { useState } from 'react';
import axios from 'axios';
import Quiz from './components/Quiz';

const App = () => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [numQuestions, setNumQuestions] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [generatingAnswer, setGeneratingAnswer] = useState(false);

  const generateAnswer = async (e) => {
    e.preventDefault();
    setGeneratingAnswer(true);
  
    const prompt = `Generate ${numQuestions} ${difficulty} level multiple-choice questions on ${topic}. 
    Always generate questions like in which there should be plain text only not even backticks, special symbols, or quotes, just only simple plain text and question and options size(not more than 3 words) should be of small size.
    Format the output strictly as JSON with the following structure and double check please:
    {
        "questions": [
            "Question text 1",
            "Question text 2",
            ...
        ],
        "options": [
            ["Option A1", "Option B1", "Option C1", "Option D1"],
            ["Option A2", "Option B2", "Option C2", "Option D2"],
            ...
        ],
        "answers": [
            "Correct answer 1",
            "Correct answer 2",
            ...
        ]
    }`;
  
    try {
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${
          import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT
        }`,
        method: 'post',
        data: {
          contents: [{ parts: [{ text: prompt }] }],
        },
      });
  
      let content = response.data.candidates[0].content.parts[0].text;
      console.log('Raw content:', content);
  
      let contentData;
      try {
        contentData = JSON.parse(content);
      } catch (parseError) {
        console.error('Failed to parse JSON:', parseError);
        alert('Failed to parse the response. Please check the console for details.');
        return;
      }
  
      const formattedQuestions = contentData.questions.map((questionText, index) => {
        return {
          id: index + 1,
          question: questionText.trim(),
          options: contentData.options[index],
          correctAnswer: contentData.answers[index].trim(),
        };
      });
  
      console.log('Formatted Questions:', formattedQuestions);
      setQuestions(formattedQuestions);
    } catch (error) {
      console.error('Error:', error);
      alert('There was an error generating the quiz. Please try again.');
    }
  
    setGeneratingAnswer(false);
  };

  const resetFields = () => {
    setTopic('');
    setDifficulty('');
    setNumQuestions(0);
    setQuestions([]);
  };

  return (
    <div className={`flex ${questions.length > 0 ? 'flex-row' : 'flex-col'} w-screen h-screen`}>
      <div className={`${questions.length > 0 ? 'w-1/2' : 'w-full h-full'} flex justify-center items-center bg-blue-400 p-6 rounded-lg`}>
        <div className="flex flex-col items-center">
          <h1 className="text-5xl font-bold mb-20 pb-20">Dynamic Quiz Generator</h1>
          <div className="mb-4">
            <label htmlFor="topic" className="text-xl font-medium">Choose Topic:</label>
            <select 
              name="topic" 
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="ml-2 p-2 rounded"
            >
              <option value="">Select Your Topic</option>
              <option value="Operating System">Operating System</option>
              <option value="DBMS">DBMS</option>
              <option value="Programming">Programming</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="difficultyLevel" className="text-xl font-medium">Choose Difficulty Level:</label>
            <select 
              name="difficultyLevel" 
              id="difficultyLevel"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="ml-2 p-2 rounded"
            >
              <option value="">Select Difficulty</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="numQuestions" className="text-xl font-medium">Enter Number of Questions:</label>
            <input
              type="number"
              id="numQuestions"
              value={numQuestions}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (value >= 1 && value <= 30) {
                  setNumQuestions(value);
                } else if (value < 1) {
                  setNumQuestions(30);
                } else if (value > 30) {
                  setNumQuestions(0);
                }
              }}
              className="ml-2 p-2 rounded"
              min="1"
              max="30"
            />
          </div>

          <div className="flex mt-14 space-x-4">
            <button 
              className={`bg-blue-600 text-white p-3 rounded-md text-xl font-medium hover:bg-blue-700 ${generatingAnswer ? 'opacity-50 cursor-not-allowed' : ''}`} 
              onClick={generateAnswer}
              disabled={generatingAnswer}
            >
              {generatingAnswer ? 'Generating...' : 'Generate Quiz'}
            </button>
            <button 
              className="bg-blue-600 text-white pl-11 pr-11 rounded-md text-xl font-medium hover:bg-blue-700"
              onClick={resetFields}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
      {questions.length > 0 && (
        <div className="w-1/2 h-full bg-yellow-300 p-12 flex items-center justify-center rounded-md">
          <div className="w-full h-full flex items-center justify-center">
            <Quiz questions={questions} />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
