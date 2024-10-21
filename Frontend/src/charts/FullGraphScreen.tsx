// FullGraphScreen.tsx
import React from 'react';
import BarChartHorizontal from './BarChartHorizontal';
import { useLocation } from 'react-router-dom';

// Assuming data is passed via state
const FullGraphScreen = () => {
  const location = useLocation();
  const { data, dataKeyIndex, selectedCategory, title } = location.state;

  return (
    <div style={{ padding: '20px' }}>
      <BarChartHorizontal
        dataKeyIndex={dataKeyIndex}
        title={title}
        data={data}
        selectedCategory={selectedCategory}
      />
    </div>
  );
};

export default FullGraphScreen;
