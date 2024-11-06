import React, { useEffect, useState } from "react";
import { Pie, PieChart, Cell, Tooltip } from "recharts";

const Analytics: React.FC = () => {
  const [totalComplaints, setTotalComplaints] = useState<number>(0);
  const [complaintData, setComplaintData] = useState<{ name: string; value: number; color: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://meta.pylex.xyz:10927/api/complaints");
        const data = await response.json();

        // Set total complaints count
        setTotalComplaints(data.length); // Assuming the response is an array of complaints

        // Count complaints by type
        const complaintsByType: { [key: string]: number } = {};
        data.forEach((complaint: any) => {
          const type = complaint.complaint_type;
          complaintsByType[type] = (complaintsByType[type] || 0) + 1;
        });

        // Convert the complaint count to the format required for the pie chart
        const pieData = Object.keys(complaintsByType).map((key, index) => ({
          name: key,
          value: complaintsByType[key],
          color: `hsl(${(index * 360) / Object.keys(complaintsByType).length}, 70%, 50%)`, // Generate a color dynamically
        }));

        setComplaintData(pieData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-4">Total Complaints: {totalComplaints}</h3>

      {/* Pie Chart */}
      <PieChart width={400} height={400}>
        <Pie
          data={complaintData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          paddingAngle={5}
        >
          {complaintData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>

      {/* Optionally, you can display the detailed complaint types */}
      <div className="mt-4">
        <h4 className="font-bold">Complaint Types:</h4>
        <ul>
          {complaintData.map((entry, index) => (
            <li key={index}>
              {entry.name}: {entry.value}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Analytics;
