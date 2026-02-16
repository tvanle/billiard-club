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
const PORT = process.env.PORT || 4003;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', service: 'order-service' });
});

// ==================== CATEGORIES ====================

// Get all categories
app.get('/categories', async (req: Request, res: Response) => {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { sortOrder: 'asc' },
            include: { _count: { select: { items: true } } },
        });
        res.json({ success: true, data: categories });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch categories' });
    }
});

// Create category
app.post('/categories', async (req: Request, res: Response) => {
    try {
        const { name, description, icon, sortOrder } = req.body;
        const category = await prisma.category.create({
            data: { name, description, icon, sortOrder },
        });
        res.status(201).json({ success: true, data: category });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to create category' });
    }
});

// Update category
app.put('/categories/:id', async (req: Request, res: Response) => {
    try {
        const { name, description, icon, sortOrder } = req.body;
        const category = await prisma.category.update({
            where: { id: req.params.id },
            data: { name, description, icon, sortOrder },
        });
        res.json({ success: true, data: category });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to update category' });
    }
});

// Delete category
app.delete('/categories/:id', async (req: Request, res: Response) => {
    try {
        await prisma.category.delete({ where: { id: req.params.id } });
        res.json({ success: true, message: 'Category deleted' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to delete category' });
    }
});

// ==================== MENU ITEMS ====================

// Get all menu items
app.get('/menu-items', async (req: Request, res: Response) => {
    try {
        const { categoryId, isAvailable } = req.query;
        const where: any = {};
        if (categoryId) where.categoryId = categoryId;
        if (isAvailable !== undefined) where.isAvailable = isAvailable === 'true';

        const menuItems = await prisma.menuItem.findMany({
            where,
            include: { category: true },
            orderBy: { name: 'asc' },
        });
        res.json({ success: true, data: menuItems });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch menu items' });
    }
});

// Create menu item
app.post('/menu-items', async (req: Request, res: Response) => {
    try {
        const { categoryId, name, description, price, image, isAvailable } = req.body;
        const menuItem = await prisma.menuItem.create({
            data: { categoryId, name, description, price, image, isAvailable },
        });
        res.status(201).json({ success: true, data: menuItem });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to create menu item' });
    }
});

// Update menu item
app.put('/menu-items/:id', async (req: Request, res: Response) => {
    try {
        const { categoryId, name, description, price, image, isAvailable } = req.body;
        const menuItem = await prisma.menuItem.update({
            where: { id: req.params.id },
            data: { categoryId, name, description, price, image, isAvailable },
        });
        res.json({ success: true, data: menuItem });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to update menu item' });
    }
});

// Toggle menu item availability
app.patch('/menu-items/:id/toggle', async (req: Request, res: Response) => {
    try {
        const menuItem = await prisma.menuItem.findUnique({ where: { id: req.params.id } });
        if (!menuItem) {
            return res.status(404).json({ success: false, error: 'Menu item not found' });
        }
        const updated = await prisma.menuItem.update({
            where: { id: req.params.id },
            data: { isAvailable: !menuItem.isAvailable },
        });
        res.json({ success: true, data: updated });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to toggle menu item' });
    }
});

// Delete menu item
app.delete('/menu-items/:id', async (req: Request, res: Response) => {
    try {
        await prisma.menuItem.delete({ where: { id: req.params.id } });
        res.json({ success: true, message: 'Menu item deleted' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to delete menu item' });
    }
});

// ==================== ORDERS ====================

// Get all orders
app.get('/orders', async (req: Request, res: Response) => {
    try {
        const { sessionId, tableId, status } = req.query;
        const where: any = {};
        if (sessionId) where.sessionId = sessionId;
        if (tableId) where.tableId = tableId;
        if (status) where.status = status;

        const orders = await prisma.order.findMany({
            where,
            include: {
                items: { include: { menuItem: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch orders' });
    }
});

// Get order by ID
app.get('/orders/:id', async (req: Request, res: Response) => {
    try {
        const order = await prisma.order.findUnique({
            where: { id: req.params.id },
            include: { items: { include: { menuItem: true } } },
        });
        if (!order) {
            return res.status(404).json({ success: false, error: 'Order not found' });
        }
        res.json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch order' });
    }
});

// Create order
app.post('/orders', async (req: Request, res: Response) => {
    try {
        const { sessionId, tableId, notes, items } = req.body;

        // Calculate total amount
        let totalPrice = 0;
        const orderItems = [];
        for (const item of items) {
            const menuItem = await prisma.menuItem.findUnique({ where: { id: item.menuItemId } });
            if (!menuItem) continue;
            totalPrice += menuItem.price * item.quantity;
            orderItems.push({
                menuItemId: item.menuItemId,
                name: menuItem.name,
                price: menuItem.price,
                quantity: item.quantity,
            });
        }

        const order = await prisma.order.create({
            data: {
                sessionId,
                tableId,
                notes,
                totalPrice,
                items: { create: orderItems },
            },
            include: { items: { include: { menuItem: true } } },
        });

        io.emit('order:created', order);
        res.status(201).json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to create order' });
    }
});

// Update order status
app.patch('/orders/:id/status', async (req: Request, res: Response) => {
    try {
        const { status } = req.body;
        const order = await prisma.order.update({
            where: { id: req.params.id },
            data: { status },
            include: { items: { include: { menuItem: true } } },
        });
        io.emit('order:status:changed', order);
        res.json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to update order status' });
    }
});

// Cancel order
app.patch('/orders/:id/cancel', async (req: Request, res: Response) => {
    try {
        const order = await prisma.order.update({
            where: { id: req.params.id },
            data: { status: 'CANCELLED' },
        });
        io.emit('order:cancelled', order);
        res.json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to cancel order' });
    }
});

// Get orders by session
app.get('/sessions/:sessionId/orders', async (req: Request, res: Response) => {
    try {
        const orders = await prisma.order.findMany({
            where: { sessionId: req.params.sessionId },
            include: { items: { include: { menuItem: true } } },
            orderBy: { createdAt: 'desc' },
        });
        const totalPrice = orders.reduce((sum, order) => sum + order.totalPrice, 0);
        res.json({ success: true, data: { orders, totalPrice } });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch session orders' });
    }
});

// Socket.io
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
});

// Start server
httpServer.listen(PORT, () => {
    console.log(`🍔 Order Service running on port ${PORT}`);
});

process.on('SIGTERM', async () => {
    await prisma.$disconnect();
    process.exit(0);
});
