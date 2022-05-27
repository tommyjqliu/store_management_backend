import React, { useEffect, useState } from "react";
import { Table, Tag, Space, Button, Modal, Form } from 'antd';
import { Order, ProductSnapShot } from '@prisma/client'

type OrderWithPd = Order & { products: ProductSnapShot[] }
const { Column } = Table;

export default () => {
	const [loading, setLoading] = useState(true)
	const [data, setData] = useState<OrderWithPd[]>();

	async function refresh() {
		setLoading(true)
		const res = await fetch('/api/order');
		if (res.status !== 200) {
			console.error(await res.text());
		}
		setData((await res.json()).map((item: Order & { products: ProductSnapShot[] }) => ({
			...item,
			key: item.id,
			total: item.products.reduce((a, b) => a + b.price * b.quantity, 0) + item.adjustment
		})))
		setLoading(false)
	}
	useEffect(() => {
		refresh()
	}, [])

	return <>
		<Table dataSource={data} loading={loading}>
			<Column title="Id" dataIndex="id" key="id" />
			<Column title="CreatedAt" dataIndex="createdAt" key="createdAt" />
			<Column title="Receiver" dataIndex="receiver" key="receiver" />
			<Column title="Address" dataIndex="address" key="address" />
			<Column title="Total" dataIndex="total" key="total" />
			<Column title="Adjustment" dataIndex="adjustment" key="adjustment" />
			<Column title="State" dataIndex="state" key="state" />
		</Table>
	</>
}