import { PrismaClient } from '@prisma/client'

async function createProduct(product) {
	try {
		const prisma = new PrismaClient()
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

		await prisma.$disconnect()
	} catch (e) {
		console.log(e, 'https://www.prisma.io/docs/reference/api-reference/error-reference#')
	}
}

createProduct({
	name: 'apple1',
	description: 'An apple is an edible fruit produced by an apple tree (Malus domestica). Apple trees are cultivated worldwide and are the most widely grown species in the genus Malus. ',
	pictures: [
		'http://tva1.sinaimg.cn/large/006c64B3gy1h2icxe2z80j30rq0rsdx6.jpg',
		'http://tva1.sinaimg.cn/large/006c64B3gy1h2id00hg95j30dw0ahq5u.jpg',
		'http://tva1.sinaimg.cn/large/006c64B3gy1h2id0kaej2j307b05c0ti.jpg',
	],
	price: 5.5,
	quantity: 300,
	categorys: [
		'fruit1',
		'red',
		'fresh',
	],
})