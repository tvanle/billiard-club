import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
    console.log('🌱 Seeding table data...');

    // Clear existing data
    await prisma.table.deleteMany();

    // Create tables
    const tables = await Promise.all([
        // Pool tables
        prisma.table.create({
            data: { name: 'Pool 01', type: 'POOL', hourlyRate: 50000, location: 'Tầng 1', status: 'AVAILABLE' },
        }),
        prisma.table.create({
            data: { name: 'Pool 02', type: 'POOL', hourlyRate: 50000, location: 'Tầng 1', status: 'AVAILABLE' },
        }),
        prisma.table.create({
            data: { name: 'Pool 03', type: 'POOL', hourlyRate: 50000, location: 'Tầng 1', status: 'OCCUPIED' },
        }),
        prisma.table.create({
            data: { name: 'Pool 04', type: 'POOL', hourlyRate: 60000, location: 'Tầng 1 - VIP', status: 'AVAILABLE' },
        }),
        prisma.table.create({
            data: { name: 'Pool 05', type: 'POOL', hourlyRate: 60000, location: 'Tầng 1 - VIP', status: 'RESERVED' },
        }),
        // Snooker tables
        prisma.table.create({
            data: { name: 'Snooker 01', type: 'SNOOKER', hourlyRate: 80000, location: 'Tầng 2', status: 'AVAILABLE' },
        }),
        prisma.table.create({
            data: { name: 'Snooker 02', type: 'SNOOKER', hourlyRate: 80000, location: 'Tầng 2', status: 'OCCUPIED' },
        }),
        prisma.table.create({
            data: { name: 'Snooker 03', type: 'SNOOKER', hourlyRate: 100000, location: 'Tầng 2 - VIP', status: 'AVAILABLE' },
        }),
        // Carom tables
        prisma.table.create({
            data: { name: 'Carom 01', type: 'CAROM', hourlyRate: 70000, location: 'Tầng 2', status: 'AVAILABLE' },
        }),
        prisma.table.create({
            data: { name: 'Carom 02', type: 'CAROM', hourlyRate: 70000, location: 'Tầng 2', status: 'MAINTENANCE' },
        }),
    ]);

    console.log(`✅ Created ${tables.length} tables`);
    console.log('🌱 Seeding completed!');
}

seed()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
