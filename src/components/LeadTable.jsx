import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { Search } from "lucide-react"; // Import the search icon

const API_URL = import.meta.env.VITE_API_URL;

const LeadTable = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [filters, setFilters] = useState({
    name: "",
    destination: "",
    departureCity: "",
    budget: "",
    needOfFlight: "",
    leadSource: "",
    assignee: "",
    leadStatus: "",
    verificationStatus: "",
    contact: "",
    uploadDate: "",
    dateofCreation: ""
  });
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending"
  });
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [file, setFile] = useState(null);

  const navigate = useNavigate();

  // Format date to DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "N/A";
      return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      }).format(date);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "N/A";
    }
  };

  // Debounce function for search
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // Advanced search function
  const performAdvancedSearch = async (query) => {
    if (!query.trim()) {
      fetchLeads(); // Reset to all leads if search is empty
      return;
    }
    setIsSearching(true);
    try {
      const response = await fetch(
        `${API_URL}/api/leads/search/advanced?q=${encodeURIComponent(query)}`
      );
      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`);
      }
      const data = await response.json();
      setLeads(data);
      setFilteredLeads(data);
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to perform search");
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search handler
  const debouncedSearch = debounce(performAdvancedSearch, 300);

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  // Export functionality
  const handleExport = () => {
    const dataToExport = filteredLeads.map((lead) => ({
      "Lead ID": lead._id,
      Name: lead.name,
      "Date of Travel": lead.dateOfTravel || "N/A",
      Destination: lead.destination || "N/A",
      "Departure City": lead.departureCity || "N/A",
      Budget: lead.budget || "N/A",
      "Need of Flight": lead.needOfFlight || "N/A",
      "Lead Source": lead.leadSource || "N/A",
      Assignee: lead.assignee || "N/A",
      "Lead Status": lead.leadStatus || "N/A",
      "Verification Status": lead.verificationStatus || "N/A",
      "Date of Creation": lead.dateofCreation
        ? new Date(lead.dateofCreation).toLocaleDateString("en-GB")
        : "N/A",
      "Date of Upload": lead.timestamp
        ? new Date(lead.timestamp).toLocaleDateString("en-GB")
        : "N/A"
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");
    XLSX.writeFile(
      workbook,
      `leads_export_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  // Fetch leads from API
  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/leads`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      const leadsData = Array.isArray(data)
        ? data
        : data.leads || data.data || [];
      if (!Array.isArray(leadsData)) {
        console.error("Invalid data format:", leadsData);
        setError("Invalid data format");
        return;
      }
      setLeads(leadsData);
      setFilteredLeads(leadsData);
    } catch (error) {
      console.error("Detailed Fetch Error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Sorting function for leads
  const sortLeads = (leadsToSort) => {
    if (!sortConfig.key) return leadsToSort;
    return [...leadsToSort].sort((a, b) => {
      let valueA = a[sortConfig.key];
      let valueB = b[sortConfig.key];
      if (sortConfig.key === "timestamp" || sortConfig.key === "dateofCreation") {
        valueA = valueA ? new Date(valueA).getTime() : -Infinity;
        valueB = valueB ? new Date(valueB).getTime() : -Infinity;
      } else if (sortConfig.key === "budget") {
        valueA = parseFloat(valueA) || -Infinity;
        valueB = parseFloat(valueB) || -Infinity;
      } else {
        valueA = (valueA || "").toString().toLowerCase();
        valueB = (valueB || "").toString().toLowerCase();
      }
      if (valueA < valueB) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  };

  // Filtering & sorting effect
  useEffect(() => {
    const filtered = leads.filter((lead) => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        // Special handling for budget
        if (key === "budget") {
          return lead[key]?.toString().includes(value);
        }
        // Handling date filters (uploadDate & dateofCreation)
        if (key === "uploadDate" || key === "dateofCreation") {
          const leadDate = new Date(lead.timestamp).toISOString().split("T")[0];
          return leadDate === value;
        }
        // Handling verificationStatus case-insensitive
        if (key === "verificationStatus") {
          return lead[key]?.toLowerCase() === value.toLowerCase();
        }
        // Special handling for contact numbers
        if (key === "contact") {
          const cleanValue = value.replace(/[\s+\-()]/g, "");
          const cleanLeadContact = lead[key]?.replace(/[\s+\-()]/g, "");
          return cleanLeadContact?.includes(cleanValue);
        }
        return lead[key]?.toLowerCase().includes(value.toLowerCase());
      });
    });
    const sortedLeads = sortLeads(filtered);
    setFilteredLeads(sortedLeads);
  }, [filters, leads, sortConfig]);

  // Sorting request handler
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Modified handleViewLead: passes absolute index calculated from pagination
  const handleViewLead = (leadId, index) => {
    window.open(`/lead-details/${leadId}?sequenceId=${index}`, "_blank");
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }
    const uploadData = new FormData();
    uploadData.append("file", file);
    try {
      const response = await fetch(`${API_URL}/api/leads/upload`, {
        method: "POST",
        body: uploadData
      });
      if (response.ok) {
        const result = await response.json();
        alert("Leads uploaded successfully!");
        fetchLeads();
      } else {
        console.error("Failed to upload leads:", response.statusText);
        alert("Failed to upload leads. Please try again.");
      }
    } catch (err) {
      console.error("Error uploading file:", err);
      alert("An error occurred while uploading the file.");
    }
  };

  const totalPages = Math.ceil(filteredLeads.length / entriesPerPage);
  const displayedLeads = filteredLeads.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleEntriesChange = (e) => {
    setEntriesPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  // Loading and error states
  if (loading) {
    console.log("Loading state is true");
    return <div className="text-center py-8">Loading leads...</div>;
  }

  if (error) {
    console.error("Error details:", error);
    return <div className="text-center text-red-500 py-8">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      {/* Upload Section */}
      <div className="mb-6">
        <label className="text-lg font-semibold text-gray-800">
          Upload Excel File
        </label>
        <input
          type="file"
          onChange={handleFileChange}
          className="mt-1 p-2 block w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          type="button"
          onClick={handleFileUpload}
          className="mt-2 py-2 px-4 text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:ring focus:ring-blue-500 focus:outline-none"
        >
          Upload File
        </button>
      </div>

      {/* Advanced Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search across all fields (name, email, contact, destination...)"
            className="block w-full pl-10 pr-3 py-3 border border-gray-600 bg-gray-800 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        {isSearching && (
          <div className="mt-2 text-sm text-gray-400">Searching...</div>
        )}
        <div className="mt-2 flex justify-between items-center">
          <span className="text-sm text-gray-400">
            {filteredLeads.length} results found
          </span>
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                fetchLeads();
              }}
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              Clear search
            </button>
          )}
        </div>
      </div>

      {/* Search & Filter Section */}
      <div className="p-4 rounded-lg shadow-md mb-6 bg-gray-800">
        <h2 className="text-lg font-semibold text-white mb-4">
          Search & Filters
        </h2>
        <details className="rounded-md overflow-hidden">
          <summary className="cursor-pointer bg-gray-700 text-white px-4 py-2 font-medium rounded-md">
            Toggle Filters
          </summary>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 p-4 bg-gray-700 rounded-md">
            <input
              type="text"
              placeholder="Name"
              value={filters.name}
              onChange={(e) => handleFilterChange("name", e.target.value)}
              className="p-2 border border-gray-600 bg-gray-900 text-white placeholder-gray-400 rounded"
            />
            <input
              type="text"
              placeholder="Destination"
              value={filters.destination}
              onChange={(e) =>
                handleFilterChange("destination", e.target.value)
              }
              className="p-2 border border-gray-600 bg-gray-900 text-white placeholder-gray-400 rounded"
            />
            <input
              type="text"
              placeholder="Departure City"
              value={filters.departureCity}
              onChange={(e) =>
                handleFilterChange("departureCity", e.target.value)
              }
              className="p-2 border border-gray-600 bg-gray-900 text-white placeholder-gray-400 rounded"
            />
            <div>
              <label
                className="block text-sm font-medium text-gray-200 mb-1"
                htmlFor="upload-date"
              >
                Date of Upload
              </label>
              <input
                id="upload-date"
                type="date"
                value={filters.uploadDate || ""}
                onChange={(e) =>
                  handleFilterChange("uploadDate", e.target.value)
                }
                className="p-3 border border-gray-600 bg-gray-900 text-white rounded-md w-full"
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-200 mb-1"
                htmlFor="creation-date"
              >
                Date of Creation
              </label>
              <input
                id="creation-date"
                type="date"
                value={filters.dateofCreation || ""}
                onChange={(e) =>
                  handleFilterChange("dateofCreation", e.target.value)
                }
                className="p-3 border border-gray-600 bg-gray-900 text-white rounded-md w-full"
              />
            </div>
            <select
              value={filters.needOfFlight}
              onChange={(e) =>
                handleFilterChange("needOfFlight", e.target.value)
              }
              className="p-2 border border-gray-600 bg-gray-900 text-white rounded"
            >
              <option value="">Flight?</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
            <select
              value={filters.leadSource}
              onChange={(e) =>
                handleFilterChange("leadSource", e.target.value)
              }
              className="p-2 border border-gray-600 bg-gray-900 text-white rounded"
            >
              <option value="">Source</option>
              <option value="Google">Google</option>
              <option value="Referral">Referral</option>
              <option value="Social Media">Social Media</option>
              <option value="Meta">Meta</option>
            </select>
            <select
              value={filters.assignee}
              onChange={(e) => handleFilterChange("assignee", e.target.value)}
              className="p-2 border border-gray-600 bg-gray-900 text-white rounded"
            >
              <option value="">Assignee</option>
              {[
                "Vijay",
                "Naveen",
                "Employee1",
                "Karan",
                "Amit Jaiswal",
                "Pratham",
                "Lakshya",
                "Aash",
                "Sanjay",
                "Employee2",
                "Unassigned"
              ].map((assignee) => (
                <option key={assignee} value={assignee}>
                  {assignee}
                </option>
              ))}
            </select>
            <select
              value={filters.leadStatus}
              onChange={(e) => handleFilterChange("leadStatus", e.target.value)}
              className="p-2 border border-gray-600 bg-gray-900 text-white rounded"
            >
              <option value="">Status</option>
              <option value="New">New</option>
              <option value="Warm">Warm</option>
              <option value="Cold">Cold</option>
              <option value="Cancel">Cancelled</option>
              <option value="Closed">Closed</option>
              <option value="Open">Open</option>
              <option value="Converted">Converted</option>
              <option value="Duplicate">Duplicate</option>
            </select>
            <select
              value={filters.verificationStatus}
              onChange={(e) =>
                handleFilterChange("verificationStatus", e.target.value)
              }
              className="p-2 border border-gray-600 bg-gray-900 text-white rounded"
            >
              <option value="">Verified ?</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
            <input
              type="text"
              placeholder="Phone Number"
              value={filters.contact}
              onChange={(e) => handleFilterChange("contact", e.target.value)}
              className="p-2 border border-gray-600 bg-gray-900 text-white placeholder-gray-400 rounded"
            />
          </div>
        </details>
        {/* Clear Filters Button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => {
              setFilters({
                name: "",
                destination: "",
                departureCity: "",
                budget: "",
                needOfFlight: "",
                leadSource: "",
                assignee: "",
                leadStatus: "",
                verificationStatus: "",
                contact: "",
                uploadDate: "",
                dateofCreation: ""
              });
              fetchLeads();
            }}
            className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded focus:ring focus:ring-red-500"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Export Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleExport}
          disabled={filteredLeads.length === 0}
          className={`py-2 px-4 ${
            filteredLeads.length === 0
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          } text-white rounded-md flex items-center`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Export to Excel
        </button>
      </div>

      {/* Entries Per Page & Table Section */}
      <div className="mb-4">
        <label className="text-sm font-semibold text-gray-800">
          Entries per page:
        </label>
        <select
          value={entriesPerPage}
          onChange={handleEntriesChange}
          className="ml-2 p-2 border border-gray-600 bg-gray-900 text-white rounded-md"
        >
          {[10, 20, 30, 50, 100].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-800 bg-gray-900 text-white">
          <thead className="bg-gray-700">
            <tr>
              {[
                { key: "_id", label: "ID" },
                { key: "name", label: "Name" },
                { key: "dateOfTravel", label: "Date of Travel" },
                { key: "destination", label: "Destination" },
                { key: "departureCity", label: "Departure City" },
                { key: "budget", label: "Budget" },
                { key: "needOfFlight", label: "Flight" },
                { key: "leadSource", label: "Lead Source" },
                { key: "assignee", label: "Assignee" },
                { key: "leadStatus", label: "Lead Status" },
                { key: "verificationStatus", label: "Verification" },
                { key: "dateofCreation", label: "Date of Creation" },
                { key: "timestamp", label: "Date of Upload" }
              ].map(({ key, label }) => (
                <th
                  key={key}
                  onClick={() => requestSort(key)}
                  className="border border-gray-700 px-4 py-2 text-sm cursor-pointer hover:bg-gray-600"
                >
                  {label}
                  {sortConfig.key === key && (
                    <span className="ml-2">
                      {sortConfig.direction === "ascending" ? "▲" : "▼"}
                    </span>
                  )}
                </th>
              ))}
              <th className="border border-gray-700 px-4 py-2 text-sm">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {displayedLeads.map((lead, index) => (
              <tr key={lead._id} className="hover:bg-gray-800">
                <td className="border border-gray-700 px-4 py-2 text-sm">
                  {lead._id.slice(0, 5)}
                </td>
                <td className="border border-gray-700 px-4 py-2 text-sm">
                  {lead.name}
                </td>
                <td className="border border-gray-700 px-4 py-2 text-sm">
                  {lead.dateOfTravel || "N/A"}
                </td>
                <td className="border border-gray-700 px-4 py-2 text-sm">
                  {lead.destination || "N/A"}
                </td>
                <td className="border border-gray-700 px-4 py-2 text-sm">
                  {lead.departureCity || "N/A"}
                </td>
                <td className="border border-gray-700 px-4 py-2 text-sm">
                  {lead.budget || "N/A"}
                </td>
                <td className="border border-gray-700 px-4 py-2 text-sm">
                  {lead.needOfFlight || "N/A"}
                </td>
                <td className="border border-gray-700 px-4 py-2 text-sm">
                  {lead.leadSource || "N/A"}
                </td>
                <td className="border border-gray-700 px-4 py-2 text-sm">
                  {lead.assignee || "N/A"}
                </td>
                <td className="border border-gray-700 px-4 py-2 text-sm">
                  {lead.leadStatus || "N/A"}
                </td>
                <td className="border border-gray-700 px-4 py-2 text-sm">
                  {lead.verificationStatus || "N/A"}
                </td>
                <td className="border border-gray-700 px-4 py-2 text-sm">
                  {formatDate(lead.dateofCreation)}
                </td>
                <td className="border border-gray-700 px-4 py-2 text-sm">
                  {formatDate(lead.timestamp)}
                </td>
                <td className="border border-gray-700 px-4 py-2 text-sm">
                  {/* Calculate absolute index from pagination */}
                  <button
                    onClick={() =>
                      handleViewLead(
                        lead._id,
                        (currentPage - 1) * entriesPerPage + index
                      )
                    }
                    className="py-1 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md focus:ring focus:ring-blue-500"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Section */}
      <div className="mt-6 flex justify-center items-center">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`py-2 px-4 ${
            currentPage === 1
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white rounded-md`}
        >
          Previous
        </button>
        <span className="px-4 text-gray-200">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`py-2 px-4 ${
            currentPage === totalPages
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white rounded-md`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default LeadTable;
