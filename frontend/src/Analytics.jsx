import { useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as LineTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Tooltip as PieTooltip, Legend,
  BarChart, Bar
} from 'recharts';

function Analytics() {
  // Mock Data for the Charts
  const monthlyDemand = [
    { month: 'Jan', demand: 120, supply: 140 },
    { month: 'Feb', demand: 150, supply: 130 },
    { month: 'Mar', demand: 180, supply: 170 },
    { month: 'Apr', demand: 220, supply: 190 }, // Dengue season peak
    { month: 'May', demand: 170, supply: 180 },
    { month: 'Jun', demand: 140, supply: 160 },
  ];

  const inventoryDistribution = [
    { name: 'O+', value: 45, color: '#ef4444' }, // red-500
    { name: 'O-', value: 12, color: '#f97316' }, // orange-500
    { name: 'A+', value: 30, color: '#3b82f6' }, // blue-500
    { name: 'A-', value: 8,  color: '#8b5cf6' }, // violet-500
    { name: 'B+', value: 25, color: '#10b981' }, // emerald-500
    { name: 'AB+', value: 15, color: '#eab308' },// yellow-500
  ];

  const campYield = [
    { location: 'SRM University', units: 85 },
    { location: 'Tech Park IT', units: 42 },
    { location: 'City Mall Plaza', units: 65 },
    { location: 'Lions Club', units: 110 },
  ];

  return (
    <div className="max-w-7xl mx-auto pb-16 animate-fade-in-up">
      
      <div className="mb-12">
        <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-3">Data Analytics</h2>
        <p className="text-lg text-gray-500 font-medium">Interactive visualizations for supply chain forecasting and inventory health.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Line Chart: Demand vs Supply Forecasting */}
        <div className="bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 lg:col-span-2">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900">6-Month Supply vs Demand Forecast</h3>
            <p className="text-sm text-gray-500">Tracking incoming donations against hospital dispatches.</p>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyDemand} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 14}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 14}} dx={-10} />
                <LineTooltip 
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}
                />
                <Line type="monotone" dataKey="demand" name="Blood Demand" stroke="#ef4444" strokeWidth={4} dot={{r: 6, strokeWidth: 2}} activeDot={{r: 8}} />
                <Line type="monotone" dataKey="supply" name="Blood Supply" stroke="#10b981" strokeWidth={4} dot={{r: 6, strokeWidth: 2}} activeDot={{r: 8}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Inventory Distribution */}
        <div className="bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900">Current Stock Distribution</h3>
            <p className="text-sm text-gray-500">Live breakdown by blood group volume.</p>
          </div>
          <div className="h-72 w-full flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={inventoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {inventoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <PieTooltip 
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                  itemStyle={{ fontWeight: 'bold', color: '#111827' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '14px', fontWeight: '500' }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: Campaign Yields */}
        <div className="bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900">Donation Camp Yields</h3>
            <p className="text-sm text-gray-500">Units collected from external regional drives.</p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={campYield} margin={{ top: 5, right: 30, left: -20, bottom: 5 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
                <YAxis dataKey="location" type="category" axisLine={false} tickLine={false} tick={{fill: '#4b5563', fontSize: 12, fontWeight: 'bold'}} width={120} />
                <PieTooltip cursor={{fill: '#f3f4f6'}} contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="units" name="Units Collected" fill="#3b82f6" radius={[0, 8, 8, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Analytics;