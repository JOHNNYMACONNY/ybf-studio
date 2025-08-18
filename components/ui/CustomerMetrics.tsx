import React from 'react';
import { Users, UserPlus, UserCheck, TrendingUp } from 'lucide-react';

interface CustomerMetricsProps {
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  customerRetentionRate: number;
}

const CustomerMetrics: React.FC<CustomerMetricsProps> = ({
  totalCustomers,
  newCustomers,
  returningCustomers,
  customerRetentionRate
}) => {
  return (
    <div className="bg-black rounded-xl ring-1 ring-neutral-700/60 p-6">
      <h3 className="text-card-title font-semibold mb-6">Customer Analytics</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Total Customers */}
        <div className="flex items-center gap-4 p-4 bg-neutral-900 rounded-lg">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-neutral-400 text-sm">Total Customers</p>
            <p className="text-2xl font-bold text-neutral-100">{totalCustomers.toLocaleString()}</p>
          </div>
        </div>

        {/* New Customers */}
        <div className="flex items-center gap-4 p-4 bg-neutral-900 rounded-lg">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
            <UserPlus className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-neutral-400 text-sm">New Customers</p>
            <p className="text-2xl font-bold text-neutral-100">{newCustomers.toLocaleString()}</p>
          </div>
        </div>

        {/* Returning Customers */}
        <div className="flex items-center gap-4 p-4 bg-neutral-900 rounded-lg">
          <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
            <UserCheck className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-neutral-400 text-sm">Returning Customers</p>
            <p className="text-2xl font-bold text-neutral-100">{returningCustomers.toLocaleString()}</p>
          </div>
        </div>

        {/* Retention Rate */}
        <div className="flex items-center gap-4 p-4 bg-neutral-900 rounded-lg">
          <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-neutral-400 text-sm">Retention Rate</p>
            <p className="text-2xl font-bold text-neutral-100">{customerRetentionRate.toFixed(1)}%</p>
          </div>
        </div>
      </div>

      {/* Customer Growth Chart */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-neutral-100 font-medium">Customer Growth</h4>
          <div className="flex items-center gap-2 text-green-400 text-sm">
            <TrendingUp className="h-4 w-4" />
            +15.3% this month
          </div>
        </div>
        
        {/* Simple bar chart representation */}
        <div className="flex items-end gap-2 h-20">
          {[20, 35, 45, 30, 55, 40, 67].map((value, index) => (
            <div
              key={index}
              className="flex-1 bg-gradient-to-t from-amber-500 to-amber-600 rounded-t"
              style={{ height: `${(value / 70) * 100}%` }}
            />
          ))}
        </div>
        
        <div className="flex justify-between text-xs text-neutral-400 mt-2">
          <span>7 days ago</span>
          <span>Today</span>
        </div>
      </div>
    </div>
  );
};

export default CustomerMetrics; 