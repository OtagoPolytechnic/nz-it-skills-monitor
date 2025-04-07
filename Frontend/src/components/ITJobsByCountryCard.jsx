import React from 'react';

const cityData = [
  { city: 'Auckland', percentage: 32 },
  { city: 'Wellington', percentage: 21 },
  { city: 'Christchurch', percentage: 15 },
  { city: 'Queenstown', percentage: 8 },
  { city: 'Rotorua', percentage: 7 },
  { city: 'Dunedin', percentage: 5 },
  { city: 'Tauranga', percentage: 4 },
  { city: 'Napier', percentage: 3 },
  { city: 'Hamilton', percentage: 3 },
  { city: 'Nelson', percentage: 2 }
];

const ITJobsByCountryCard = () => {

  const isLoading = false; // Placeholder for future backend integration
  const error = null;

  if (isLoading) return <div>Loading city job data...</div>;
  if (error) return <div>Error loading city data.</div>;
  if (!cityData?.length) return <div>No city job data available.</div>;



  return (
    <div className="card">
      <h3>IT Jobs by Country</h3>
      <ul className="city-list">
        {cityData.map((city, idx) => (
          <li key={idx} className="city-item">
            <span>{city.city}</span>
            <span>{city.percentage}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ITJobsByCountryCard;