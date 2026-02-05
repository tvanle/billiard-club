# 🎱 Billiard Club Management System

Hệ thống quản lý câu lạc bộ Billiard hoàn chỉnh với kiến trúc Microservice.

## 🏗️ Kiến trúc

```
┌─────────────────┐     ┌────────────────────────────────────────┐
│   Frontend      │────▶│           API Gateway (:8000)          │
│   Next.js       │     └────────────────────────────────────────┘
│   (:3010)       │                        │
└─────────────────┘     ┌──────────────────┼──────────────────┐
                        │                  │                  │
                        ▼                  ▼                  ▼
              ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
              │   Table     │    │   Session   │    │   Order     │
              │   Service   │    │   Service   │    │   Service   │
              │   (:8001)   │    │   (:8002)   │    │   (:8003)   │
              └─────────────┘    └─────────────┘    └─────────────┘
                        │                  │                  │
                        ▼                  ▼                  ▼
              ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
              │   User      │    │   Payment   │    │  PostgreSQL │
              │   Service   │    │   Service   │    │   Database  │
              │   (:8004)   │    │   (:8005)   │    │   (:5433)   │
              └─────────────┘    └─────────────┘    └─────────────┘
```

## 📦 Port Configuration

| Service | Port | Mô tả |
|---------|------|-------|
| **Frontend** | 3010 | Next.js UI |
| **Gateway** | 8000 | API Gateway |
| **Table Service** | 8001 | Quản lý bàn |
| **Session Service** | 8002 | Quản lý phiên |
| **Order Service** | 8003 | Quản lý order |
| **User Service** | 8004 | Auth & users |
| **Payment Service** | 8005 | Thanh toán |
| **PostgreSQL** | 5433 | Database |
| **Redis** | 6380 | Cache |

## 🚀 Hướng dẫn chạy

### 1. Cài đặt dependencies

```bash
cd billiard-club
npm install
```

### 2. Chạy Database

```bash
docker-compose up -d
```

### 3. Chạy Backend Services

```bash
# Terminal 1: Table Service
cd services/table-service
npm install
npx prisma db push
npm run db:seed
npm run dev

# Terminal 2: Session Service  
cd services/session-service
npm install
npx prisma db push
npm run dev

# Terminal 3: Order Service
cd services/order-service
npm install
npx prisma db push
npm run db:seed
npm run dev

# Terminal 4: User Service
cd services/user-service
npm install
npx prisma db push
npm run db:seed
npm run dev

# Terminal 5: Payment Service
cd services/payment-service
npm install
npx prisma db push
npm run dev

# Terminal 6: API Gateway
cd services/gateway
npm install
npm run dev
```

### 4. Chạy Frontend

```bash
cd apps/web
npm install
npm run dev
```

🌐 Mở browser: **http://localhost:3010**

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Zustand
- **Backend**: Node.js, Express, Prisma ORM
- **Database**: PostgreSQL
- **Cache**: Redis
- **Real-time**: Socket.io
- **Auth**: JWT

## 📱 Tính năng

- ✅ Dashboard tổng quan với real-time stats
- ✅ Quản lý bàn (Pool, Snooker, Carom)
- ✅ Quản lý phiên chơi với live timer
- ✅ POS system cho đồ uống & đồ ăn
- ✅ Quản lý nhân viên & khách hàng
- ✅ Thanh toán đa phương thức (Tiền mặt, Thẻ, MoMo, ZaloPay)
- ✅ Báo cáo doanh thu hàng ngày/tháng
- ✅ Dark theme với Glassmorphism UI

## 🔐 Tài khoản mặc định

```
Admin: admin@billiard.club / 123456
Manager: manager@billiard.club / 123456
Staff: staff1@billiard.club / 123456
```
