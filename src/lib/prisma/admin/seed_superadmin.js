import prisma from '@/lib/prisma/client'
import bcrypt from 'bcryptjs'

export async function SuperAdminSeeder() {
  try{
    await prisma.$executeRawUnsafe(`
        TRUNCATE TABLE
          "admin"
        RESTART IDENTITY CASCADE
      `);

    const hashedPassword = await bcrypt.hash('Admin@123', 10)

    await prisma.admin.upsert({
      where: { email: 'superadmin@admin.com' },
      update: {},
      create: {
        email: 'superadmin@admin.com',
        password: hashedPassword,
        type: 'superadmin',
      },
    })

    console.log('Added Superadmin successfully')
  } catch(err){
    console.error('Failure while adding Superadmin :',err)
  }

}