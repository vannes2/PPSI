// src/LaporanPDF.js
import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: 'Helvetica', fontSize: 11, color: '#333' },
  title: { fontSize: 24, textAlign: 'center', marginBottom: 20, fontFamily: 'Helvetica-Bold' },
  section: { marginBottom: 15 },
  sectionTitle: { fontSize: 16, marginBottom: 10, fontFamily: 'Helvetica-Bold', backgroundColor: '#EAEBEF', padding: 5, color: '#4A69FF' },
  row: { flexDirection: 'row', marginBottom: 5, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', paddingBottom: 5 },
  label: { width: '40%', fontFamily: 'Helvetica-Bold' },
  value: { width: '60%' },
  kronologi: { textAlign: 'justify', lineHeight: 1.5, marginTop: 5 }
});

const LaporanPDF = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Laporan Pengaduan Kasus</Text>
      <View style={styles.section}><Text style={styles.sectionTitle}>I. Data Korban</Text>
        <View style={styles.row}><Text style={styles.label}>Jenis Kasus:</Text><Text style={styles.value}>{data.jenis_kasus || '-'}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Nama Lengkap:</Text><Text style={styles.value}>{data.nama_korban || '-'}</Text></View>
        <View style={styles.row}><Text style={styles.label}>TTL:</Text><Text style={styles.value}>{`${data.tempat_lahir_korban || '-'}, ${data.tanggal_lahir_korban || '-'}`}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Usia:</Text><Text style={styles.value}>{data.usia_korban || '-'}</Text></View>
      </View>
      <View style={styles.section}><Text style={styles.sectionTitle}>II. Data Pelaku</Text>
        <View style={styles.row}><Text style={styles.label}>Nama Lengkap:</Text><Text style={styles.value}>{data.nama_pelaku || '-'}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Jenis Kelamin:</Text><Text style={styles.value}>{data.jenis_kelamin_pelaku || '-'}</Text></View>
      </View>
      <View style={styles.section}><Text style={styles.sectionTitle}>III. Kronologi & Keterangan</Text>
        <View style={styles.row}><Text style={styles.label}>Tempat Kejadian:</Text><Text style={styles.value}>{data.tempat_kejadian || '-'}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Waktu Kejadian:</Text><Text style={styles.value}>{data.waktu_kejadian || '-'}</Text></View>
        <Text style={styles.label}>Kronologi Kejadian:</Text>
        <Text style={styles.kronologi}>{data.kronologi || 'Tidak ada kronologi yang diberikan.'}</Text>
      </View>
    </Page>
  </Document>
);

export default LaporanPDF;