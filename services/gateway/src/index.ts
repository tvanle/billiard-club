import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { createProxyMiddleware, Options } from 'http-proxy-middleware';

const app = express();
const PORT = process.env.PORT || 9001;

// Service URLs
const services = {
    tables: process.env.TABLE_SERVICE_URL || 'http://localhost:9011',
    sessions: process.env.SESSION_SERVICE_URL || 'http://localhost:9013',
    orders: process.env.ORDER_SERVICE_URL || 'http://localhost:9015',
    users: process.env.USER_SERVICE_URL || 'http://localhost:9017',
    payments: process.env.PAYMENT_SERVICE_URL || 'http://localhost:9019',
};

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Health check
app.get('/health', (req: Request, res: Response) => {
    res.json({
        status: 'ok',
        service: 'api-gateway',
        services: Object.keys(services),
    });
});

// Check all services health
app.get('/health/all', async (req: Request, res: Response) => {
    const results: { [key: string]: string } = {};

    await Promise.all(
        Object.entries(services).map(async ([name, url]) => {
            try {
                const response = await fetch(`${url}/health`);
                results[name] = response.ok ? 'healthy' : 'unhealthy';
            } catch {
                results[name] = 'unreachable';
            }
        })
    );

    const allHealthy = Object.values(results).every(s => s === 'healthy');
    res.status(allHealthy ? 200 : 503).json({
        status: allHealthy ? 'ok' : 'degraded',
        services: results,
    });
});

// Proxy options factory
const createProxy = (target: string): Options => ({
    target,
    changeOrigin: true,
    pathRewrite: (path: string) => {
        // Remove /api prefix
        return path.replace(/^\/api/, '');
    },
    onError: (err, req, res) => {
        console.error(`Proxy error: ${err.message}`);
        (res as Response).status(502).json({
            success: false,
            error: 'Service unavailable'
        });
    },
});

// Route to Table Service
app.use('/api/tables', createProxyMiddleware(createProxy(services.tables)));

// Route to Session Service
app.use('/api/sessions', createProxyMiddleware(createProxy(services.sessions)));

// Route to Order Service
app.use('/api/orders', createProxyMiddleware(createProxy(services.orders)));
app.use('/api/categories', createProxyMiddleware(createProxy(services.orders)));
app.use('/api/menu-items', createProxyMiddleware(createProxy(services.orders)));

// Route to User Service
app.use('/api/auth', createProxyMiddleware(createProxy(services.users)));
app.use('/api/users', createProxyMiddleware(createProxy(services.users)));
app.use('/api/employees', createProxyMiddleware(createProxy(services.users)));
app.use('/api/customers', createProxyMiddleware(createProxy(services.users)));

// Route to Payment Service
app.use('/api/payments', createProxyMiddleware(createProxy(services.payments)));
app.use('/api/invoices', createProxyMiddleware(createProxy(services.payments)));
app.use('/api/reports', createProxyMiddleware(createProxy(services.payments)));

// API documentation endpoint
app.get('/api', (req: Request, res: Response) => {
    res.json({
        name: 'Billiard Club API',
        version: '1.0.0',
        endpoints: {
            tables: {
                'GET /api/tables': 'Get all tables',
                'GET /api/tables/:id': 'Get table by ID',
                'POST /api/tables': 'Create table',
                'PUT /api/tables/:id': 'Update table',
                'PATCH /api/tables/:id/status': 'Update table status',
                'DELETE /api/tables/:id': 'Delete table',
            },
            sessions: {
                'GET /api/sessions': 'Get all sessions',
                'GET /api/sessions/:id': 'Get session by ID',
                'POST /api/sessions': 'Start new session',
                'PATCH /api/sessions/:id/end': 'End session',
                'GET /api/sessions/:id/cost': 'Get session cost',
            },
            orders: {
                'GET /api/categories': 'Get all categories',
                'GET /api/menu-items': 'Get all menu items',
                'GET /api/orders': 'Get all orders',
                'POST /api/orders': 'Create order',
                'PATCH /api/orders/:id/status': 'Update order status',
            },
            users: {
                'POST /api/auth/register': 'Register user',
                'POST /api/auth/login': 'Login',
                'GET /api/auth/me': 'Get current user',
                'GET /api/employees': 'Get all employees',
                'GET /api/customers': 'Get all customers',
            },
            payments: {
                'GET /api/payments': 'Get all payments',
                'POST /api/payments': 'Create payment',
                'PATCH /api/payments/:id/complete': 'Complete payment',
                'GET /api/reports/daily': 'Get daily report',
                'GET /api/reports/monthly': 'Get monthly report',
            },
        },
    });
});

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found',
        path: req.path,
    });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Gateway error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 API Gateway running on port ${PORT}`);
    console.log('📡 Service routes:');
    console.log(`   Tables:   ${services.tables}`);
    console.log(`   Sessions: ${services.sessions}`);
    console.log(`   Orders:   ${services.orders}`);
    console.log(`   Users:    ${services.users}`);
    console.log(`   Payments: ${services.payments}`);
});
