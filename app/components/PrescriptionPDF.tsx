'use client';

import { Prescription } from '../types/prescription';
import { format, parse } from 'date-fns';
import { PDFDownloadLink, Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';

// Define styles for PDF
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
    borderRadius : 10,
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

// PDF Document Component
const PrescriptionPDFDocument = ({ prescription }: { prescription: Prescription }) => {
  const formatDate = (dateStr: string) => {
    const date = parse(dateStr, 'yyyy-MM-dd', new Date());
    return format(date, 'dd/MM/yyyy');
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

// Main Preview Component
export default function PrescriptionPreview({ prescription }: { prescription: Prescription }) {
  const formatDate = (dateStr: string) => {
    const date = parse(dateStr, 'yyyy-MM-dd', new Date());
    return format(date, 'dd/MM/yyyy');
  };

  return (
    <div className="relative">
      {/* Download Button */}
      <div className="absolute top-4 left-4">
        <PDFDownloadLink
          document={<PrescriptionPDFDocument prescription={prescription} />}
          fileName={`prescription-${formatDate(prescription.date)}.pdf`}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          {({ loading }) => (loading ? 'Loading...' : 'Download PDF')}
        </PDFDownloadLink>
      </div>

      {/* Preview Content */}
      <div className="w-full bg-white p-8">
        {/* Date */}
        <div className="text-right mb-4">
          <p className="text-gray-600 font-semibold text-lg">Date: {formatDate(prescription.date)}</p>
        </div>

        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          {/* Logo and Name */}
          <div className="flex items-center">
            <div className="mr-4">
              <img 
                src="/LOGO.png" 
                alt="Clinic Logo" 
                className="h-16 w-16 object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dr. G Sailendra Mohan</h1>
              <p className="text-gray-600">BAMS</p>
              <p className="text-gray-600">Reg. No: 12345</p>
            </div>
          </div>

          {/* Clinic Info */}
          <div className="text-right">
            <h2 className="text-xl font-bold text-gray-900">Sailendra Ayurveda clinic</h2>
            <p className="text-gray-600">Sree Ramula peta</p>
            <p className="text-gray-600">Moragudi - 516434</p>
            <p className="text-gray-600">Phone: +91 76762 06183</p>
          </div>
        </div>

        {/* Patient Information */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">Patient Information</h2>
          <div className="grid grid-cols-3 gap-6">
            <div className="flex items-center">
              <span className="w-16 font-semibold text-gray-600">Name:</span>
              <span className="text-gray-900">{prescription.patientName}</span>
            </div>
            <div className="flex items-center">
              <span className="w-16 font-semibold text-gray-600">Age:</span>
              <span className="text-gray-900">{prescription.age}</span>
            </div>
            {prescription.phoneNumber && (
              <div className="flex items-center">
                <span className="w-16 font-semibold text-gray-600">Phone:</span>
                <span className="text-gray-900">{prescription.phoneNumber}</span>
              </div>
            )}
          </div>
        </div>

        {/* Vital Signs */}
        {prescription.vitalSigns && 
         (prescription.vitalSigns.pulse || 
          prescription.vitalSigns.bloodPressure || 
          prescription.vitalSigns.sugar) && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">Vital Signs</h2>
            <div className="grid grid-cols-3 gap-4">
              {prescription.vitalSigns.pulse && (
                <div>
                  <span className="text-gray-600">Pulse: </span>
                  <span className="font-semibold text-gray-800">{prescription.vitalSigns.pulse}</span>
                </div>
              )}
              {prescription.vitalSigns.bloodPressure && (
                <div>
                  <span className="text-gray-600">BP: </span>
                  <span className="font-semibold text-gray-800">{prescription.vitalSigns.bloodPressure}</span>
                </div>
              )}
              {prescription.vitalSigns.sugar && (
                <div>
                  <span className="text-gray-600">Sugar: </span>
                  <span className="font-semibold text-gray-800">{prescription.vitalSigns.sugar}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Medicines */}
        {prescription.medicines.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-2 pb-2 border-b">Medicines</h2>
            {prescription.courseDays && (
              <p className="text-sm text-gray-600 mb-2">Course: {prescription.courseDays} days</p>
            )}
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="w-1/2 px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase">Medicine</th>
                    <th className="w-1/8 px-3 py-4 text-center text-sm font-bold text-gray-900 uppercase">Morning</th>
                    <th className="w-1/8 px-3 py-4 text-center text-sm font-bold text-gray-900 uppercase">Afternoon</th>
                    <th className="w-1/8 px-3 py-4 text-center text-sm font-bold text-gray-900 uppercase">Evening</th>
                    <th className="w-1/8 px-3 py-4 text-center text-sm font-bold text-gray-900 uppercase">Night</th>
                    <th className="w-1/8 px-3 py-4 text-center text-sm font-bold text-gray-900 uppercase">Qty</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-300">
                  {prescription.medicines.map((medicine, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{medicine.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-bold text-blue-500">
                        {medicine.morning ? '✓' : ''}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-bold text-blue-500">
                        {medicine.afternoon ? '✓' : ''}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-bold text-blue-500">
                        {medicine.evening ? '✓' : ''}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-bold text-blue-500">
                        {medicine.night ? '✓' : ''}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                        {medicine.quantity || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Test Reports */}
        {prescription.testReports && prescription.testReports.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">Test Reports</h2>
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {prescription.testReports.map((test, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{test.testName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{test.result}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {test.date ? formatDate(test.date) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Doctor's Notes */}
        {prescription.doctorNotes && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">Doctor&apos;s Notes</h2>
            <p className="text-gray-800 whitespace-pre-wrap">{prescription.doctorNotes}</p>
          </div>
        )}

        {/* Next Visit */}
        {prescription.nextVisit && (
          <div className="mt-8 pt-4 border-t">
            <div className="flex">
              <span className="font-semibold text-gray-600">Next Visit:</span>
              <span className="ml-2 text-gray-800">
                {formatDate(prescription.nextVisit)}
              </span>
            </div>
          </div>
        )}

        {/* Doctor's Signature */}
        <div className="mt-12 text-right">
          <div className="inline-block text-center" style={{ width: '160px' }}>
            <img 
              src="/sign.png" 
              alt="Doctor's Signature" 
              className="h-10 w-40 object-contain mb-2"
            />
            <p className="text-gray-900 text-sm font-semibold whitespace-nowrap">Dr. G Sailendra Mohan</p>
            <p className="text-gray-600 text-xs">BAMS</p>
          </div>
        </div>
      </div>
    </div>
  );
} 