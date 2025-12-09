import express, { Request, Response } from 'express';
import path from 'path';
import cors from 'cors';
import { loadData } from './dataLoader';
import { UnifiedOrder } from './types';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Load Data
let orders: UnifiedOrder[] = [];
try {
  orders = loadData();
  console.log(`Loaded ${orders.length} orders.`);
} catch (error) {
  console.error("Failed to load data on startup:", error);
}

// API Routes

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Get All Orders (with optional status search)
app.get('/api/orders', (req: Request, res: Response) => {
  const status = req.query.status as string;
  let result = orders;

  if (status) {
    result = orders.filter(o => o.status.toLowerCase() === status.toLowerCase());
  }

  res.json(result);
});

// Search Orders (Dedicated endpoint as per requirements)
app.get('/api/orders/search', (req: Request, res: Response) => {
    const status = req.query.status as string;
    
    if (!status) {
         return res.status(400).json({ message: 'Missing status query parameter' });
    }

    const result = orders.filter(o => o.status.toLowerCase() === status.toLowerCase());
    res.json(result);
});


// Get Order by ID
app.get('/api/orders/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  const order = orders.find(o => o.orderId === id);

  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
});

// Serve Frontend
app.use(express.static(path.join(__dirname, '../../frontend')));

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
