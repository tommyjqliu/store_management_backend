import { UmiApiRequest, UmiApiResponse } from "umi";
import { PrismaClient, Product } from '@prisma/client'
import { verifyToken } from "@/utils/jwt";

export default async function (req: UmiApiRequest, res: UmiApiResponse) {
	try {
		if (!req.cookies?.token) { return res.status(401).text('Unauthorized') }
		await verifyToken(req.cookies.token)
	} catch (error: any) {
		return res.status(401).json(error);
	}
	try {
		let prisma: PrismaClient;
		switch (req.method) {
			case 'GET':
				prisma = new PrismaClient()
				const orders = await prisma.order.findMany({
					include: {
						products: {},
					}
				})
				res.status(200).json(orders);
				await prisma.$disconnect()
				break

			case 'POST':
				prisma = new PrismaClient()
				const requestProducts: Product[] = req.body.products
				const currentProducts = await prisma.product.findMany({
					where: {
						OR: requestProducts.map(({ id }) => ({ id }))
					},
				})
				const dict: { [index: string]: Product } = {}
				for (const p of currentProducts) {
					dict[p.id] = p
				}
				const success = requestProducts.every(
					({ id, quantity }) =>
						quantity > 0 && dict[id] && dict[id].quantity >= quantity && dict[id].state !== 'FREEZE'
				)

				if (success) {
					const result = await prisma.$transaction([
						...requestProducts.map(
							({ id, quantity }) => prisma.product.update({
								where: { id },
								data: { quantity: { decrement: quantity } }
							})),
						prisma.order.create({
							data: {
								...req.body.order,
								// createdAt: "2022-05-27T16:06:57.405Z",
								products: {
									create: requestProducts.map(
										({ id, quantity, price }) => ({
											product: {
												connect: { id }
											},
											name: dict[id].name,
											description: dict[id].description,
											pictures: dict[id].pictures,
											price: price ?? dict[id].price,
											quantity,
										})
									)
								}
							},
							include: {
								products: true,
							}
						})
					])
					res.status(200).json(result.at(-1));
				} else {
					res.status(200).text('商品已下架或已售空');
				}
				await prisma.$disconnect()
				break

			default:
				res.status(405).json({ error: 'Method not allowed' })
		}
	} catch (error: any) {
		res.status(500).json(error);
	}
}