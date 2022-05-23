import { UmiApiRequest, UmiApiResponse } from "umi";
import { PrismaClient } from '@prisma/client'

export default async function (req: UmiApiRequest, res: UmiApiResponse) {
	try {
		let prisma: PrismaClient;
		switch (req.method) {
			case 'GET':
				prisma = new PrismaClient()
				const products = await prisma.product.findMany({
					include: {
						categorys: {},
					}
				})
				res.status(200).json(products);
				await prisma.$disconnect()
				break

			case 'POST':
				prisma = new PrismaClient()
				const categorys = req.body.categorys.map((e: string) => ({ name: e }))
				await prisma.category.createMany({
					data: categorys,
					skipDuplicates: true,
				})
				const product = await prisma.product.create({
					data: {
						...req.body,
						categorys: {
							connect: categorys
						}
					}
				})
				res.status(200).json(product);
				await prisma.$disconnect()
				break

			default:
				res.status(405).json({ error: 'Method not allowed' })
		}
	} catch (error: any) {
		res.status(500).json(error);
	}
}