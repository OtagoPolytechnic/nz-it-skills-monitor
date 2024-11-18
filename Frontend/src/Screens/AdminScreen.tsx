import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Admin: React.FC = () => {
  const [output, setOutput] = useState<string>('');
  const navigate = useNavigate();
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        await axios.get('/admin', {
          headers: {
            Authorization: `${token}`,
          },
        });
      } catch (error) {
        console.error('Error fetching admin data:', error);
        setErrorMessage(error.response?.data?.error);
      }
    };
    fetchData();

    const socketUrl = `https://nz-it-skills-monitor.onrender.com/scrape-status`;
    const socket = new WebSocket(socketUrl);
    setWs(socket);

    socket.onopen = () => {
      console.log('WebSocket connection established to', socketUrl);
    };

    socket.onmessage = (event) => {
      setOutput((prevOutput) => prevOutput + event.data + '\n');
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      socket.close();
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    if (ws) {
      ws.close();
    }
    navigate('/'); // Redirect to the home page after token has been removed
  };

  const startScraper = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`https://nz-it-skills-monitor.onrender.com/run-spiders`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      console.log(response.data);  
      setStatusMessage("");    
    } catch (error) {
      console.error('Error starting spiders:', error);
      setErrorMessage(error.response?.data?.error);
    }
  };

  const stopScraper = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`$https://nz-it-skills-monitor.onrender.com/stop-spiders`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      console.log(response.data);
      setStatusMessage(response.data.message);

    } catch (error) {
      console.error('Error stopping spiders:', error);
      setErrorMessage(error.response?.data?.error);
    }
  };

  return (
    <>
      <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <button data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15" />
            </svg>
          </button>
          <div className="hidden w-full md:block md:w-auto" id="navbar-default">
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <a href="/" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Home</a>
              </li>
              <li>
                <a href="/admin" className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500" aria-current="page">Admin</a>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="block py-2 px-3 text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
        <button onClick={startScraper}>Run Spiders</button>
        <button onClick={stopScraper}>Stop Spiders</button>
      </nav>
      <pre>{output}</pre>
      <p>{errorMessage}</p>
      <p>{statusMessage}</p>
    </>
  );
};

export default Admin;
