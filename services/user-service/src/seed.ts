import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
    console.log('🌱 Seeding user service data...');

    // Clear existing data
    await prisma.employee.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.user.deleteMany();

    const passwordHash = await bcrypt.hash('123456', 10);

    // Create admin
    const admin = await prisma.user.create({
        data: {
            email: 'admin@billiard.club',
            passwordHash,
            name: 'Admin',
            phone: '0900000000',
            role: 'ADMIN',
        },
    });
    console.log('✅ Created admin user');

    // Create employees
    const employees = await Promise.all([
        prisma.user.create({
            data: {
                email: 'manager@billiard.club',
                passwordHash,
                name: 'Nguyễn Văn An',
                phone: '0901234567',
                role: 'MANAGER',
                employee: {
                    create: {
                        employeeId: 'NV001',
                        position: 'Quản lý ca',
                        department: 'Quản lý',
                        salary: 12000000,
                        shift: 'Ca sáng (6:00 - 14:00)',
                    },
                },
            },
        }),
        prisma.user.create({
            data: {
                email: 'staff1@billiard.club',
                passwordHash,
                name: 'Trần Thị Bình',
                phone: '0912345678',
                role: 'STAFF',
                employee: {
                    create: {
                        employeeId: 'NV002',
                        position: 'Nhân viên phục vụ',
                        department: 'Phục vụ',
                        salary: 8000000,
                        shift: 'Ca chiều (14:00 - 22:00)',
                    },
                },
            },
        }),
        prisma.user.create({
            data: {
                email: 'staff2@billiard.club',
                passwordHash,
                name: 'Lê Văn Cường',
                phone: '0923456789',
                role: 'STAFF',
                employee: {
                    create: {
                        employeeId: 'NV003',
                        position: 'Nhân viên thu ngân',
                        department: 'Thu ngân',
                        salary: 9000000,
                        shift: 'Ca tối (22:00 - 6:00)',
                    },
                },
            },
        }),
        prisma.user.create({
            data: {
                email: 'staff3@billiard.club',
                passwordHash,
                name: 'Phạm Thị Dung',
                phone: '0934567890',
                role: 'STAFF',
                employee: {
                    create: {
                        employeeId: 'NV004',
                        position: 'Nhân viên bar',
                        department: 'Bar',
                        salary: 7500000,
                        shift: 'Ca sáng (6:00 - 14:00)',
                        status: 'ON_LEAVE',
                    },
                },
            },
        }),
        prisma.user.create({
            data: {
                email: 'tech@billiard.club',
                passwordHash,
                name: 'Hoàng Văn Em',
                phone: '0945678901',
                role: 'STAFF',
                employee: {
                    create: {
                        employeeId: 'NV005',
                        position: 'Kỹ thuật viên',
                        department: 'Kỹ thuật',
                        salary: 10000000,
                        shift: 'Ca chiều (14:00 - 22:00)',
                    },
                },
            },
        }),
    ]);
    console.log(`✅ Created ${employees.length} employees`);

    // Create customers
    const customers = await Promise.all([
        prisma.user.create({
            data: {
                email: 'customer1@gmail.com',
                passwordHash,
                name: 'Nguyễn Văn Khách',
                phone: '0961234567',
                role: 'CUSTOMER',
                customer: {
                    create: {
                        membershipLevel: 'GOLD',
                        loyaltyPoints: 5000,
                        totalSpent: 5000000,
                    },
                },
            },
        }),
        prisma.user.create({
            data: {
                email: 'customer2@gmail.com',
                passwordHash,
                name: 'Trần Văn Hàng',
                phone: '0972345678',
                role: 'CUSTOMER',
                customer: {
                    create: {
                        membershipLevel: 'SILVER',
                        loyaltyPoints: 2000,
                        totalSpent: 2000000,
                    },
                },
            },
        }),
        prisma.user.create({
            data: {
                email: 'customer3@gmail.com',
                passwordHash,
                name: 'Lê Thị Mai',
                phone: '0983456789',
                role: 'CUSTOMER',
                customer: {
                    create: {
                        membershipLevel: 'PLATINUM',
                        loyaltyPoints: 15000,
                        totalSpent: 15000000,
                    },
                },
            },
        }),
    ]);
    console.log(`✅ Created ${customers.length} customers`);

    console.log('🌱 Seeding completed!');
    console.log('\n📋 Login credentials:');
    console.log('  Admin: admin@billiard.club / 123456');
    console.log('  Manager: manager@billiard.club / 123456');
    console.log('  Staff: staff1@billiard.club / 123456');
}

seed()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
