import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  MapPin, 
  DollarSign, 
  CloudUpload, 
  CheckCircle2, 
  XCircle,
  Hotel,
  Users,
  Baby,
  UserCheck,
  Globe,
  Flag,
  UserPlus,
  StickyNote
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const LeadForm = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    dateOfTravel: "",
    numberOfDays: 0,
    destination: "",
    departureCity: "",
    numberOfClients: {
      rooms: 1,
      adults: 1,
      children: 0,
      childrenAges: [],
    },
    leadStatus: "New",
    verificationStatus: "", // Added
    assignee: "", // Added
    needOfFlight: "", // Added
    budget: "",
    leadSource: "", // Added
    numberofPacks: "",
    timestamp: "",
    notes: "",
  });

  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested numberOfClients structure
    if (["rooms", "adults", "children"].includes(name)) {
      setFormData(prevData => ({
        ...prevData,
        numberOfClients: {
          ...prevData.numberOfClients,
          [name]: Number(value),
          ...(name === "children" && { 
            childrenAges: Array(Number(value)).fill("") 
          }),
        }
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleChildAgeChange = (index, age) => {
    setFormData(prevData => ({
      ...prevData,
      numberOfClients: {
        ...prevData.numberOfClients,
        childrenAges: prevData.numberOfClients.childrenAges.map((a, i) => 
          i === index ? Number(age) : a
        )
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    // Flatten the numberOfClients object
    const { numberOfClients, ...otherFormData } = formData;
    const flattenedFormData = {
      ...otherFormData,
      rooms: numberOfClients.rooms,
      adults: numberOfClients.adults,
      children: numberOfClients.children,
      childrenAges: numberOfClients.childrenAges,
      timestamp: new Date().toISOString(),
      dateofCreation: new Date().toISOString(),
    };
  
    try {
      const response = await fetch(`${API_URL}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(flattenedFormData),
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log("Lead saved successfully:", result);
        navigate("/leads", { state: flattenedFormData });
      } else {
        // Get more detailed error information
        const errorData = await response.json();
        console.error("Failed to save lead:", errorData);
        alert(`Failed to save lead: ${JSON.stringify(errorData)}`);
      }
    } catch (err) {
      console.error("Error submitting lead:", err);
      alert("An error occurred while submitting the lead.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
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
        body: uploadData,
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Leads uploaded successfully! ${result.count} leads processed.`);
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        console.error("Failed to upload leads:", response.statusText);
        alert("Failed to upload leads. Please try again.");
      }
    } catch (err) {
      console.error("Error uploading file:", err);
      alert("An error occurred while uploading the file.");
    }
  };

  const renderChildrenAges = () =>
    formData.numberOfClients.children > 0 &&
    Array.from({ length: formData.numberOfClients.children }).map((_, index) => (
      <motion.div 
        key={index} 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-2"
      >
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Child {index + 1} Age
        </label>
        <input
          type="number"
          value={formData.numberOfClients.childrenAges[index] || ""}
          onChange={(e) => handleChildAgeChange(index, e.target.value)}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          placeholder={`Age of child ${index + 1}`}
          min="0"
          max="17"
        />
      </motion.div>
    ));

  return (
    <div className="min-h-screen flex items-center justify-center p-4 ">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl p-8 space-y-6 bg-white rounded-xl shadow-lg"
      >
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-2">
            Create New Lead
          </h2>
          <p className="text-gray-500">
            Fill in the details for your new travel lead
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Previous existing form fields... */}

           {/* Personal Details */}
           <div className="grid md:grid-cols-3 gap-4">
             <div className="relative">
               <label className="block text-sm font-medium text-gray-700 mb-1">
                 Name
               </label>
               <div className="relative">
                 <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                 <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="Enter full name"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="Phone number"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="Enter email address"
                />
              </div>
            </div>
          </div>

          {/* Travel Details */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Travel
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  name="dateOfTravel"
                  value={formData.dateOfTravel}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Destination
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="Travel destination"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Departure City
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="departureCity"
                  value={formData.departureCity}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="City of departure"
                />
              </div>
            </div>
          </div>

          {/* Accommodation and Clients */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rooms
              </label>
              <div className="relative">
                <Hotel className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  name="rooms"
                  value={formData.numberOfClients.rooms}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full pl-10 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="Number of rooms"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adults
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  name="adults"
                  value={formData.numberOfClients.adults}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full pl-10 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="Number of adults"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Children
              </label>
              <div className="relative">
                <Baby className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  name="children"
                  value={formData.numberOfClients.children}
                  onChange={handleChange}
                  min="0"
                  className="w-full pl-10 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="Number of children"
                />
              </div>
            </div>
          </div>

          {/* Children Ages */}
          {renderChildrenAges()}

          {/* Additional Details */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Days
              </label>
              <input
                type="number"
                name="numberOfDays"
                value={formData.numberOfDays}
                onChange={handleChange}
                min="1"
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="Trip duration"
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Budget
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className="w-full pl-10 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="Estimated budget"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Packs
              </label>
              <input
                type="text"
                name="numberofPacks"
                value={formData.numberofPacks}
                onChange={handleChange}
                className="w-full p-2
                border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="Number of travel packs"
              />
            </div>
          </div>

          
          
          {/* New Dropdown Fields */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assignee
              </label>
              <div className="relative">
                <UserPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  name="assignee"
                  value={formData.assignee}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                >
                  <option value="">Select Assignee</option>
                  <option value="vijay">Vijay</option>
                  <option value="vishwavijay">Vishwavijay</option>
                  <option value="naveen">Naveen</option>
                  <option value="Karan">Karan</option>
                  <option value="Pratham">Pratham</option>
                  <option value="Lakshya">Lakshya</option>
                  <option value="Aash">Aash</option>
                  <option value="Sanjay">Sanjay</option>
                  <option value="AmitJaiswal">Amit Jaiswal</option>
                  <option value="Employee 1">Sanjay</option>
                  <option value="Employee 2">Employee 2</option>
                  <option value="Unassigned">Unassigned</option>

                </select>
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lead Source
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  name="leadSource"
                  value={formData.leadSource}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                >
                  <option value="">Select Lead Source</option>
                  <option value="social_media">Social Media</option>
                  <option value="meta">Meta</option>
                  <option value="google">Google</option>
                </select>
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Verification Status
              </label>
              <div className="relative">
                <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  name="verificationStatus"
                  value={formData.verificationStatus}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                >
                  <option value="">Select Verification Status</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>
          </div>

          {/* Flight Needs */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Need Flight
              </label>
              <div className="relative">
                <Flag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  name="needOfFlight"
                  value={formData.needOfFlight}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                >
                  <option value="">Select Flight Requirement</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>
          </div>

          {/* Add Notes Section before the submit button */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Additional Notes
            </label>
            <div className="relative">
              <StickyNote className="absolute left-3 top-3 text-gray-400" />
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="w-full pl-10 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 min-h-[120px]"
                placeholder="Add any additional details, special requirements, or notes here..."
              />
            </div>
          </div>


          {/* Submission Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full max-w-xs bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300 flex items-center justify-center"
            >
              {isSubmitting ? (
                <span>Submitting...</span>
              ) : (
                "Create Lead"
              )}
            </button>
          </div>
          {/* File Upload Section */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Bulk Lead Upload
              </h3>
              <CloudUpload className="text-gray-500" />
            </div>

            <div className="flex items-center space-x-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".csv,.xlsx,.xls"
                className="flex-grow file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-blue-700 hover:file:bg-blue-100"
              />
              <button
                type="button"
                onClick={handleFileUpload}
                disabled={!file}
                className={`px-4 py-2 rounded-full text-white font-semibold transition-all duration-300 ${
                  file
                    ? "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Upload
              </button>
            </div>
            {file && (
              <div className="mt-2 text-sm text-gray-600 flex items-center">
                <CheckCircle2 className="mr-2 text-green-500" />
                {file.name}
                <XCircle
                  className="ml-2 text-red-500 cursor-pointer"
                  onClick={() => {
                    setFile(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                />
              </div>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default LeadForm;

