import React, { useState } from 'react';
import '../../styles/AdminActivityTable.css'; // Ensure the CSS file path is correct

const AdminActivityTable = ({ activities = [], loading, error }) => {
  const [filter, setFilter] = useState('');

  // Filter activities by username prefix
  const filteredActivities = activities.filter((activity) =>
    activity.username.toLowerCase().startsWith(filter.toLowerCase())
  );

  if (loading) {
    return <p className="loading-message">Loading user activities...</p>;
  }

  if (error) {
    return <p className="error-message">Error loading activities: {error}</p>;
  }

  return (
    <div className="admin-activity-container">
      <h2>User Activity</h2>

      {/* Filter Input */}
      <input
        type="text"
        placeholder="Filter by username"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="filter-input"
        aria-label="Filter activities by username"
      />

      {/* Activity Table */}
      {filteredActivities.length > 0 ? (
        <table className="activity-table">
          <thead>
            <tr>
              <th>Datetime</th>
              <th>Username</th>
              <th>Activity Type</th>
            </tr>
          </thead>
          <tbody>
            {filteredActivities.map((activity, index) => (
              <tr key={index}>
                <td>{new Date(activity.datetime).toLocaleString()}</td>
                <td>{activity.username}</td>
                <td>{activity.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-activities-message">
          {filter
            ? `No activities found for usernames starting with "${filter}".`
            : 'No user activities available.'}
        </p>
      )}
    </div>
  );
};

export default AdminActivityTable;
