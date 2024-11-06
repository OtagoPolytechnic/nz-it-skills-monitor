import React from 'react';

interface CategoryDropdownProps {
  categories: { name: string; count: number }[]; // Array of category objects with name and count
  setSelectedCategory: (category: string) => void; // Function to set the selected category
}

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({ categories, setSelectedCategory }) => {
  return (
    <div className="mb-4">
      <select
        id="category-select"
        className="border border-gray-300 rounded p-2"
        onChange={(e) => setSelectedCategory(e.target.value)} // Call the function on change
      >
        {categories.map((category, index) => (
          <option key={index} value={category.name}>
            {category.name} ({category.count}) {/* Display name and count */}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategoryDropdown;
