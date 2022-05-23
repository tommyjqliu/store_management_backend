import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

async function createUser(email, password) {
	try {
    const prisma = new PrismaClient()

    const passwordHash = bcrypt.hashSync(password, 8)
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
      }
    })

    await prisma.$disconnect()
  } catch (e) {
    console.log(e,'https://www.prisma.io/docs/reference/api-reference/error-reference#')
  }
}

createUser('example00@email.com', '123456')