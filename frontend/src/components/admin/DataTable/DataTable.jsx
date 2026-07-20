import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Download, Printer } from 'lucide-react';
import './DataTable.css';

export default function DataTable({
  columns = [],
  data = [],
  searchPlaceholder = 'Search records...',
  searchKey,
  onRowClick,
  actions,
  filterComponent,
  bulkActions,
  selectedRows = [],
  onSelectAll,
  onSelectRow,
  showSelectCol = false,
  itemsPerPage = 5,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Handle Search
  const filteredData = data.filter((item) => {
    if (!searchTerm) return true;
    if (searchKey) {
      const val = item[searchKey];
      return String(val).toLowerCase().includes(searchTerm.toLowerCase());
    }
    // Search across all string fields if no searchKey specified
    return Object.values(item).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Handle Sort
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];

    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Handle Pagination
  const totalItems = sortedData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedData = sortedData.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="custom-datatable-wrapper">
      {/* Top Controls Bar */}
      <div className="datatable-controls">
        <div className="datatable-left-controls">
          {searchKey !== null && (
            <div className="datatable-search-wrapper">
              <Search className="datatable-search-icon" size={18} />
              <input
                type="text"
                className="datatable-search-input"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          )}
          {filterComponent && <div className="datatable-filters">{filterComponent}</div>}
        </div>
        <div className="datatable-right-controls">
          {actions && <div className="datatable-actions">{actions}</div>}
        </div>
      </div>

      {/* Main Table Container */}
      <div className="datatable-container">
        <table className="custom-table">
          <thead>
            <tr>
              {showSelectCol && (
                <th className="table-header-cell select-col">
                  <input
                    type="checkbox"
                    className="datatable-checkbox"
                    checked={data.length > 0 && selectedRows.length === data.length}
                    onChange={onSelectAll}
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`table-header-cell ${col.sortable ? 'sortable' : ''}`}
                  onClick={() => col.sortable && handleSort(col.key)}
                  style={{ width: col.width }}
                >
                  <div className="header-cell-content">
                    {col.label}
                    {col.sortable && sortConfig.key === col.key && (
                      <span className="sort-indicator">
                        {sortConfig.direction === 'asc' ? ' ▴' : ' ▾'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (showSelectCol ? 1 : 0)} className="table-empty-state">
                  No records found matching your criteria.
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rIdx) => {
                const isSelected = selectedRows.includes(row.id || rIdx);
                return (
                  <tr
                    key={row.id || rIdx}
                    className={`table-body-row ${isSelected ? 'row-selected' : ''}`}
                    onClick={() => onRowClick && onRowClick(row)}
                  >
                    {showSelectCol && (
                      <td className="table-body-cell select-col" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          className="datatable-checkbox"
                          checked={isSelected}
                          onChange={() => onSelectRow(row.id || rIdx)}
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td key={col.key} className="table-body-cell" style={{ textAlign: col.align }}>
                        {col.render ? col.render(row) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Pagination Bar */}
      <div className="datatable-pagination-footer">
        <div className="pagination-info">
          Showing {totalItems === 0 ? 0 : startIndex + 1} to {endIndex} of {totalItems} entries
        </div>
        <div className="pagination-buttons">
          <button
            className="pagination-btn"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            <ChevronLeft size={16} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={`pagination-btn page-num-btn ${currentPage === p ? 'active' : ''}`}
              onClick={() => handlePageChange(p)}
            >
              {p}
            </button>
          ))}
          <button
            className="pagination-btn"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
