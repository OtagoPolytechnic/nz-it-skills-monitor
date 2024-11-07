import React from 'react';

interface CategoryDropdownProps {
  categories: { name: string; count: number }[]; // Array of category objects with name and count
  selectedCategory: string; // Current selected category
  setSelectedCategory: (category: string) => void; // Function to set the selected category
}

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({ categories, selectedCategory, setSelectedCategory }) => {
  // Sort categories by name alphabetically
  const sortedCategories = [...categories].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="mb-4">
      <select
        id="category-select"
        className="border border-gray-300 rounded p-2"
        value={selectedCategory} // Set value to selectedCategory
        onChange={(e) => setSelectedCategory(e.target.value)} // Call the function on change
      >
        {sortedCategories.map((category, index) => (
          <option key={index} value={category.name}>
            {category.name} ({category.count}) {/* Display name and count */}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategoryDropdown;
