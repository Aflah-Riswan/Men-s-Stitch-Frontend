
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', fontSize: 11, color: '#333' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  brand: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  companyInfo: { textAlign: 'right', fontSize: 10, color: '#666' },
  
  billTo: { marginTop: 20, marginBottom: 20 },
  billTitle: { fontSize: 12, fontWeight: 'bold', marginBottom: 5 },
  
  table: { display: 'table', width: 'auto', borderStyle: 'solid', borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 20 },
  tableRow: { margin: 'auto', flexDirection: 'row' },
  tableHeader: { backgroundColor: '#f9fafb', borderBottomWidth: 1, borderColor: '#e5e7eb', fontWeight: 'bold' },
  tableCol: { width: '25%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0, borderColor: '#e5e7eb' }, 
  tableCell: { margin: 5, fontSize: 10 },
  
  totalsSection: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 },
  totalRow: { flexDirection: 'row', marginBottom: 5 },
  totalLabel: { width: 100, textAlign: 'right', paddingRight: 10, fontWeight: 'bold' },
  totalValue: { width: 100, textAlign: 'right' },
  
  footer: { position: 'absolute', bottom: 30, left: 40, right: 40, textAlign: 'center', fontSize: 10, color: '#9ca3af', borderTopWidth: 1, borderColor: '#e5e7eb', paddingTop: 10 }
});

const InvoiceDocument = ({ order }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>Men's Stitch</Text>
          <Text style={{ marginTop: 5 }}>Order Invoice</Text>
        </View>
        <View style={styles.companyInfo}>
          <Text>Men's Stitch Inc.</Text>
          <Text>123 Fashion Street</Text>
          <Text>Kerala, India - 695001</Text>
          <Text>support@mensstitch.com</Text>
        </View>
      </View>

      {/* Order & Customer Details */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={styles.billTo}>
          <Text style={styles.billTitle}>Bill To:</Text>
          <Text>{order.shippingAddress.fullName}</Text>
          <Text>{order.shippingAddress.street}</Text>
          <Text>{order.shippingAddress.city}, {order.shippingAddress.state}</Text>
          <Text>{order.shippingAddress.pincode}</Text>
          <Text>Phone: {order.shippingAddress.phone}</Text>
        </View>
        <View style={styles.billTo}>
            <Text style={styles.billTitle}>Order Details:</Text>
            <Text>Order ID: {order.orderId}</Text>
            <Text>Date: {new Date(order.createdAt).toLocaleDateString()}</Text>
            <Text>Payment: {order.payment.method.toUpperCase()} ({order.payment.status})</Text>
        </View>
      </View>

      {/* Table Header */}
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <View style={[styles.tableCol, { width: '40%' }]}>
            <Text style={styles.tableCell}>Item</Text>
          </View>
          <View style={[styles.tableCol, { width: '20%' }]}>
            <Text style={styles.tableCell}>Price</Text>
          </View>
          <View style={[styles.tableCol, { width: '20%' }]}>
            <Text style={styles.tableCell}>Quantity</Text>
          </View>
          <View style={[styles.tableCol, { width: '20%' }]}>
            <Text style={styles.tableCell}>Total</Text>
          </View>
        </View>

        {/* Table Rows */}
        {order.items.map((item, index) => (
          <View style={styles.tableRow} key={index}>
            <View style={[styles.tableCol, { width: '40%' }]}>
              <Text style={styles.tableCell}>{item.name} ({item.size})</Text>
            </View>
            <View style={[styles.tableCol, { width: '20%' }]}>
              <Text style={styles.tableCell}>₹{item.price}</Text>
            </View>
            <View style={[styles.tableCol, { width: '20%' }]}>
              <Text style={styles.tableCell}>{item.quantity}</Text>
            </View>
            <View style={[styles.tableCol, { width: '20%' }]}>
              <Text style={styles.tableCell}>₹{item.price * item.quantity}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Totals */}
      <View style={styles.totalsSection}>
        <View>
            <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>₹{order.subtotal}</Text>
            </View>
            <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Shipping:</Text>
            <Text style={styles.totalValue}>₹{order.shippingFee}</Text>
            </View>
            <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Discount:</Text>
            <Text style={[styles.totalValue, { color: 'red' }]}>-₹{order.discount}</Text>
            </View>
            <View style={[styles.totalRow, { marginTop: 5, borderTopWidth: 1, borderColor: '#ccc', paddingTop: 5 }]}>
            <Text style={[styles.totalLabel, { fontSize: 14 }]}>Grand Total:</Text>
            <Text style={[styles.totalValue, { fontSize: 14 }]}>₹{order.totalAmount}</Text>
            </View>
        </View>
      </View>

      {/* Footer */}
      <Text style={styles.footer}>
        Thank you for shopping with Men's Stitch! | Returns valid within 7 days of delivery.
      </Text>
    </Page>
  </Document>
);

export default InvoiceDocument;