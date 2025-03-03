'use client';

import { useState, useEffect } from 'react';
import { MedicineDB, MedicineCreateInput } from '../types/medicine';

interface MedicineSelectorProps {
  onSelect: (medicine: MedicineDB) => void;
  onClose: () => void;
}

export default function MedicineSelector({ onSelect, onClose }: MedicineSelectorProps) {
  const [search, setSearch] = useState('');
  const [medicines, setMedicines] = useState<MedicineDB[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMedicine, setNewMedicine] = useState<MedicineCreateInput>({
    name: '',
    description: '',
    dosageForm: '',
    strength: '',
    manufacturer: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/medicines${search ? `?search=${encodeURIComponent(search.toLowerCase())}` : ''}`);
        if (!response.ok) {
          throw new Error('Failed to fetch medicines');
        }
        const data = await response.json();
        setMedicines(data);
      } catch (error) {
        console.error('Failed to fetch medicines:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchMedicines, 300);
    return () => clearTimeout(debounce);
  }, [search]);

  const handleAddMedicine = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/medicines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMedicine),
      });

      if (!response.ok) {
        throw new Error('Failed to add medicine');
      }

      const addedMedicine = await response.json();
      onSelect(addedMedicine);
    } catch (error) {
      console.error('Error adding medicine:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Select Medicine</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <input
            type="text"
            placeholder="Search medicines..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : medicines.length > 0 ? (
            <div className="space-y-2">
              {medicines.map((medicine) => (
                <button
                  key={medicine.id}
                  onClick={() => onSelect(medicine)}
                  className="w-full text-left p-3 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <div className="font-medium text-gray-900">{medicine.name}</div>
                  {medicine.strength && (
                    <div className="text-sm text-gray-500">
                      {medicine.dosageForm} • {medicine.strength}
                    </div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No medicines found
            </div>
          )}
        </div>

        <div className="p-4 border-t">
          {showAddForm ? (
            <form onSubmit={handleAddMedicine} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  required
                  value={newMedicine.name}
                  onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
                  className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Dosage Form</label>
                <input
                  type="text"
                  value={newMedicine.dosageForm || ''}
                  onChange={(e) => setNewMedicine({ ...newMedicine, dosageForm: e.target.value })}
                  className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Strength</label>
                <input
                  type="text"
                  value={newMedicine.strength || ''}
                  onChange={(e) => setNewMedicine({ ...newMedicine, strength: e.target.value })}
                  className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Manufacturer</label>
                <input
                  type="text"
                  value={newMedicine.manufacturer || ''}
                  onChange={(e) => setNewMedicine({ ...newMedicine, manufacturer: e.target.value })}
                  className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Medicine
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              + Add New Medicine
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 