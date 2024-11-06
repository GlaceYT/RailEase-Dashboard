import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ClipLoader } from 'react-spinners'; // for loading spinner
import dayjs from 'dayjs'; // for date formatting
import './complaintDashboard.css'; // For custom styles
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io'; // Icons for sorting
import {  FaSearch } from 'react-icons/fa'; // Filter and Search icons// Close icon for modals

// Complaint interface
interface Complaint {
  reference_id: string;
  name: string;
  pnr: string;
  complaint: string;
  location: string;
  complaint_type: string;
  urgency: string;
  timestamp: string;
  status: string;
}

const DashboardPage: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>(''); // Search query state
  const [sortConfig, setSortConfig] = useState<{ key: keyof Complaint; direction: 'asc' | 'desc' } | null>(null); // Sorting config
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false); // Dropdown visibility
  const [dropdownPosition, setDropdownPosition] = useState<{ x: number; y: number } | null>(null); // Dropdown position
  const [selectedSortKey, setSelectedSortKey] = useState<keyof Complaint | null>(null); // Track sorting column
  const [selectedTypeFilters, setSelectedTypeFilters] = useState<string[]>([]); // Complaint type filters
  const [selectedUrgencyFilters, setSelectedUrgencyFilters] = useState<string[]>([]); // Urgency filters
  const dropdownRef = useRef<HTMLDivElement | null>(null); // Ref for dropdown
  const navigate = useNavigate();

  // Open dropdown and set the selected column for sorting
  const openSortDropdown = (key: keyof Complaint, event: React.MouseEvent) => {
    setSelectedSortKey(key);
    setDropdownPosition({ x: event.clientX, y: event.clientY });
    setDropdownVisible(true);
  };

  // Handle sorting by ascending or descending
  const handleSort = (direction: 'asc' | 'desc') => {
    if (selectedSortKey) {
      setSortConfig({ key: selectedSortKey, direction });
    }
    setDropdownVisible(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  // Fetch complaints on component mount
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get<Complaint[]>('http://meta.pylex.xyz:10927/api/complaints');
        setComplaints(response.data);
      } catch (error) {
        console.error('Error fetching complaints:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  // Filter complaints based on search query and selected filters
  const filteredComplaints = complaints
    .filter(
      (complaint) =>
        complaint.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        complaint.complaint.toLowerCase().includes(searchQuery.toLowerCase()) ||
        complaint.reference_id.includes(searchQuery) ||
        complaint.location.toLowerCase().includes(searchQuery.toLowerCase()) || 
        dayjs(complaint.timestamp).format('MMM D, YYYY h:mm A').toLowerCase().includes(searchQuery.toLowerCase()) || 
        complaint.status.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(
      (complaint) =>
        (selectedTypeFilters.length === 0 || selectedTypeFilters.includes(complaint.complaint_type)) &&
        (selectedUrgencyFilters.length === 0 || selectedUrgencyFilters.includes(complaint.urgency))
    );

  // Get unique complaint types and urgencies for filtering
  const uniqueTypes = Array.from(new Set(complaints.map((complaint) => complaint.complaint_type)));
  const uniqueUrgencies = Array.from(new Set(complaints.map((complaint) => complaint.urgency)));

  // Toggle complaint type filter
  const toggleTypeFilter = (type: string) => {
    setSelectedTypeFilters((prevFilters) =>
      prevFilters.includes(type) ? prevFilters.filter((t) => t !== type) : [...prevFilters, type]
    );
  };

  // Toggle urgency filter
  const toggleUrgencyFilter = (urgency: string) => {
    setSelectedUrgencyFilters((prevFilters) =>
      prevFilters.includes(urgency) ? prevFilters.filter((u) => u !== urgency) : [...prevFilters, urgency]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-blue-800 mb-6">Complaints Dashboard</h1>

        {/* Search bar */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search by name, complaint, reference ID, location, status, date..."
            className="p-2 pr-10 border border-gray-300 rounded-lg w-full shadow-sm focus:ring focus:border-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FaSearch className="absolute top-2.5 right-3 text-gray-500" />
        </div>

        {/* Filter Section */}
        <div className="flex flex-wrap gap-2 mb-6">
          {/* Complaint Type Filters */}
          {uniqueTypes.map((type) => (
            <button
              key={type}
              onClick={() => toggleTypeFilter(type)}
              className={`chip ${selectedTypeFilters.includes(type) ? 'chip-selected' : ''}`}
            >
              {type}
            </button>
          ))}
          {/* Urgency Filters */}
          {uniqueUrgencies.map((urgency) => (
            <button
              key={urgency}
              onClick={() => toggleUrgencyFilter(urgency)}
              className={`chip ${selectedUrgencyFilters.includes(urgency) ? 'chip-selected' : ''}`}
            >
              {urgency}
            </button>
          ))}
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="text-center">
            <ClipLoader color="#4A90E2" size={50} />
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-blue-600 text-white">
                  {[
                    { label: 'Reference ID', key: 'reference_id' },
                    { label: 'Name', key: 'name' },
                    { label: 'PNR', key: 'pnr' },
                    { label: 'Complaint', key: 'complaint' },
                    { label: 'Location', key: 'location' },
                    { label: 'Type', key: 'complaint_type' },
                    { label: 'Urgency', key: 'urgency' },
                    { label: 'Timestamp', key: 'timestamp' },
                    { label: 'Status', key: 'status' }
                  ].map((header) => (
                    <th
                      key={header.key}
                      className="px-4 py-2 cursor-pointer"
                      onClick={(event) => openSortDropdown(header.key as keyof Complaint, event)}
                    >
                      <div className="flex items-center justify-between">
                        {header.label}
                        {sortConfig?.key === header.key && (
                          <span>{sortConfig.direction === 'asc' ? <IoIosArrowUp /> : <IoIosArrowDown />}</span>
                        )}
                      </div>
                    </th>
                  ))}
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.map((complaint) => (
                  <tr key={complaint.reference_id} className="hover:bg-gray-100">
                    <td className="px-4 py-2">{complaint.reference_id}</td>
                    <td className="px-4 py-2">{complaint.name}</td>
                    <td className="px-4 py-2">{complaint.pnr}</td>
                    <td className="px-4 py-2">{complaint.complaint}</td>
                    <td className="px-4 py-2">{complaint.location}</td>
                    <td className="px-4 py-2">{complaint.complaint_type}</td>
                    <td className="px-4 py-2">{complaint.urgency}</td>
                    <td className="px-4 py-2">{dayjs(complaint.timestamp).format('MMM D, YYYY h:mm A')}</td>
                    <td className="px-4 py-2">{complaint.status}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => navigate('/complaint-details', { state: { complaint } })}
                        className="bg-blue-500 text-white px-4 py-1 rounded-lg transition hover:bg-blue-600"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Sort Dropdown */}
        {dropdownVisible && dropdownPosition && (
          <div
            ref={dropdownRef}
            style={{
              position: 'absolute',
              top: `${dropdownPosition.y}px`,
              left: `${dropdownPosition.x}px`,
              background: 'white',
              border: '1px solid #ccc',
              borderRadius: '8px',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
              zIndex: 1000
            }}
            className="p-2 w-40"
          >
            <button
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              onClick={() => handleSort('asc')}
            >
              Sort by Ascending
            </button>
            <button
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              onClick={() => handleSort('desc')}
            >
              Sort by Descending
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
