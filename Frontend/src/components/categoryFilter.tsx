import React from 'react';

interface CategoryDropdownProps {
  categories: string[]; // Array of unique categories
}

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({ categories }) => { // Change data to categories
  return (
    <div className="mb-4">
      <select
        id="category-select"
        className="border border-gray-300 rounded p-2"
      >
        <option value="">--Choose a category--</option>
        {categories.map((category, index) => (
          <option key={index} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategoryDropdown;
