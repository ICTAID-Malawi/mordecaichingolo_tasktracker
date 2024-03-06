import React, { useState, useEffect } from 'react';

const Activities = ({ taskId }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch(`http://localhost:8000/activities/${taskId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch activities');
        }
        const data = await response.json();
        setActivities(data);
      } catch (error) {
        setError(error.message); // Set the error message state
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [taskId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>; // Render the error message
  }

  return (
    <div>
      <h3>Activities</h3>
      <ul>
        {activities.map(activity => (
          <li key={activity.id}>{activity.description}</li>
        ))}
      </ul>
    </div>
  );
};

export default Activities;
