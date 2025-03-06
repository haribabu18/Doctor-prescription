'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaDownload, FaPlus } from 'react-icons/fa';
import { PDFDownloadLink, Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import { Medicine, TestReport } from '@/app/types/prescription';
import { format } from 'date-fns';
import './new/cus.css'

interface Prescription {
  id: string;
  date: string;
  patientName: string;
  age: number;
  phoneNumber?: string;
  courseDays: number;
  createdAt: string;
  medicines: Medicine[];
  testReports: TestReport[];
  doctorNotes?: string;
  nextVisit?: string;
  vitalSigns?: {
    pulse?: string;
    bloodPressure?: string;
    sugar?: string;
  };
}

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontFamily: 'Helvetica',
    fontSize: 11,
    color: '#111827',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  leftHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '50%',
  },
  logo: {
    width: 64,
    height: 64,
    marginRight: 16,
    objectFit: 'contain',
  },
  doctorInfo: {
    marginBottom: 8,
  },
  clinicInfo: {
    width: '40%',
    textAlign: 'right',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#111827',
  },
  subtitle: {
    fontSize: 11,
    color: '#4B5563',
    marginBottom: 2,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    paddingBottom: 4,
    borderBottom: '1 solid #E5E7EB',
    color: '#1F2937',
  },
  patientInfo: {
    flexDirection: 'row',
    marginBottom: 4,
    justifyContent: 'space-between',
    width: '100%',
  },
  infoItem: {
    flexDirection: 'row',
    width: '30%',
  },
  label: {
    color: '#4B5563',
    width: 64,
    fontWeight: 'medium',
  },
  value: {
    color: '#111827',
  },
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    marginTop: 8,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#D1D5DB',
    minHeight: 32,
    borderRadius: 10,
    alignItems: 'center',
  },
  tableHeader: {
    backgroundColor: '#f3f4f6',
  },
  tableCell: {
    padding: 8,
    fontSize: 11,
  },
  tableCellCenter: {
    padding: 8,
    fontSize: 12,
    textAlign: 'center',
    fontWeight: 'semibold',
    color: '#353535',
  },
  checkmark: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#008A43',
  },
  diagnosis: {
    marginTop: 4,
    color: '#111827',
    fontSize: 11,
    lineHeight: 1.4,
  },
  nextVisit: {
    marginTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 8,
  },
  signature: {
    width: 160,
    height: 40,
    marginBottom: 4,
    alignSelf: 'center',
    objectFit: 'contain',
  },
  signatureText: {
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
    alignSelf: 'center',
    color: '#111827',
    width: 160,
  },
  signatureSubText: {
    fontSize: 10,
    textAlign: 'center',
    alignSelf: 'center',
    color: '#4B5563',
    width: 160,
  },
  date: {
    fontSize: 12,
    marginBottom: 16,
    textAlign: 'right',
    color: '#4B5563',
    fontWeight: 'medium',
  },
  checkmarkImage: {
    width: 12,
    height: 12,
    margin: 'auto',
  },
});

const PrescriptionPDFDocument = ({ prescription }: { prescription: Prescription }) => {
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return format(date, 'dd/MM/yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateStr;
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Date */}
        <Text style={styles.date}>Date: {formatDate(prescription.date)}</Text>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.leftHeader}>
            <Image src="/LOGO.png" style={styles.logo} />
            <View style={styles.doctorInfo}>
              <Text style={styles.title}>Dr. G Sailendra Mohan</Text>
              <Text style={styles.subtitle}>BAMS</Text>
              <Text style={styles.subtitle}>Reg. No: 12345</Text>
            </View>
          </View>
          <View style={styles.clinicInfo}>
            <Text style={styles.title}>Sailendra Ayurveda clinic</Text>
            <Text style={styles.subtitle}>Sree Ramula peta</Text>
            <Text style={styles.subtitle}>Moragudi - 516434</Text>
            <Text style={styles.subtitle}>Phone: +91 76762 06183</Text>
          </View>
        </View>

        {/* Patient Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Patient Information</Text>
          <View style={styles.patientInfo}>
            <View style={styles.infoItem}>
              <Text style={styles.label}>Name:</Text>
              <Text style={styles.value}>{prescription.patientName}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.label}>Age:</Text>
              <Text style={styles.value}>{prescription.age}</Text>
            </View>
            {prescription.phoneNumber && (
              <View style={styles.infoItem}>
                <Text style={styles.label}>Phone:</Text>
                <Text style={styles.value}>{prescription.phoneNumber}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Vital Signs */}
        {prescription.vitalSigns && 
          (prescription.vitalSigns.pulse || 
           prescription.vitalSigns.bloodPressure || 
           prescription.vitalSigns.sugar) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vital Signs</Text>
            <View style={styles.patientInfo}>
              {prescription.vitalSigns.pulse && (
                <View style={styles.infoItem}>
                  <Text style={styles.label}>Pulse:</Text>
                  <Text style={styles.value}>{prescription.vitalSigns.pulse}</Text>
                </View>
              )}
              {prescription.vitalSigns.bloodPressure && (
                <View style={styles.infoItem}>
                  <Text style={styles.label}>BP:</Text>
                  <Text style={styles.value}>{prescription.vitalSigns.bloodPressure}</Text>
                </View>
              )}
              {prescription.vitalSigns.sugar && (
                <View style={styles.infoItem}>
                  <Text style={styles.label}>Sugar:</Text>
                  <Text style={styles.value}>{prescription.vitalSigns.sugar}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Medicines */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medicines</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <View style={{ flex: 2 }}><Text style={styles.tableCell}>Medicine</Text></View>
              <View style={{ flex: 1 }}><Text style={styles.tableCellCenter}>Morning</Text></View>
              <View style={{ flex: 1 }}><Text style={styles.tableCellCenter}>Afternoon</Text></View>
              <View style={{ flex: 1 }}><Text style={styles.tableCellCenter}>Evening</Text></View>
              <View style={{ flex: 1 }}><Text style={styles.tableCellCenter}>Night</Text></View>
              <View style={{ flex: 1 }}><Text style={styles.tableCellCenter}>Qty</Text></View>
            </View>
            {prescription.medicines.map((medicine, index) => (
              <View key={index} style={styles.tableRow}>
                <View style={{ flex: 2 }}><Text style={styles.tableCell}>{medicine.name}</Text></View>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                  {medicine.morning && <Image src="/checkmark.png" style={styles.checkmarkImage} />}
                </View>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                  {medicine.afternoon && <Image src="/checkmark.png" style={styles.checkmarkImage} />}
                </View>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                  {medicine.evening && <Image src="/checkmark.png" style={styles.checkmarkImage} />}
                </View>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                  {medicine.night && <Image src="/checkmark.png" style={styles.checkmarkImage} />}
                </View>
                <View style={{ flex: 1 }}><Text style={styles.tableCellCenter}>{medicine.quantity || '-'}</Text></View>
              </View>
            ))}
          </View>
        </View>

        {/* Test Results */}
        {prescription.testReports && prescription.testReports.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Test Reports</Text>
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <View style={{ flex: 2 }}><Text style={styles.tableCell}>Test</Text></View>
                <View style={{ flex: 2 }}><Text style={styles.tableCell}>Result</Text></View>
                <View style={{ flex: 1 }}><Text style={styles.tableCell}>Date</Text></View>
              </View>
              {prescription.testReports.map((test, index) => (
                <View key={index} style={styles.tableRow}>
                  <View style={{ flex: 2 }}><Text style={styles.tableCell}>{test.testName}</Text></View>
                  <View style={{ flex: 2 }}><Text style={styles.tableCell}>{test.result}</Text></View>
                  <View style={{ flex: 1 }}><Text style={styles.tableCell}>
                    {test.date ? formatDate(test.date) : '-'}
                  </Text></View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Doctor's Notes */}
        {prescription.doctorNotes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Doctor&apos;s Notes</Text>
            <Text style={styles.diagnosis}>{prescription.doctorNotes}</Text>
          </View>
        )}

        {/* Next Visit */}
        {prescription.nextVisit && (
          <View style={styles.nextVisit}>
            <Text style={styles.subtitle}>
              Next Visit: {formatDate(prescription.nextVisit)}
            </Text>
          </View>
        )}

        {/* Signature */}
        <View style={{ marginTop: 40, alignItems: 'center', width: 160, alignSelf: 'flex-end' }}>
          <Image src="/sign.png" style={styles.signature} />
          <Text style={styles.signatureText}>Dr. G Sailendra Mohan</Text>
          <Text style={styles.signatureSubText}>BAMS</Text>
        </View>
      </Page>
    </Document>
  );
};

export default function PrescriptionsList() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const response = await fetch('/api/prescriptions');
        if (!response.ok) throw new Error('Failed to fetch prescriptions');
        const data = await response.json();
        setPrescriptions(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load prescriptions');
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-blue-400">Loading prescriptions...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-5 sm:mb-0 md:text-3xl">Prescriptions</h1>
          <Link
            href="/prescriptions/new"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2 text-sm md:text-md"
          >
            <FaPlus />
            <span>New</span>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Age
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Course Days
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {prescriptions.map((prescription) => (
                <tr key={prescription.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(prescription.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {prescription.patientName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden sm:table-cell">
                    {prescription.age}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
                    {prescription.phoneNumber || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
                    {prescription.courseDays} days
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm flex flex-row justify-end font-medium">
                    <PDFDownloadLink
                      document={<PrescriptionPDFDocument prescription={prescription} />}
                      fileName={`prescription-${prescription.patientName}-${formatDate(prescription.date)}.pdf`}
                      className="text-blue-600 hover:text-blue-900 mr-4 block h-max-content w-max-content"
                      style={{ height: "max-content", display:"block", width:"max-content" }}
                    >
                      {({ loading }) => (
                        <>
                          
                          {loading ? 'Loading...' : <p className="flex flex-row items-center w-max-content justify-end"> <FaDownload className="inline-block mr-1" /> <span className='hidden md:block'> Download</span></p>}
                        </>
                      )}
                    </PDFDownloadLink>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 