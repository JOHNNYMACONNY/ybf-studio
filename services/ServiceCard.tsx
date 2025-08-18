import React from 'react';

const ServiceCard: React.FC = () => {
  return (
    <div className="bg-white shadow rounded p-4">
      <h3 className="font-semibold">Service Name</h3>
      <p className="text-sm text-gray-500">Service Description</p>
    </div>
  );
};

export default ServiceCard;