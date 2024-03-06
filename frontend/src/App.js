import React, { useEffect, useState } from 'react';
import ListHeader from './components/ListHeader';
import ListItems from './components/ListItems';
import Auth from './components/Auth';
import { useCookies } from 'react-cookie';
import NavBar from './components/NavBar';

const App = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['Email', 'AuthToken']);
  const [tasks, setTasks] = useState(null);
  const userEmail = cookies.Email;
  const authToken = cookies.AuthToken;

  const getData = async (email) => {
    try {
      const response = await fetch(`http://localhost:8000/tasks/${email}`);
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const json = await response.json();
      setTasks(Array.isArray(json) ? json : []);
    } catch (err) {
      console.error(err);
      setTasks([]); // Clear tasks in case of error
    }
  };

  useEffect(() => {
    if (authToken) {
      getData(userEmail);
    }
  }, [authToken, userEmail]);

  const handleSignOut = () => {
    // Remove cookies and clear tasks data
    removeCookie('Email');
    removeCookie('AuthToken');
    setTasks(null);
  };

  const sortedTasks = tasks?.sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className='container'>
      <NavBar initials="AB" onSignOut={handleSignOut} />
      <div className='app'>
        {!authToken && <Auth />}
        {authToken && (
          <>
            <ListHeader ListName={'Task Tracker'} getData={() => getData(userEmail)} />
            {sortedTasks?.map((task, index) => (
              <ListItems key={index} task={task} getData={() => getData(userEmail)} />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default App;
