'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const overallData = [
  { name: 'Jan', Planned: 10, Actual: 8 },
  { name: 'Feb', Planned: 20, Actual: 18 },
  { name: 'Mar', Planned: 30, Actual: 28 },
  { name: 'Apr', Planned: 40, Actual: 35 },
  { name: 'May', Planned: 50, Actual: 45 },
  { name: 'Jun', Planned: 60, Actual: 52 },
  { name: 'Jul', Planned: 70, Actual: 65 },
  { name: 'Aug', Planned: 80, Actual: 70 },
  { name: 'Sep', Planned: 90, Actual: 78 },
  { name: 'Oct', Planned: 95, Actual: 85 },
  { name: 'Nov', Planned: 97, Actual: 90 },
  { name: 'Dec', Planned: 100, Actual: 95 },
];


const stagewiseData = [
  { name: 'Excavation', Planned: 100, Actual: 100 },
  { name: 'Substructure', Planned: 100, Actual: 100 },
  { name: 'Superstructure', Planned: 100, Actual: 88.16 },
  { name: 'Finishing', Planned: 31.24, Actual: 0 },
];

const towerwiseData = [
  { name: 'Cafeteria Area', Planned: 77.48, Actual: 77.48 },
  { name: 'Tower Area', Planned: 87.53, Actual: 78.61 },
];

export default function AnalyticsPage() {
  const router = useRouter();

  return (

    <div className="p-6 space-y-8 container">
      <button onClick={() => router.back()} className="flex items-center space-x-2 text-blue-600 hover:underline">
        <ArrowLeft size={20} />
        <span>Back</span>
      </button>

      {/* Line Chart */}
      <h2 className="text-xl font-bold">Overall Project Completion %</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={overallData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Planned" stroke="#3b82f6" strokeWidth={2} dot />
          <Line type="monotone" dataKey="Actual" stroke="#ef4444" strokeWidth={2} dot />

        </LineChart>
      </ResponsiveContainer>

      {/* Side-by-side Bar Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold">Planned Vs Actual (Stagewise)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stagewiseData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Planned" fill="#3b82f6" />
              <Bar dataKey="Actual" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h2 className="text-xl font-bold">Planned Vs Actual (Towerwise)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={towerwiseData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Planned" fill="#3b82f6" />
              <Bar dataKey="Actual" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
