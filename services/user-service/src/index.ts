import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4004;
const JWT_SECRET = process.env.JWT_SECRET || 'billiard-club-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Middleware
app.use(cors());
app.use(express.json());

// Auth middleware
interface AuthRequest extends Request {
    user?: { id: string; email: string; role: string };
}

const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, error: 'Invalid token' });
    }
};

// Health check
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', service: 'user-service' });
});

// ==================== AUTH ====================

// Register
app.post('/auth/register', async (req: Request, res: Response) => {
    try {
        const { email, password, name, phone, role } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ success: false, error: 'Email already exists' });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { email, passwordHash, name, phone, role: role || 'CUSTOMER' },
            select: { id: true, email: true, name: true, phone: true, role: true, createdAt: true },
        });

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
        });

        res.status(201).json({ success: true, data: { user, token } });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to register' });
    }
});

// Login
app.post('/auth/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.passwordHash);
        if (!validPassword) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        if (!user.isActive) {
            return res.status(401).json({ success: false, error: 'Account is disabled' });
        }

        // Update last login
        await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() },
        });

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
        });

        const { passwordHash, ...userWithoutPassword } = user;
        res.json({ success: true, data: { user: userWithoutPassword, token } });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to login' });
    }
});

// Get current user
app.get('/auth/me', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user?.id },
            select: {
                id: true, email: true, name: true, phone: true, role: true,
                avatar: true, createdAt: true, lastLogin: true,
                employee: true,
                customer: true,
            },
        });
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        res.json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to get user' });
    }
});

// Change password
app.post('/auth/change-password', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await prisma.user.findUnique({ where: { id: req.user?.id } });
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        const validPassword = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!validPassword) {
            return res.status(400).json({ success: false, error: 'Current password is incorrect' });
        }

        const passwordHash = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: user.id },
            data: { passwordHash },
        });

        res.json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to change password' });
    }
});

// ==================== USERS ====================

// Get all users
app.get('/users', async (req: Request, res: Response) => {
    try {
        const { role, isActive } = req.query;
        const where: any = {};
        if (role) where.role = role;
        if (isActive !== undefined) where.isActive = isActive === 'true';

        const users = await prisma.user.findMany({
            where,
            select: {
                id: true, email: true, name: true, phone: true, role: true,
                avatar: true, isActive: true, lastLogin: true, createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch users' });
    }
});

// Get user by ID
app.get('/users/:id', async (req: Request, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.params.id },
            select: {
                id: true, email: true, name: true, phone: true, role: true,
                avatar: true, isActive: true, lastLogin: true, createdAt: true,
                employee: true,
                customer: true,
            },
        });
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        res.json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch user' });
    }
});

// Update user
app.put('/users/:id', async (req: Request, res: Response) => {
    try {
        const { name, phone, avatar, isActive } = req.body;
        const user = await prisma.user.update({
            where: { id: req.params.id },
            data: { name, phone, avatar, isActive },
            select: { id: true, email: true, name: true, phone: true, role: true, avatar: true, isActive: true },
        });
        res.json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to update user' });
    }
});

// ==================== EMPLOYEES ====================

// Get all employees
app.get('/employees', async (req: Request, res: Response) => {
    try {
        const { status, department } = req.query;
        const where: any = {};
        if (status) where.status = status;
        if (department) where.department = department;

        const employees = await prisma.employee.findMany({
            where,
            include: {
                user: {
                    select: { id: true, email: true, name: true, phone: true, avatar: true, role: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json({ success: true, data: employees });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch employees' });
    }
});

// Create employee
app.post('/employees', async (req: Request, res: Response) => {
    try {
        const { email, password, name, phone, role, employeeId, position, department, salary, shift } = req.body;

        // Create user first
        const passwordHash = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { email, passwordHash, name, phone, role: role || 'STAFF' },
        });

        // Create employee
        const employee = await prisma.employee.create({
            data: {
                userId: user.id,
                employeeId,
                position,
                department,
                salary,
                shift,
            },
            include: {
                user: {
                    select: { id: true, email: true, name: true, phone: true, role: true },
                },
            },
        });

        res.status(201).json({ success: true, data: employee });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to create employee' });
    }
});

// Update employee
app.put('/employees/:id', async (req: Request, res: Response) => {
    try {
        const { position, department, salary, shift, status, notes } = req.body;
        const employee = await prisma.employee.update({
            where: { id: req.params.id },
            data: { position, department, salary, shift, status, notes },
            include: { user: { select: { id: true, email: true, name: true, phone: true, role: true } } },
        });
        res.json({ success: true, data: employee });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to update employee' });
    }
});

// Delete employee
app.delete('/employees/:id', async (req: Request, res: Response) => {
    try {
        const employee = await prisma.employee.findUnique({ where: { id: req.params.id } });
        if (!employee) {
            return res.status(404).json({ success: false, error: 'Employee not found' });
        }
        await prisma.user.delete({ where: { id: employee.userId } });
        res.json({ success: true, message: 'Employee deleted' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to delete employee' });
    }
});

// ==================== CUSTOMERS ====================

// Get all customers
app.get('/customers', async (req: Request, res: Response) => {
    try {
        const { membershipLevel } = req.query;
        const where: any = {};
        if (membershipLevel) where.membershipLevel = membershipLevel;

        const customers = await prisma.customer.findMany({
            where,
            include: {
                user: {
                    select: { id: true, email: true, name: true, phone: true, avatar: true },
                },
            },
            orderBy: { totalSpent: 'desc' },
        });
        res.json({ success: true, data: customers });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch customers' });
    }
});

// Create customer
app.post('/customers', async (req: Request, res: Response) => {
    try {
        const { email, password, name, phone, dateOfBirth, address, membershipLevel } = req.body;

        const passwordHash = await bcrypt.hash(password || 'default123', 10);
        const user = await prisma.user.create({
            data: { email, passwordHash, name, phone, role: 'CUSTOMER' },
        });

        const customer = await prisma.customer.create({
            data: {
                userId: user.id,
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
                address,
                membershipLevel: membershipLevel || 'STANDARD',
            },
            include: {
                user: { select: { id: true, email: true, name: true, phone: true } },
            },
        });

        res.status(201).json({ success: true, data: customer });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to create customer' });
    }
});

// Update customer
app.put('/customers/:id', async (req: Request, res: Response) => {
    try {
        const { membershipLevel, dateOfBirth, address, notes } = req.body;
        const customer = await prisma.customer.update({
            where: { id: req.params.id },
            data: {
                membershipLevel,
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
                address,
                notes
            },
            include: { user: { select: { id: true, email: true, name: true, phone: true } } },
        });
        res.json({ success: true, data: customer });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to update customer' });
    }
});

// Add loyalty points
app.patch('/customers/:id/points', async (req: Request, res: Response) => {
    try {
        const { points, totalSpent } = req.body;
        const customer = await prisma.customer.update({
            where: { id: req.params.id },
            data: {
                loyaltyPoints: { increment: points || 0 },
                totalSpent: { increment: totalSpent || 0 },
            },
        });
        res.json({ success: true, data: customer });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to update points' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`👤 User Service running on port ${PORT}`);
});

process.on('SIGTERM', async () => {
    await prisma.$disconnect();
    process.exit(0);
});
