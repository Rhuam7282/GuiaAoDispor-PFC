import React from 'react';
import './filtro.css';

const Filtro = ({ 
  title = 'Filtros:', 
  options = [], 
  selectedOption, 
  onChange,
  className = '' 
}) => {
  return (
    <div className={`filter-bar ${className}`}>
      <h3 className="filter-title">{title}</h3>
      
      <div className="filter-options">
        {options.map((option) => (
          <label key={option.value} className="filter-option">
            <input 
              type="radio" 
              name="filter" 
              value={option.value} 
              checked={selectedOption === option.value}
              onChange={() => onChange(option.value)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default Filtro;