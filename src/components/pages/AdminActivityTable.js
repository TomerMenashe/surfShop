//** React component for displaying and filtering user activity logs **//

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/AdminActivityTable.css';

const AdminActivityTable = () => {
  //** Local state for activities list, filter text, loading state, and error messages **//
  const [activities, setActivities] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //** Fetch activities on component mount **//
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        //** Make GET request to retrieve all user activities **//
        const response = await axios.get('/api/activity/export-activities');

        //** Convert data from { username: [...] } format to an array of activity objects **//
        const activityData = Object.entries(response.data).flatMap(([username, userActivities]) =>
          userActivities.map((activity) => ({
            ...activity,
            username,
          }))
        );

        //** Sort activities by most recent timestamp first **//
        activityData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        setActivities(activityData);
      } catch (error) {
        console.error('Error fetching activities:', error);
        setError('Failed to fetch activities. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  //** Filter activities by username prefix **//
  const filteredActivities = activities.filter((activity) =>
    activity.username.toLowerCase().startsWith(filter.toLowerCase())
  );

  //** If no filter, display the first 20 activities, otherwise display filtered list **//
  const displayedActivities =
    filter === '' ? activities.slice(0, 20) : filteredActivities;

  //** Helper to format the timestamp nicely **//
  const formatDate = (isoDate) => new Date(isoDate).toLocaleString();

  //** If loading, show loading message **//
  if (loading) {
    return <p className="loading-message">Loading activities...</p>;
  }

  //** If an error occurred, show error message **//
  if (error) {
    return <p className="error-message">{error}</p>;
  }

  //** If there are no activities to display, show a friendly message **//
  if (displayedActivities.length === 0) {
    return <p className="no-activities-message">No activities found.</p>;
  }

  //** Render the table with user activities **//
  return (
    <div className="admin-activity-container">
      <h2>User Activity Log</h2>
      <input
        type="text"
        placeholder="Filter by username"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="filter-input"
      />
      <table className="activity-table">
        <thead>
          <tr>
            <th>Datetime</th>
            <th>Username</th>
            <th>Activity</th>
          </tr>
        </thead>
        <tbody>
          {displayedActivities.map((activity, index) => (
            <tr key={index}>
              <td>{formatDate(activity.timestamp)}</td>
              <td>{activity.username}</td>
              <td>{activity.action}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminActivityTable;
