import { UmiApiRequest, UmiApiResponse } from "umi";
import { PrismaClient } from '@prisma/client'
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
      case 'PUT':
        prisma = new PrismaClient()
        const categorys = req.body.categorys.map((e: string) => ({ name: e }))
        await prisma.category.createMany({
          data: categorys,
          skipDuplicates: true,
        })
        const result = await prisma.$transaction([
          prisma.product.update({
            where: {
              id: +req.params.productId
            },
            data: {
              categorys: {
                set: []
              }
            }
          }),
          prisma.product.update({
            where: {
              id: +req.params.productId
            },
            data: {
              ...req.body,
              categorys: {
                connect: categorys
              }
            },
            include: {
              categorys: true
            }
          })
        ])
        const product = result[1]
        res.status(200).json(product);
        await prisma.$disconnect()
        break

      case 'DELETE':
        prisma = new PrismaClient()
        await prisma.product.delete({
          where: {
            id: +req.params.productId
          }
        })
        res.status(200).text('Successfully deleted');
        await prisma.$disconnect()
        break
      default:
        res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error: any) {
    res.status(500).json(error);
  }
}