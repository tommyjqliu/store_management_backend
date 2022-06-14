import { PrismaClient } from '@prisma/client'
import fetch from 'node-fetch'

function randomLastWeek() {
	return (new Date(Date.now() - parseInt(Math.random() * 7 * 24 * 60 * 60 * 1000))).toISOString()
}

async function createOrder({ order, products }, prisma) {
	const currentProducts = await prisma.product.findMany({
		where: {
			OR: products.map(({ id }) => ({ id }))
		},
	})
	const dict = {}
	for (const p of currentProducts) {
		dict[p.id] = p
	}
	const result = await prisma.order.create({
		data: {
			...order,
			createdAt: randomLastWeek(),
			adjustment: - Math.floor(Math.random() * 100) / 10,
			products: {
				create: products.map(
					({ id, quantity, price }) => ({
						product: {
							connect: { id }
						},
						name: dict[id].name,
						description: dict[id].description,
						pictures: dict[id].pictures,
						price: dict[id].price,
						quantity: Math.floor(Math.random() * 100) + 1,
					})
				)
			}
		},
	})
	console.log(result)
}

const orderTemplate = {
	order: {
		receiver: "Tom",
		address: "翻斗大街翻斗花园二号楼1001室",
		state: "UNPAY"
	},
	products: [
		{
			id: 1,
		},
		{
			id: 2,
		}
	]
}

async function createOrders() {
	try {
		const prisma = new PrismaClient()
		// await createOrder(orderTemplate, prisma)
		const arr = []
		for (let i = 0; i < 15; i++) {
			arr.push(createOrder(orderTemplate, prisma))
		}
		await Promise.all(arr)
		await prisma.$disconnect()
	} catch(err) {
		console.log(err)
	}
	
}

createOrders()