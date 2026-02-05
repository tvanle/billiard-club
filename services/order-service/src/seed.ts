import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
    console.log('🌱 Seeding order service data...');

    // Clear existing data
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.menuItem.deleteMany();
    await prisma.category.deleteMany();

    // Create categories
    const categories = await Promise.all([
        prisma.category.create({
            data: { name: 'Cà phê', icon: '☕', sortOrder: 1 },
        }),
        prisma.category.create({
            data: { name: 'Trà & Nước ngọt', icon: '🧃', sortOrder: 2 },
        }),
        prisma.category.create({
            data: { name: 'Bia', icon: '🍺', sortOrder: 3 },
        }),
        prisma.category.create({
            data: { name: 'Snacks', icon: '🍿', sortOrder: 4 },
        }),
        prisma.category.create({
            data: { name: 'Món ăn', icon: '🍜', sortOrder: 5 },
        }),
    ]);

    console.log(`✅ Created ${categories.length} categories`);

    // Create menu items
    const menuItems = await Promise.all([
        // Coffee
        prisma.menuItem.create({
            data: { categoryId: categories[0].id, name: 'Cà phê đen', price: 20000 },
        }),
        prisma.menuItem.create({
            data: { categoryId: categories[0].id, name: 'Cà phê sữa', price: 25000 },
        }),
        prisma.menuItem.create({
            data: { categoryId: categories[0].id, name: 'Bạc xỉu', price: 28000 },
        }),
        prisma.menuItem.create({
            data: { categoryId: categories[0].id, name: 'Espresso', price: 30000 },
        }),
        // Tea & Drinks
        prisma.menuItem.create({
            data: { categoryId: categories[1].id, name: 'Trà đào', price: 30000 },
        }),
        prisma.menuItem.create({
            data: { categoryId: categories[1].id, name: 'Trà vải', price: 30000 },
        }),
        prisma.menuItem.create({
            data: { categoryId: categories[1].id, name: 'Nước suối', price: 10000 },
        }),
        prisma.menuItem.create({
            data: { categoryId: categories[1].id, name: 'Red Bull', price: 25000 },
        }),
        prisma.menuItem.create({
            data: { categoryId: categories[1].id, name: 'Coca Cola', price: 15000 },
        }),
        // Beer
        prisma.menuItem.create({
            data: { categoryId: categories[2].id, name: 'Tiger', price: 25000 },
        }),
        prisma.menuItem.create({
            data: { categoryId: categories[2].id, name: 'Heineken', price: 30000 },
        }),
        prisma.menuItem.create({
            data: { categoryId: categories[2].id, name: 'Saigon Special', price: 20000 },
        }),
        prisma.menuItem.create({
            data: { categoryId: categories[2].id, name: 'Bia Hà Nội', price: 18000 },
        }),
        // Snacks
        prisma.menuItem.create({
            data: { categoryId: categories[3].id, name: 'Đậu phộng', price: 15000 },
        }),
        prisma.menuItem.create({
            data: { categoryId: categories[3].id, name: 'Khoai tây chiên', price: 35000 },
        }),
        prisma.menuItem.create({
            data: { categoryId: categories[3].id, name: 'Bắp rang bơ', price: 20000 },
        }),
        prisma.menuItem.create({
            data: { categoryId: categories[3].id, name: 'Khô bò', price: 40000 },
        }),
        // Food
        prisma.menuItem.create({
            data: { categoryId: categories[4].id, name: 'Mì xào hải sản', price: 55000 },
        }),
        prisma.menuItem.create({
            data: { categoryId: categories[4].id, name: 'Cơm chiên dương châu', price: 45000 },
        }),
        prisma.menuItem.create({
            data: { categoryId: categories[4].id, name: 'Phở bò', price: 50000 },
        }),
    ]);

    console.log(`✅ Created ${menuItems.length} menu items`);
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
