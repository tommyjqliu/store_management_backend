import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import { Table, Tag, Space, Button, Modal, Form } from 'antd';
import { Category, Product } from '@prisma/client'
import ProductForm from './_form'

export interface TableRef {
	refresh: () => void
}

const { Column } = Table;

export default forwardRef<TableRef>((_, ref) => {
	const [loading, setLoading] = useState(true)
	const [data, setData] = useState<Product[]>();
	const [visible, setVisible] = useState(false);
	const [form] = Form.useForm();

	async function refresh() {
		setLoading(true)
		const res = await fetch('/api/product');
		if (res.status !== 200) {
			console.error(await res.text());
		}
		setData((await res.json()).map((item: Product & { categorys: Category[] }) => ({
			...item,
			key: item.id,
			categorys: item.categorys.map(c => c.name),
		})))
		setLoading(false)
	}

	useImperativeHandle(ref, () => ({
		refresh
	}), []);

	useEffect(() => {
		refresh()
	}, [])

	const editRecord = (record: Product) => {
		form.setFieldsValue(record)
		setVisible(true)
	}

	const editFinished = async (record: Product) => {
		await fetch(`/api/product/${record.id}`, {
			method: 'PUT',
			body: JSON.stringify(record),
			headers: { 'Content-Type': 'application/json' }
		})
		refresh()
		setVisible(false)
	}

	const deleteRecord = async (record: Product) => {
		await fetch(`/api/product/${record.id}`, { method: 'DELETE' })
		refresh()
	}

	const renderCategory = (categorys: string[]) =>
		(categorys.map((c) => <Tag key={c}>{c}</Tag>))

	const renderAction = (_: any, record: Product) => {
		return <Space>
			<Button type="link" size="small" onClick={() => editRecord(record)}>Edit</Button>
			<Button type="link" size="small" onClick={() => deleteRecord(record)}>Delete</Button>
		</Space>
	}

	return <>
		<Table dataSource={data} loading={loading}>
			<Column title="Id" dataIndex="id" key="id" />
			<Column title="Name" dataIndex="name" key="name" />
			<Column title="Category" dataIndex="categorys" key="categorys" render={renderCategory} />
			<Column title="Description" dataIndex="description" key="description" />
			<Column title="Price" dataIndex="price" key="price" />
			<Column title="Residual Quantity" dataIndex="quantity" key="quantity" />
			<Column title="State" dataIndex="state" key="state" />
			<Column title="Action" key="action" render={renderAction} />
		</Table>
		<Modal visible={visible} footer={null} title="Edit Product" onCancel={() => setVisible(false)}>
			<ProductForm form={form} onFinish={editFinished} />
		</Modal>
	</>

}) 