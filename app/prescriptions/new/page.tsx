import PrescriptionForm from '@/app/components/PrescriptionForm';

export default function NewPrescription() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Prescription</h1>
          <p className="mt-2 text-gray-600">Fill in the details below to create a new prescription</p>
        </div>
        <PrescriptionForm />
      </div>
    </main>
  );
} 