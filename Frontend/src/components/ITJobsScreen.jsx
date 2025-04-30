// src/components/ITJobsScreen.jsx
import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar';
import axios from 'axios';


const ITJobsScreen = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/jobs')
      .then((response) => {
        setJobs(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to fetch jobs');
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <Navbar />
      <div className="stacked-dashboard">
        <h2 className="dashboard-title">Latest IT Job Listings</h2>

        {loading && <p>Loading jobs...</p>}
        {error && <p className="error-text">{error}</p>}

        {jobs.length === 0 && !loading && (
          <p>No jobs available.</p>
        )}
        {jobs.map((job) => (
          <div key={job.id} className="dashboard-card">
            <h3 className="card-title">{job.title}</h3>
            <p className="card-subtitle">{job.company} — {job.location || 'Location not specified'}</p>
            <p className="card-meta">Category: {job.category} | Type: {job.type} | Duration: {job.duration}</p>
            <p className="card-meta">Salary: {job.salary > 0 ? `$${job.salary}` : 'Not listed'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ITJobsScreen;