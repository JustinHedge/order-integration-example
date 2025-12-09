import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { UnifiedOrder, UnifiedStatus } from './types';

interface OrderA {
  orderID: string;
  customer: string;
  orderDate: string;
  totalAmount: number;
  status: string;
}

interface OrderB {
  order_num: string;
  client_name: string;
  date_placed: string;
  total: number;
  order_status: number;
}

const STATUS_MAP_A: Record<string, UnifiedStatus> = {
  'PEND': 'Pending',
  'PROC': 'Processing',
  'SHIP': 'Shipped',
  'COMP': 'Completed',
  'CANC': 'Cancelled'
};

const STATUS_MAP_B: Record<number, UnifiedStatus> = {
  1: 'Pending',
  2: 'Processing',
  3: 'Shipped',
  4: 'Completed',
  5: 'Cancelled'
};

function normalizeOrderA(order: OrderA): UnifiedOrder {
  return {
    orderId: order.orderID,
    sourceSystem: 'SystemA',
    customerName: order.customer,
    orderDate: order.orderDate,
    totalAmount: order.totalAmount,
    status: STATUS_MAP_A[order.status] || 'Pending' // Fallback or throw error
  };
}

function normalizeOrderB(order: OrderB): UnifiedOrder {
    // Parse MM/DD/YYYY to YYYY-MM-DD
    const [month, day, year] = order.date_placed.split('/');
    const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

  return {
    orderId: order.order_num,
    sourceSystem: 'SystemB',
    customerName: order.client_name,
    orderDate: isoDate,
    totalAmount: Number(order.total),
    status: STATUS_MAP_B[order.order_status] || 'Pending'
  };
}

export function loadData(): UnifiedOrder[] {
  const dataDir = path.join(__dirname, '../../data');
  const orders: UnifiedOrder[] = [];

  // Load System A
  try {
    const rawDataA = fs.readFileSync(path.join(dataDir, 'system_a_orders.json'), 'utf-8');
    const ordersA: OrderA[] = JSON.parse(rawDataA);
    orders.push(...ordersA.map(normalizeOrderA));
  } catch (err) {
    console.error('Error loading System A data:', err);
  }

  // Load System B
  try {
    const rawDataB = fs.readFileSync(path.join(dataDir, 'system_b_orders.csv'), 'utf-8');
    const ordersB: OrderB[] = parse(rawDataB, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });
    orders.push(...ordersB.map(normalizeOrderB));
  } catch (err) {
    console.error('Error loading System B data:', err);
  }

  return orders;
}
