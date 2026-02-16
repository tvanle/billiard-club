import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient, PaymentMethod, PaymentStatus } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4005;
const SESSION_SERVICE_URL = process.env.SESSION_SERVICE_URL || 'http://localhost:4002';
const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://localhost:4003';

// Middleware
app.use(cors());
app.use(express.json());

// Generate invoice number
function generateInvoiceNo(): string {
    const date = new Date();
    const dateStr = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `INV-${dateStr}-${random}`;
}

// Health check
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', service: 'payment-service' });
});

// ==================== PAYMENTS ====================

// Get all payments
app.get('/payments', async (req: Request, res: Response) => {
    try {
        const { status, method, date } = req.query;
        const where: any = {};
        if (status) where.status = status;
        if (method) where.method = method;
        if (date) {
            const d = new Date(date as string);
            where.createdAt = {
                gte: new Date(d.setHours(0, 0, 0, 0)),
                lt: new Date(d.setHours(23, 59, 59, 999)),
            };
        }

        const payments = await prisma.payment.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
        res.json({ success: true, data: payments });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch payments' });
    }
});

// Get payment by ID
app.get('/payments/:id', async (req: Request, res: Response) => {
    try {
        const payment = await prisma.payment.findUnique({
            where: { id: req.params.id },
        });
        if (!payment) {
            return res.status(404).json({ success: false, error: 'Payment not found' });
        }
        res.json({ success: true, data: payment });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch payment' });
    }
});

// Create payment (checkout session)
app.post('/payments', async (req: Request, res: Response) => {
    try {
        const { sessionId, customerId, staffId, method, discount, notes } = req.body;

        // Get session cost from Session Service
        let sessionAmount = 0;
        try {
            const sessionRes = await fetch(`${SESSION_SERVICE_URL}/sessions/${sessionId}/cost`);
            const sessionData = await sessionRes.json() as any;
            if (sessionData.success) {
                sessionAmount = sessionData.data.currentCost;
            }
        } catch (e) {
            console.error('Failed to get session cost:', e);
        }

        // Get orders total from Order Service
        let orderAmount = 0;
        try {
            const ordersRes = await fetch(`${ORDER_SERVICE_URL}/sessions/${sessionId}/orders`);
            const ordersData = await ordersRes.json() as any;
            if (ordersData.success) {
                orderAmount = ordersData.data.totalAmount;
            }
        } catch (e) {
            console.error('Failed to get orders total:', e);
        }

        const totalAmount = sessionAmount + orderAmount - (discount || 0);

        const payment = await prisma.payment.create({
            data: {
                sessionId,
                customerId,
                staffId,
                sessionAmount,
                orderAmount,
                discount: discount || 0,
                totalAmount,
                method: method || 'CASH',
                status: 'PENDING',
                notes,
            },
        });

        res.status(201).json({ success: true, data: payment });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to create payment' });
    }
});

// Complete payment
app.patch('/payments/:id/complete', async (req: Request, res: Response) => {
    try {
        const { method } = req.body;

        const payment = await prisma.payment.update({
            where: { id: req.params.id },
            data: {
                status: 'COMPLETED',
                method: method || undefined,
            },
        });

        // End session via Session Service
        try {
            await fetch(`${SESSION_SERVICE_URL}/sessions/${payment.sessionId}/end`, {
                method: 'PATCH',
            });
        } catch (e) {
            console.error('Failed to end session:', e);
        }

        // Create invoice
        const invoice = await prisma.invoice.create({
            data: {
                paymentId: payment.id,
                invoiceNumber: generateInvoiceNo(),
                items: {
                    sessionAmount: payment.sessionAmount,
                    orderAmount: payment.orderAmount,
                    discount: payment.discount,
                },
                subtotal: payment.sessionAmount + payment.orderAmount,
                discount: payment.discount,
                total: payment.totalAmount,
            },
        });

        res.json({ success: true, data: { payment, invoice } });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to complete payment' });
    }
});

// Refund payment
app.patch('/payments/:id/refund', async (req: Request, res: Response) => {
    try {
        const { notes } = req.body;
        const payment = await prisma.payment.update({
            where: { id: req.params.id },
            data: { status: 'REFUNDED', notes },
        });
        res.json({ success: true, data: payment });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to refund payment' });
    }
});

// ==================== INVOICES ====================

// Get invoice
app.get('/invoices/:id', async (req: Request, res: Response) => {
    try {
        const invoice = await prisma.invoice.findUnique({
            where: { id: req.params.id },
        });
        if (!invoice) {
            return res.status(404).json({ success: false, error: 'Invoice not found' });
        }
        res.json({ success: true, data: invoice });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch invoice' });
    }
});

// Get invoice by payment ID
app.get('/payments/:paymentId/invoice', async (req: Request, res: Response) => {
    try {
        const invoice = await prisma.invoice.findUnique({
            where: { paymentId: req.params.paymentId },
        });
        if (!invoice) {
            return res.status(404).json({ success: false, error: 'Invoice not found' });
        }
        res.json({ success: true, data: invoice });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch invoice' });
    }
});

// ==================== REPORTS ====================

// Get daily report
app.get('/reports/daily', async (req: Request, res: Response) => {
    try {
        const { date } = req.query;
        const targetDate = date ? new Date(date as string) : new Date();
        targetDate.setHours(0, 0, 0, 0);

        const startOfDay = new Date(targetDate);
        const endOfDay = new Date(targetDate);
        endOfDay.setHours(23, 59, 59, 999);

        const payments = await prisma.payment.findMany({
            where: {
                status: 'COMPLETED',
                createdAt: { gte: startOfDay, lte: endOfDay },
            },
        });

        const report = {
            date: targetDate.toISOString().split('T')[0],
            totalPayments: payments.length,
            sessionRevenue: payments.reduce((sum, p) => sum + p.sessionAmount, 0),
            orderRevenue: payments.reduce((sum, p) => sum + p.orderAmount, 0),
            totalDiscount: payments.reduce((sum, p) => sum + p.discount, 0),
            totalRevenue: payments.reduce((sum, p) => sum + p.totalAmount, 0),
            byMethod: {
                CASH: payments.filter(p => p.method === 'CASH').reduce((sum, p) => sum + p.totalAmount, 0),
                CARD: payments.filter(p => p.method === 'CARD').reduce((sum, p) => sum + p.totalAmount, 0),
                TRANSFER: payments.filter(p => p.method === 'TRANSFER').reduce((sum, p) => sum + p.totalAmount, 0),
                MOMO: payments.filter(p => p.method === 'MOMO').reduce((sum, p) => sum + p.totalAmount, 0),
                ZALOPAY: payments.filter(p => p.method === 'ZALOPAY').reduce((sum, p) => sum + p.totalAmount, 0),
            },
        };

        res.json({ success: true, data: report });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to generate report' });
    }
});

// Get monthly report
app.get('/reports/monthly', async (req: Request, res: Response) => {
    try {
        const { year, month } = req.query;
        const y = parseInt(year as string) || new Date().getFullYear();
        const m = parseInt(month as string) || new Date().getMonth() + 1;

        const startOfMonth = new Date(y, m - 1, 1);
        const endOfMonth = new Date(y, m, 0, 23, 59, 59, 999);

        const payments = await prisma.payment.findMany({
            where: {
                status: 'COMPLETED',
                createdAt: { gte: startOfMonth, lte: endOfMonth },
            },
        });

        // Group by day
        const dailyData: { [key: string]: number } = {};
        payments.forEach(p => {
            const day = p.createdAt.toISOString().split('T')[0];
            dailyData[day] = (dailyData[day] || 0) + p.totalAmount;
        });

        const report = {
            year: y,
            month: m,
            totalPayments: payments.length,
            totalRevenue: payments.reduce((sum, p) => sum + p.totalAmount, 0),
            sessionRevenue: payments.reduce((sum, p) => sum + p.sessionAmount, 0),
            orderRevenue: payments.reduce((sum, p) => sum + p.orderAmount, 0),
            dailyData: Object.entries(dailyData).map(([date, amount]) => ({ date, amount })),
        };

        res.json({ success: true, data: report });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to generate monthly report' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`💳 Payment Service running on port ${PORT}`);
});

process.on('SIGTERM', async () => {
    await prisma.$disconnect();
    process.exit(0);
});
