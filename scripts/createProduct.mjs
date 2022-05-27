import { PrismaClient } from '@prisma/client'
import products from './products.mjs'
import fetch from 'node-fetch'

async function createProduct(product, prisma) {
	const categorys = product.categorys.map((e) => ({ name: e }))
	await prisma.category.createMany({
		data: categorys,
		skipDuplicates: true,
	})
	await prisma.product.create({
		data: {
			...product,
			categorys: {
				connect: categorys
			}
		}
	})
}

async function createProducts(products) {
	const prisma = new PrismaClient()
	await Promise.all(
		products.map(p => createProduct(p, prisma))
	)
	await prisma.$disconnect()
}


createProducts(products)
