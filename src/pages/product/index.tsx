import React, { useEffect, useRef, useState } from "react";
import { Table, Tag, Space, Button, Modal } from 'antd';
import { Category, Product } from '@prisma/client'
import ProductForm from './_form'
import ProductTable, {TableRef} from './_table'

export default () => {
	const [visible, setVisible] = useState(false)
	const tableRef  = useRef<TableRef>(null)
	const createFinished = async (record: Product) => {
		await fetch(`/api/product`, {
			method: 'POST',
			body: JSON.stringify(record),
			headers: { 'Content-Type': 'application/json' }
		})
		tableRef.current?.refresh()
		setVisible(false)
	}

	return <>
		<Button onClick={() => setVisible(true)}>Create Product</Button>
		<Modal visible={visible} footer={null} title="Create Product" onCancel={() => setVisible(false)}>
			<ProductForm onFinish={createFinished} isCreate/>
		</Modal>

		<ProductTable ref={tableRef}></ProductTable>
	</>
}