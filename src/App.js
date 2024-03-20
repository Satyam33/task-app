import React, { useState, useEffect } from "react";
import data from "./data.json";
import "./styles.css"; // Import CSS file for styling

const DynamicTable = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState(data);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState({});

  // Extract unique column names
  const header = Array.from(new Set(data.flatMap((item) => Object.keys(item))));

  useEffect(() => {
    // Apply checkbox filters when data or selectedCheckboxes change
    const applyCheckboxFilters = () => {
      let filteredData = [...data];
      for (const column in selectedCheckboxes) {
        const selectedValues = selectedCheckboxes[column];
        if (selectedValues.length > 0) {
          filteredData = filteredData.filter((item) =>
            selectedValues.includes(item[column])
          );
        }
      }
      setFilteredData(filteredData);
    };

    applyCheckboxFilters();
  }, [selectedCheckboxes, data]);

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const searchData = filteredData.filter((item) =>
      item[header[1]].toLowerCase().includes(query)
    );
    setFilteredData(searchData);
  };

  const handleCheckBox = (column, value) => {
    const newSelectedCheckboxes = { ...selectedCheckboxes };
    if (!newSelectedCheckboxes[column]) {
      newSelectedCheckboxes[column] = [];
    }
    const index = newSelectedCheckboxes[column].indexOf(value);
    if (index === -1) {
      newSelectedCheckboxes[column].push(value);
    } else {
      newSelectedCheckboxes[column].splice(index, 1);
    }
    setSelectedCheckboxes(newSelectedCheckboxes);
  };

  const getUniqueValues = (columnName) => {
    const uniqueValues = [...new Set(data.map((item) => item[columnName]))];
    return uniqueValues;
  };

  const renderUniqueValues = () => {
    let columnName = header[1];
    const excludedColumns = ["id", columnName];
    return header.map((column, index) => {
      if (!excludedColumns.includes(column)) {
        return (
          <div key={index}>
            <h2>{column.toUpperCase()}</h2>
            <ul>
              {getUniqueValues(column).map(
                (value, idx) =>
                  value && (
                    <li key={idx}>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={
                            selectedCheckboxes[column] &&
                            selectedCheckboxes[column].includes(value)
                          }
                          onChange={() => handleCheckBox(column, value)}
                        />
                        <span className="slider round"></span>
                      </label>
                      {value}
                    </li>
                  )
              )}
            </ul>
          </div>
        );
      } else {
        return null;
      }
    });
  };

  return (
    <div className="table-container">
      <div className="unique-values-section">{renderUniqueValues()}</div>
      <div>
        <div>{header[1].toUpperCase()}</div>
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <h1>Dynamic Table</h1>
      <table className="data-table">
        <thead>
          <tr>
            {header.map((key, index) => (
              <th key={index}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={index}>
              {header.map((key, index) => (
                <td key={index}>{item[key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const App = () => {
  return (
    <div>
      <DynamicTable />
    </div>
  );
};

export default App;
