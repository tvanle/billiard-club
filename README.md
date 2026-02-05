# 🎱 Billiard Club Management System

Hệ thống quản lý câu lạc bộ Billiard hoàn chỉnh với kiến trúc Microservice.

## 🏗️ Kiến trúc

```
┌─────────────────┐     ┌────────────────────────────────────────┐
│   Frontend      │────▶│           API Gateway (:4000)          │
│   Next.js       │     └────────────────────────────────────────┘
│   (:3002)       │                        │
└─────────────────┘     ┌──────────────────┼──────────────────┐
                        │                  │                  │
                        ▼                  ▼                  ▼
              ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
              │   Table     │    │   Session   │    │   Order     │
              │   Service   │    │   Service   │    │   Service   │
              │   (:4001)   │    │   (:4002)   │    │   (:4003)   │
              └─────────────┘    └─────────────┘    └─────────────┘
                        │                  │                  │
                        ▼                  ▼                  ▼
              ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
              │   User      │    │   Payment   │    │  PostgreSQL │
              │   Service   │    │   Service   │    │   Database  │
              │   (:4004)   │    │   (:4005)   │    │   (:5432)   │
              └─────────────┘    └─────────────┘    └─────────────┘
```

## 🚀 Hướng dẫn chạy

### 1. Cài đặt dependencies

```bash
# Clone và cài đặt
cd billiard-club
npm install
```

### 2. Chạy Database

```bash
# Cần Docker
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

🌐 Mở browser: **http://localhost:3002**

## 📦 Services

| Service | Port | Mô tả |
|---------|------|-------|
| **Gateway** | 4000 | API Gateway điều phối requests |
| **Table Service** | 4001 | Quản lý bàn billiard |
| **Session Service** | 4002 | Quản lý phiên chơi |
| **Order Service** | 4003 | Quản lý order & menu |
| **User Service** | 4004 | Auth, nhân viên, khách hàng |
| **Payment Service** | 4005 | Thanh toán, hóa đơn, báo cáo |

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
