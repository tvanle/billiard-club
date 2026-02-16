import express, { Request, Response } from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { PrismaClient, SessionStatus } from '@prisma/client';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: { origin: '*', methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] },
});

const prisma = new PrismaClient();
const PORT = process.env.PORT || 4002;
const TABLE_SERVICE_URL = process.env.TABLE_SERVICE_URL || 'http://localhost:4001';

// Middleware
app.use(cors());
app.use(express.json());

// Calculate session cost
function calculateCost(startTime: Date, hourlyRate: number, endTime?: Date): number {
    const end = endTime || new Date();
    const durationMs = end.getTime() - startTime.getTime();
    const durationHours = durationMs / (1000 * 60 * 60);
    return Math.ceil(durationHours * hourlyRate);
}

// Health check
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', service: 'session-service' });
});

// Get all sessions
app.get('/sessions', async (req: Request, res: Response) => {
    try {
        const { status, tableId } = req.query;
        const where: any = {};
        if (status) where.status = status;
        if (tableId) where.tableId = tableId;

        const sessions = await prisma.session.findMany({
            where,
            orderBy: { startTime: 'desc' },
        });

        // Add current cost for active sessions
        const sessionsWithCost = sessions.map((session) => ({
            ...session,
            currentCost: session.status === 'ACTIVE'
                ? calculateCost(session.startTime, session.hourlyRate)
                : session.totalCost,
        }));

        res.json({ success: true, data: sessionsWithCost });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch sessions' });
    }
});

// Get session by ID
app.get('/sessions/:id', async (req: Request, res: Response) => {
    try {
        const session = await prisma.session.findUnique({
            where: { id: req.params.id },
        });
        if (!session) {
            return res.status(404).json({ success: false, error: 'Session not found' });
        }
        const currentCost = session.status === 'ACTIVE'
            ? calculateCost(session.startTime, session.hourlyRate)
            : session.totalCost;
        res.json({ success: true, data: { ...session, currentCost } });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch session' });
    }
});

// Start new session
app.post('/sessions', async (req: Request, res: Response) => {
    try {
        const { tableId, customerId, staffId, hourlyRate, notes } = req.body;

        // Check if table already has active session
        const existingSession = await prisma.session.findFirst({
            where: { tableId, status: 'ACTIVE' },
        });
        if (existingSession) {
            return res.status(400).json({
                success: false,
                error: 'Table already has an active session'
            });
        }

        const session = await prisma.session.create({
            data: {
                tableId,
                customerId,
                staffId,
                hourlyRate: hourlyRate || 50000,
                notes,
            },
        });

        // Update table status via Table Service
        try {
            await fetch(`${TABLE_SERVICE_URL}/tables/${tableId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'OCCUPIED' }),
            });
        } catch (e) {
            console.error('Failed to update table status:', e);
        }

        io.emit('session:started', session);
        res.status(201).json({ success: true, data: session });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to create session' });
    }
});

// End session
app.patch('/sessions/:id/end', async (req: Request, res: Response) => {
    try {
        const session = await prisma.session.findUnique({
            where: { id: req.params.id },
        });
        if (!session) {
            return res.status(404).json({ success: false, error: 'Session not found' });
        }
        if (session.status !== 'ACTIVE') {
            return res.status(400).json({ success: false, error: 'Session is not active' });
        }

        const endTime = new Date();
        const totalCost = calculateCost(session.startTime, session.hourlyRate, endTime);

        const updatedSession = await prisma.session.update({
            where: { id: req.params.id },
            data: {
                status: 'COMPLETED',
                endTime,
                totalCost,
            },
        });

        // Update table status via Table Service
        try {
            await fetch(`${TABLE_SERVICE_URL}/tables/${session.tableId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'AVAILABLE' }),
            });
        } catch (e) {
            console.error('Failed to update table status:', e);
        }

        io.emit('session:ended', updatedSession);
        res.json({ success: true, data: updatedSession });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to end session' });
    }
});

// Get session cost
app.get('/sessions/:id/cost', async (req: Request, res: Response) => {
    try {
        const session = await prisma.session.findUnique({
            where: { id: req.params.id },
        });
        if (!session) {
            return res.status(404).json({ success: false, error: 'Session not found' });
        }

        const currentCost = session.status === 'ACTIVE'
            ? calculateCost(session.startTime, session.hourlyRate)
            : session.totalCost;
        const duration = Math.ceil(
            ((session.endTime || new Date()).getTime() - session.startTime.getTime()) / (1000 * 60)
        );

        res.json({
            success: true,
            data: {
                sessionId: session.id,
                duration,
                hourlyRate: session.hourlyRate,
                currentCost,
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to calculate cost' });
    }
});

// Cancel session
app.patch('/sessions/:id/cancel', async (req: Request, res: Response) => {
    try {
        const session = await prisma.session.findUnique({
            where: { id: req.params.id },
        });
        if (!session) {
            return res.status(404).json({ success: false, error: 'Session not found' });
        }

        const updatedSession = await prisma.session.update({
            where: { id: req.params.id },
            data: { status: 'CANCELLED', endTime: new Date() },
        });

        // Update table status
        try {
            await fetch(`${TABLE_SERVICE_URL}/tables/${session.tableId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'AVAILABLE' }),
            });
        } catch (e) {
            console.error('Failed to update table status:', e);
        }

        io.emit('session:cancelled', updatedSession);
        res.json({ success: true, data: updatedSession });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to cancel session' });
    }
});

// Socket.io
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
});

// Start server
httpServer.listen(PORT, () => {
    console.log(`⏱️ Session Service running on port ${PORT}`);
});

process.on('SIGTERM', async () => {
    await prisma.$disconnect();
    process.exit(0);
});
