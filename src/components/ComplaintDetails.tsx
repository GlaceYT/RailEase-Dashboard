import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface Media {
  type: string;
  url: string;
  summary?: string;
  transcript?: string;
}

interface Complaint {
  reference_id: string;
  name: string;
  username: string;
  email: string;
  phone_number: string;
  pnr: string;
  complaint: string;
  location: string;
  villageOrCity: string;
  district: string;
  state: string;
  complaint_type: string;
  urgency: string;
  sub_category: string;
  additional_details: string;
  media?: Media[];
  timestamp: string;
  status: string;
}

const ComplaintDetails: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { complaint }: { complaint?: Complaint } = location.state || {};

  if (!complaint) {
    return <div>Error: No complaint data available.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-500 hover:underline mb-4"
        >
          Back to Complaints List
        </button>

        <div className="bg-white shadow-md p-6 rounded-lg">
          <h1 className="text-2xl font-bold mb-4">Complaint Details</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User Information */}
            <div>
              <h2 className="text-lg font-semibold">User Information</h2>
              <p><strong>Name:</strong> {complaint.name}</p>
              <p><strong>Username:</strong> {complaint.username}</p>
              <p><strong>Email:</strong> {complaint.email}</p>
              <p><strong>Phone Number:</strong> {complaint.phone_number}</p>
            </div>

            {/* Complaint Information */}
            <div>
              <h2 className="text-lg font-semibold">Complaint Information</h2>
              <p><strong>Complaint:</strong> {complaint.complaint}</p>
              <p><strong>PNR:</strong> {complaint.pnr}</p>
              <p><strong>Type:</strong> {complaint.complaint_type}</p>
              <p><strong>Urgency:</strong> {complaint.urgency}</p>
              <p><strong>Sub-Category:</strong> {complaint.sub_category}</p>
              <p><strong>Additional Details:</strong> {complaint.additional_details}</p>
            </div>

            {/* Location Details */}
            <div>
              <h2 className="text-lg font-semibold">Location Details</h2>
              <p><strong>Village or City:</strong> {complaint.villageOrCity}</p>
              <p><strong>District:</strong> {complaint.district}</p>
              <p><strong>State:</strong> {complaint.state}</p>
              <p><strong>Location:</strong> {complaint.location}</p>
            </div>

            {/* Reference and Status */}
            <div>
              <h2 className="text-lg font-semibold">Status and Timestamp</h2>
              <p><strong>Reference ID:</strong> {complaint.reference_id}</p>
              <p><strong>Status:</strong> {complaint.status}</p>
              <p><strong>Timestamp:</strong> {new Date(complaint.timestamp).toLocaleString()}</p>
            </div>
          </div>

          {/* Media Section */}
          {complaint.media && complaint.media.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold">Media Attachments</h2>
              <ul>
                {complaint.media.map((media, index) => (
                  <li key={index} className="mb-4">
                    {media.type.startsWith('image/') && (
                      <>
                        <img src={media.url} alt="Complaint Media" className="media-img mb-2" />
                        {media.summary && <p><strong>Summary:</strong> {media.summary}</p>}
                      </>
                    )}
                    {media.type.startsWith('audio/') && (
                      <>
                        <audio controls className="media-audio mb-2">
                          <source src={media.url} type="audio/mpeg" />
                          Your browser does not support the audio element.
                        </audio>
                        {media.transcript && <p><strong>Transcript:</strong> {media.transcript}</p>}
                      </>
                    )}
                    {media.type.startsWith('video/') && (
                      <>
                        <video controls className="media-video mb-2">
                          <source src={media.url} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                        {media.transcript && <p><strong>Transcript:</strong> {media.transcript}</p>}
                      </>
                    )}
                    <a href={media.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View Media</a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetails;
