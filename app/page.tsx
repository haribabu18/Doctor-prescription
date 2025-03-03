'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaFilePrescription, FaPills, FaDownload, FaChartLine } from 'react-icons/fa';

interface DashboardStats {
  todayPrescriptions: number;
  todayMedicines: number;
  totalPrescriptions: number;
  totalMedicines: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    todayPrescriptions: 0,
    todayMedicines: 0,
    totalPrescriptions: 0,
    totalMedicines: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today&apos;s Prescriptions</p>
                <h3 className="text-2xl font-bold text-gray-800">{stats.todayPrescriptions}</h3>
              </div>
              <FaFilePrescription className="text-blue-500 text-3xl" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Medicines Added Today</p>
                <h3 className="text-2xl font-bold text-gray-800">{stats.todayMedicines}</h3>
              </div>
              <FaPills className="text-green-500 text-3xl" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Prescriptions</p>
                <h3 className="text-2xl font-bold text-gray-800">{stats.totalPrescriptions}</h3>
              </div>
              <FaChartLine className="text-purple-500 text-3xl" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Medicines</p>
                <h3 className="text-2xl font-bold text-gray-800">{stats.totalMedicines}</h3>
              </div>
              <FaPills className="text-orange-500 text-3xl" />
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/prescriptions/new" className="block">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center space-x-4">
                <FaFilePrescription className="text-blue-500 text-4xl" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Create Prescription</h3>
                  <p className="text-gray-600">Create a new prescription for patients</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/medicines" className="block">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center space-x-4">
                <FaPills className="text-green-500 text-4xl" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Manage Medicines</h3>
                  <p className="text-gray-600">Add, edit, or remove medicines</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/prescriptions" className="block">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center space-x-4">
                <FaDownload className="text-purple-500 text-4xl" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">View Prescriptions</h3>
                  <p className="text-gray-600">View and download prescriptions</p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
