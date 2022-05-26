import { UmiApiRequest, UmiApiResponse } from "umi";
import { PrismaClient, Order, ProductSnapShot } from '@prisma/client'

export default async function (req: UmiApiRequest, res: UmiApiResponse) {
  try {
    let prisma: PrismaClient
    let order: Order & { products: ProductSnapShot[]; } | null
    switch (req.method) {
      case 'PUT':
        prisma = new PrismaClient()
        order = await prisma.order.update({
          where: {
            id: +req.params.orderId
          },
          data: {
            ...req.body,
          },
          include: {
            products: true
          }
        })
        res.status(200).json(order);
        await prisma.$disconnect()
        break

      case 'DELETE':
        prisma = new PrismaClient()
        order = await prisma.order.findUnique({
          where: {
            id: +req.params.orderId
          },
          include: {
            products: true,
          }
        })
        if (!order) {
          res.status(200).text('order does not exist');
          return
        }
        await prisma.$transaction([
          ...order.products.map(
            ({ productId, quantity }) => prisma.product.update({
              where: { id: productId },
              data: { quantity: { increment: quantity } }
            })),
          prisma.order.delete({
            where: {
              id: +req.params.orderId
            }
          })
        ])
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