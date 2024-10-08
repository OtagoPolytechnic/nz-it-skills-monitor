import React from 'react';

interface CategoryDropdownProps {
  categories: string[]; // Array of unique categories
  setSelectedCategory: (category: string) => void; // Function to set the selected category
}

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({ categories, setSelectedCategory }) => {
  return (
    <div className="mb-4">
      <label htmlFor="category-select" className="block mb-2 text-sm font-medium text-gray-700">
        Select Category
      </label>
      <select
        id="category-select"
        className="border border-gray-300 rounded p-2"
        onChange={(e) => setSelectedCategory(e.target.value)} // Call the function on change
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
