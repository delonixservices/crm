import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;
console.log("API URL:", API_URL);

const ProposalsTable = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Helper function to truncate ID
  const truncateId = (id) => {
    return id.slice(-6);
  };

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const response = await fetch(`${API_URL}/api/proposals`);
        if (!response.ok) {
          throw new Error(`Failed to fetch proposals. Status: ${response.status}`);
        }
        const data = await response.json();
        setProposals(data);
      } catch (err) {
        console.error("Error fetching proposals:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProposals();
  }, []);

  const handleViewProposal = (proposalId) => {
    navigate(`/proposal-view/${proposalId}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="spinner-border text-blue-500 animate-spin w-12 h-12 border-4 rounded-full"></div>
        <p className="mt-4 text-white">Loading proposals...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-white">Proposals</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-800 bg-black text-white">
          <thead className="bg-gray-700">
            <tr>
              <th className="border border-gray-700 px-4 py-2">ID</th>
              <th className="border border-gray-700 px-4 py-2">Proposal Name</th>
              <th className="border border-gray-700 px-4 py-2">Client Name</th>
              <th className="border border-gray-700 px-4 py-2">Start Date</th>
              <th className="border border-gray-700 px-4 py-2">End Date</th>
              <th className="border border-gray-700 px-4 py-2">From</th>
              <th className="border border-gray-700 px-4 py-2">Destination</th>
              <th className="border border-gray-700 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {proposals.length > 0 ? (
              proposals.map((proposal) => (
                <tr key={proposal._id} className="hover:bg-gray-800">
                  <td className="border border-gray-700 px-4 py-2" title={proposal._id}>
                    {truncateId(proposal._id)}
                  </td>
                  <td 
                    className="border border-gray-700 px-4 py-2 max-w-[30px]"
                    title={proposal.clientInfo?.proposalName || "N/A"}
                  >
                    <div className="truncate">
                      {proposal.clientInfo?.proposalName || "N/A"}
                    </div>
                  </td>
                  <td className="border border-gray-700 px-4 py-2">{proposal.clientInfo?.name || "N/A"}</td>
                  <td className="border border-gray-700 px-4 py-2">
                    {new Date(proposal.clientInfo?.startDate).toLocaleDateString() || "N/A"}
                  </td>
                  <td className="border border-gray-700 px-4 py-2">
                    {new Date(proposal.clientInfo?.endDate).toLocaleDateString() || "N/A"}
                  </td>
                  <td className="border border-gray-700 px-4 py-2">{proposal.clientInfo?.startCity || "N/A"}</td>
                  <td className="border border-gray-700 px-4 py-2">{proposal.clientInfo?.destinationAreas || "N/A"}</td>
                  <td className="border border-gray-700 px-4 py-2 text-center">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-1 px-3 rounded transition duration-200"
                      onClick={() => handleViewProposal(proposal._id)}
                    >
                      View Proposal
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="border border-gray-700 px-4 py-2 text-center text-gray-400"
                >
                  No proposals available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProposalsTable;