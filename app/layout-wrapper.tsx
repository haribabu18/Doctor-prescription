'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaFilePrescription, FaPills, FaDownload, FaChartLine, FaSignOutAlt } from 'react-icons/fa';
import Image from 'next/image';

interface DashboardStats {
  todayPrescriptions: number;
  todayMedicines: number;
  totalPrescriptions: number;
  totalMedicines: number;
}



export function Dashboard({ children, }: { children: React.ReactNode}) {
  // Server-side auth check
  // Proper synchronous cookie access

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

  const username = 'Dr.Sailendra Mohan';

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 p-8">
      <div className="flex-grow max-w-7xl">
        <div className="flex items-center justify-between align-middle mb-8">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Logo" width={60} height={60} className="w-10 md:w-15 h-10 md:h-15" />
            <h1 className="text-sm md:text-lg font-bold text-gray-400">Welcome,<br />
              <span className="text-lg md:text-2xl text-black">{username}</span>
            </h1>
          </div>
          <form action="/api/auth/logout" className="" method="POST">
            <button type="submit" className="text-red-500 text-sm md:text-lg flex items-center gap-2 border border-red-500 rounded-md p-2 hover:bg-red-500 hover:text-white transition-all duration-300">Logout <FaSignOutAlt /></button>
          </form>
        </div>
        <br />
        
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
        {children}
      </div>
      {/* footer */}
      <div className="mt-8">
        <p className="text-center text-gray-600 text-sm">
          &copy; {new Date().getFullYear()} Doctor Prescription. All rights reserved.
        </p>
        <p className="text-center text-gray-600 text-sm">developed by <a href="https://github.com/haribabu18" target="_blank" rel="noopener noreferrer" className="text-blue-500">haribabu</a></p>
      </div>
    </div>
  );
}
