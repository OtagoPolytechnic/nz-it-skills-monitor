import React from 'react';
import BarChartHorizontal from './BarChartHorizontal';
import { useLocation } from 'react-router-dom';
import filterData from "../utils/filterSkills";

const FullGraphScreen = () => {
  const location = useLocation();
  const { data, dataKeyIndex, selectedCategory, title } = location.state;
  console.log("DATA: ", data);  
  console.log("title: ", title);  
  // Filter data based on title
  const filteredData = data.filter(item => item.skills.filter(a => a.type === title));
  
  let filter = filterData(data, selectedCategory);
  // filter filted data to only show the selected title
  filter = filter[title];
  
  console.log("FILTERED DATA: ", filteredData);
  console.log("FILTER: ", filter);

  return (
    <div style={{ padding: '20px', height: '1200px', overflowY: 'scroll' }}>
      <BarChartHorizontal
        dataKeyIndex={dataKeyIndex}
        title={title}
        data={filteredData}
        selectedCategory={selectedCategory}
        height={filteredData.length * 24} // Adjust line height as needed
      />
    </div>
  );
};

export default FullGraphScreen;
