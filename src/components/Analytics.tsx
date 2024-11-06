import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import './Analytics.css'; // Optional: Custom CSS for enhanced styling

// Import ShadCN UI components and Recharts for Pie, Line, and Bar charts
import { TrendingUp } from 'lucide-react';
import { PieChart, Pie, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
} from '@/components/ui/chart';

const Analytics: React.FC = () => {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch the complaints data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://meta.pylex.xyz:10927/api/complaints');
        setComplaints(response.data);
      } catch (error) {
        console.error('Error fetching complaints:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to process complaints by type
  const getComplaintsByType = () => {
    const typesCount = complaints.reduce((acc: any, complaint: any) => {
      acc[complaint.complaint_type] = (acc[complaint.complaint_type] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(typesCount).map((type) => ({
      complaint_type: type,
      count: typesCount[type],
    }));
  };

  // Helper function to get complaints by day
  const getComplaintsByDay = () => {
    const complaintsByDay = complaints.reduce((acc: any, complaint: any) => {
      const day = dayjs(complaint.timestamp).format('YYYY-MM-DD');
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(complaintsByDay).map((day) => ({
      date: day,
      count: complaintsByDay[day],
    }));
  };

  // Helper function to process complaints by location (state)
  const getComplaintsByLocation = () => {
    const locationCount = complaints.reduce((acc: any, complaint: any) => {
      acc[complaint.state] = (acc[complaint.state] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(locationCount).map((state) => ({
      state,
      count: locationCount[state],
    }));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  // Define color palette
  const COLORS = ['#FF5733', '#33FF57', '#3357FF', '#FFC300', '#FF33A6'];

  // Define chartConfig objects for each chart type
  const typeChartConfig: ChartConfig = {
    count: {
      label: 'Count',
      color: COLORS[0],
    },
    complaint_type: {
      label: 'Type',
    },
  };

  const dayChartConfig: ChartConfig = {
    count: {
      label: 'Count',
      color: '#28A745', // Line chart green color
    },
    date: {
      label: 'Date',
    },
  };

  const locationChartConfig: ChartConfig = {
    count: {
      label: 'Count',
      color: '#FF6F61', // Bar chart orange/red
    },
    state: {
      label: 'State',
    },
  };

  return (
    <div className="analytics-container">
      {/* Complaints by Type (Pie Chart) */}
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Complaints by Type</CardTitle>
          <CardDescription>Complaints distribution by type</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer config={typeChartConfig} className="mx-auto aspect-square max-h-[250px] pb-0">
            <PieChart>
              <Pie
                data={getComplaintsByType()}
                dataKey="count"
                nameKey="complaint_type"
                label
                cx="50%"
                cy="50%"
                outerRadius={100}
              >
                {/* Use the `Cell` component for each color */}
                {getComplaintsByType().map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 font-medium leading-none">
            Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
          </div>
        </CardFooter>
      </Card>

      {/* Complaints by Day (Line Chart) */}
      <Card>
        <CardHeader>
          <CardTitle>Complaints by Day</CardTitle>
          <CardDescription>Complaints trends over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={dayChartConfig}>
            <LineChart data={getComplaintsByDay()} width={600} height={300}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="date" />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke={dayChartConfig.count.color} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Complaints by Location (Bar Chart) */}
      <Card>
        <CardHeader>
          <CardTitle>Complaints by Location (State)</CardTitle>
          <CardDescription>Complaints breakdown by location</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={locationChartConfig}>
            <BarChart data={getComplaintsByLocation()} width={600} height={300} layout="vertical">
              <XAxis type="number" />
              <YAxis dataKey="state" type="category" />
              <Tooltip />
              <Bar dataKey="count" fill={locationChartConfig.count.color} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
