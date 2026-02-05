import express, { Request, Response } from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: { origin: '*', methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] },
});

const prisma = new PrismaClient();
const PORT = process.env.PORT || 4001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', service: 'table-service' });
});

// Get all tables
app.get('/tables', async (req: Request, res: Response) => {
    try {
        const { type, status } = req.query;
        const where: any = {};
        if (type) where.type = type;
        if (status) where.status = status;

        const tables = await prisma.table.findMany({
            where,
            orderBy: { name: 'asc' },
        });
        res.json({ success: true, data: tables });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch tables' });
    }
});

// Get table by ID
app.get('/tables/:id', async (req: Request, res: Response) => {
    try {
        const table = await prisma.table.findUnique({
            where: { id: req.params.id },
        });
        if (!table) {
            return res.status(404).json({ success: false, error: 'Table not found' });
        }
        res.json({ success: true, data: table });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch table' });
    }
});

// Create table
app.post('/tables', async (req: Request, res: Response) => {
    try {
        const { name, type, hourlyRate, location, description } = req.body;
        const table = await prisma.table.create({
            data: { name, type, hourlyRate, location, description },
        });
        io.emit('table:created', table);
        res.status(201).json({ success: true, data: table });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to create table' });
    }
});

// Update table
app.put('/tables/:id', async (req: Request, res: Response) => {
    try {
        const { name, type, hourlyRate, location, description, status } = req.body;
        const table = await prisma.table.update({
            where: { id: req.params.id },
            data: { name, type, hourlyRate, location, description, status },
        });
        io.emit('table:updated', table);
        res.json({ success: true, data: table });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to update table' });
    }
});

// Update table status
app.patch('/tables/:id/status', async (req: Request, res: Response) => {
    try {
        const { status } = req.body;
        const table = await prisma.table.update({
            where: { id: req.params.id },
            data: { status },
        });
        io.emit('table:status:changed', table);
        res.json({ success: true, data: table });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to update table status' });
    }
});

// Delete table
app.delete('/tables/:id', async (req: Request, res: Response) => {
    try {
        await prisma.table.delete({ where: { id: req.params.id } });
        io.emit('table:deleted', { id: req.params.id });
        res.json({ success: true, message: 'Table deleted' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to delete table' });
    }
});

// Socket.io connection
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
});

// Start server
httpServer.listen(PORT, () => {
    console.log(`🎱 Table Service running on port ${PORT}`);
});

process.on('SIGTERM', async () => {
    await prisma.$disconnect();
    process.exit(0);
});
