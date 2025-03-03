'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Prescription } from '../types/prescription';
import PrescriptionPDF from './PrescriptionPDF';
import MedicineSelector from './MedicineSelector';
import { MedicineDB } from '../types/medicine';

export default function PrescriptionForm() {
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState<Prescription | null>(null);
  const [showMedicineSelector, setShowMedicineSelector] = useState(false);
  const [editingMedicineIndex, setEditingMedicineIndex] = useState<number | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  // Get today's date in YYYY-MM-DD format for the default value
  const today = new Date().toISOString().split('T')[0];
  
  const { register, control, handleSubmit, setValue, watch } = useForm<Prescription>({
    defaultValues: {
      medicines: [],
      testReports: [],
      date: today,
      courseDays: 5, // Default to 5 days
    }
  });

  const { fields: medicineFields, append: appendMedicine, remove: removeMedicine } = useFieldArray({
    control,
    name: 'medicines',
  });

  const { fields: testFields, append: appendTest, remove: removeTest } = useFieldArray({
    control,
    name: 'testReports',
  });

  // Watch for changes to courseDays and all medicine dosage checkboxes
  const courseDays = watch('courseDays');
  const medicines = watch('medicines');

  // Function to calculate and update quantities
  const updateQuantities = useCallback(() => {
    if (medicines) {
      medicines.forEach((medicine, index) => {
        const dosesPerDay = (medicine.morning ? 1 : 0) + 
                           (medicine.afternoon ? 1 : 0) + 
                           (medicine.evening ? 1 : 0) + 
                           (medicine.night ? 1 : 0);
        const quantity = dosesPerDay * (courseDays || 0);
        setValue(`medicines.${index}.quantity`, quantity);
      });
    }
  }, [medicines, courseDays, setValue]);

  // Update quantities whenever courseDays or medicine dosages change
  useEffect(() => {
    updateQuantities();
  }, [courseDays, medicines, updateQuantities]);

  // Update quantities when a new medicine is added
  const handleAddMedicine = () => {
    setEditingMedicineIndex(medicineFields.length);
    setShowMedicineSelector(true);
  };

  const handleEditMedicine = (index: number) => {
    setEditingMedicineIndex(index);
    setShowMedicineSelector(true);
  };

  const handleMedicineSelect = (selectedMedicine: MedicineDB) => {
    if (editingMedicineIndex !== null) {
      const medicineData = {
        name: `${selectedMedicine.name}${selectedMedicine.strength ? ` ${selectedMedicine.strength}` : ''}${selectedMedicine.dosageForm ? ` (${selectedMedicine.dosageForm})` : ''}`,
        morning: false,
        afternoon: false,
        evening: false,
        night: false,
        quantity: 0
      };

      if (editingMedicineIndex === medicineFields.length) {
        appendMedicine(medicineData);
      } else {
        setValue(`medicines.${editingMedicineIndex}.name`, medicineData.name);
      }
    }
    setShowMedicineSelector(false);
    setEditingMedicineIndex(null);
  };

  const handleRemoveMedicine = (index: number) => {
    if (medicineFields.length === 1) {
      alert('At least one medicine is required');
      return;
    }
    removeMedicine(index);
  };

  const onSubmit = async (data: Prescription) => {
    // Reset states
    setSaveStatus('idle');
    setErrorMessage('');

    // Validate at least one medicine exists
    if (!data.medicines || data.medicines.length === 0) {
      alert('Please add at least one medicine');
      return;
    }

    // Validate each medicine has at least one checkbox checked
    const hasInvalidMedicine = data.medicines.some(medicine => 
      !medicine.morning && !medicine.afternoon && !medicine.evening && !medicine.night
    );

    if (hasInvalidMedicine) {
      alert('Please check at least one time (Morning/Afternoon/Evening/Night) for each medicine');
      return;
    }

    setFormData(data);
    setShowPreview(true);

    // Save prescription data
    try {
      setSaveStatus('saving');
      const response = await fetch('/api/prescriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.details || responseData.error || 'Failed to save prescription');
      }

      console.log('Prescription saved:', responseData);
      setSaveStatus('success');
    } catch (error) {
      console.error('Error saving prescription:', error);
      setSaveStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to save prescription');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto p-6 space-y-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-black">Doctor&apos;s Prescription</h2>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-black">Date</label>
              <input
                type="date"
                {...register('date')}
                className="mt-1 block w-full rounded-md border-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black">Patient Name</label>
              <input
                type="text"
                {...register('patientName', { required: true })}
                className="mt-1 block w-full rounded-md border-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black">Age</label>
              <input
                type="number"
                {...register('age', { required: true, min: 0 })}
                className="mt-1 block w-full rounded-md border-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black">Phone Number</label>
              <input
                type="tel"
                {...register('phoneNumber')}
                className="mt-1 block w-full rounded-md border-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black px-4 py-2"
              />
            </div>
          </div>

          {/* Vital Signs */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-black mb-4">Vital Signs</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-black">Pulse</label>
                <input
                  type="text"
                  {...register('vitalSigns.pulse')}
                  className="mt-1 block w-full rounded-md border-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Blood Pressure</label>
                <input
                  type="text"
                  {...register('vitalSigns.bloodPressure')}
                  className="mt-1 block w-full rounded-md border-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Sugar</label>
                <input
                  type="text"
                  {...register('vitalSigns.sugar')}
                  className="mt-1 block w-full rounded-md border-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black px-4 py-2"
                />
              </div>
            </div>
          </div>

          {/* Medicines */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-black">Medicines</h3>
              <div className="flex items-center space-x-4">
                <div>
                  <label className="block text-sm font-medium text-black mr-2">Course Days</label>
                  <input
                    type="number"
                    {...register('courseDays', { min: 1 })}
                    className="w-24 rounded-md border-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black px-4 py-2"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddMedicine}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Medicine
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-300 border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-black font-semibold">Medicine</th>
                    <th className="px-4 py-2 text-black font-semibold">Morning</th>
                    <th className="px-4 py-2 text-black font-semibold">Afternoon</th>
                    <th className="px-4 py-2 text-black font-semibold">Evening</th>
                    <th className="px-4 py-2 text-black font-semibold">Night</th>
                    <th className="px-4 py-2 text-black font-semibold">Quantity</th>
                    <th className="px-4 py-2 text-black font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300">
                  {medicineFields.map((field, index) => (
                    <tr key={field.id} className="bg-white">
                      <td className="px-4 py-2">
                        <div className="flex items-center space-x-2">
                          <input
                            {...register(`medicines.${index}.name`)}
                            readOnly
                            className="w-full rounded-md border-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black px-4 py-2 bg-gray-50"
                          />
                          <button
                            type="button"
                            onClick={() => handleEditMedicine(index)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-center">
                        <input
                          type="checkbox"
                          {...register(`medicines.${index}.morning`)}
                          className="rounded border-gray-400 text-blue-600 focus:ring-blue-500"
                          onChange={(e) => {
                            register(`medicines.${index}.morning`).onChange(e);
                            setTimeout(updateQuantities, 0);
                          }}
                        />
                      </td>
                      <td className="px-4 py-2 text-center">
                        <input
                          type="checkbox"
                          {...register(`medicines.${index}.afternoon`)}
                          className="rounded border-gray-400 text-blue-600 focus:ring-blue-500"
                          onChange={(e) => {
                            register(`medicines.${index}.afternoon`).onChange(e);
                            setTimeout(updateQuantities, 0);
                          }}
                        />
                      </td>
                      <td className="px-4 py-2 text-center">
                        <input
                          type="checkbox"
                          {...register(`medicines.${index}.evening`)}
                          className="rounded border-gray-400 text-blue-600 focus:ring-blue-500"
                          onChange={(e) => {
                            register(`medicines.${index}.evening`).onChange(e);
                            setTimeout(updateQuantities, 0);
                          }}
                        />
                      </td>
                      <td className="px-4 py-2 text-center">
                        <input
                          type="checkbox"
                          {...register(`medicines.${index}.night`)}
                          className="rounded border-gray-400 text-blue-600 focus:ring-blue-500"
                          onChange={(e) => {
                            register(`medicines.${index}.night`).onChange(e);
                            setTimeout(updateQuantities, 0);
                          }}
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          {...register(`medicines.${index}.quantity`)}
                          className="w-full rounded-md border-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black px-4 py-2"
                          placeholder="Qty"
                          readOnly
                        />
                      </td>
                      <td className="px-4 py-2">
                        <button
                          type="button"
                          onClick={() => handleRemoveMedicine(index)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Test Reports */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-black">Test Reports</h3>
              <button
                type="button"
                onClick={() => appendTest({ testName: '', result: '', date: undefined })}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Test Report
              </button>
            </div>

            {testFields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <input
                    {...register(`testReports.${index}.testName`)}
                    placeholder="Test Name"
                    className="mt-1 block w-full rounded-md border-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black px-4 py-2"
                  />
                </div>
                <div>
                  <input
                    {...register(`testReports.${index}.result`)}
                    placeholder="Result"
                    className="mt-1 block w-full rounded-md border-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black px-4 py-2"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="date"
                    {...register(`testReports.${index}.date`)}
                    className="mt-1 block w-full rounded-md border-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black px-4 py-2"
                  />
                  <button
                    type="button"
                    onClick={() => removeTest(index)}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-black">Doctor&apos;s Notes</label>
              <textarea
                {...register('doctorNotes')}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black px-4 py-3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black">Next Visit</label>
              <input
                type="date"
                {...register('nextVisit')}
                className="mt-1 block w-full rounded-md border-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black px-4 py-2"
              />
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium"
            >
              Preview Prescription
            </button>
          </div>
        </div>
      </form>

      {showPreview && formData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="max-w-4xl w-full max-h-[90vh] overflow-auto bg-white rounded-lg">
            <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold text-black">Preview</h3>
              <div className="flex items-center gap-4">
                {saveStatus === 'saving' && (
                  <span className="text-blue-600">Saving prescription...</span>
                )}
                {saveStatus === 'success' && (
                  <span className="text-green-600">Prescription saved successfully!</span>
                )}
                {saveStatus === 'error' && (
                  <div className="text-red-600">
                    <p>Failed to save prescription.</p>
                    {errorMessage && <p className="text-sm">{errorMessage}</p>}
                  </div>
                )}
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-700 hover:text-gray-900 font-medium"
                >
                  Close
                </button>
              </div>
            </div>
            <PrescriptionPDF prescription={formData} />
          </div>
        </div>
      )}

      {showMedicineSelector && (
        <MedicineSelector
          onSelect={handleMedicineSelect}
          onClose={() => {
            setShowMedicineSelector(false);
            setEditingMedicineIndex(null);
          }}
        />
      )}
    </>
  );
} 