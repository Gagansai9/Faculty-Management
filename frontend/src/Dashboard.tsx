import React from 'react';
import { Bar } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faTasks, faUsers, faProjectDiagram } from '@fortawesome/free-solid-svg-icons';

const Dashboard: React.FC = () => {
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Projects Completed',
        data: [65, 59, 80, 81, 56, 55, 40],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <FontAwesomeIcon icon={faChartLine} className="text-4xl text-primary mb-4" />
          <h3 className="text-xl font-semibold mb-2">Real-time Analytics</h3>
          <Bar data={data} options={options} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <FontAwesomeIcon icon={faTasks} className="text-4xl text-primary mb-4" />
          <h3 className="text-xl font-semibold mb-2">Task Management</h3>
          <p className="text-gray-600">Organize and prioritize tasks efficiently with our intuitive interface.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <FontAwesomeIcon icon={faUsers} className="text-4xl text-primary mb-4" />
          <h3 className="text-xl font-semibold mb-2">Team Collaboration</h3>
          <p className="text-gray-600">Foster teamwork and communication with built-in collaboration tools.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <FontAwesomeIcon icon={faProjectDiagram} className="text-4xl text-primary mb-4" />
          <h3 className="text-xl font-semibold mb-2">Project Overview</h3>
          <p className="text-gray-600">Get a comprehensive view of all ongoing projects and their statuses.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
