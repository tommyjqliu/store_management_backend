import React, { useState } from "react"
import { Form, Input, Select, Button, FormInstance, InputNumber } from 'antd';

export type formProps = {
	onFinish: (values: any) => void
	isCreate?: Boolean
	form?: FormInstance
}

export default ({ onFinish, form, isCreate=false }: formProps) => {

	const [loading, setLoading] = useState(false)
	const waitFinish = async (value: any) => {
		setLoading(true)
		await onFinish(value)
		setLoading(false)
	}

	return <>
		<Form
			labelCol={{ span: 8 }}
			wrapperCol={{ span: 16 }}
			onFinish={waitFinish}
			form={form}
		>
			<Form.Item
				label="Id"
				name="id"	
				rules={[{ required: false, message: 'required field' }]}
			>
				<InputNumber disabled={!isCreate} placeholder="auto"/>
			</Form.Item>
			<Form.Item
				label="Name"
				name="name"
				rules={[{ required: true, message: 'required field' }]}
			>
				<Input />
			</Form.Item>
			<Form.Item
				label="Category"
				name="categorys"
				rules={[{ required: true, message: 'required field' }]}
			>
				<Select mode="tags" dropdownClassName="invisible"></Select>
			</Form.Item>
			<Form.Item
				label="Description"
				name="description"
				rules={[{ required: true, message: 'required field' }]}
			>
				<Input />
			</Form.Item>
			<Form.Item
				label="Picture URLs"
				name="pictures"
			>
				<Select mode="tags" dropdownClassName="invisible"></Select>
			</Form.Item>
			<Form.Item
				label="Price"
				name="price"
				rules={[{ required: true, message: 'required field' }]}
			>
				<InputNumber />
			</Form.Item>
			<Form.Item
				label="Quantity"
				name="quantity"
				rules={[{ required: true, message: 'required field' }]}
			>
				<InputNumber />
			</Form.Item>
			<Form.Item
				label="State"
				name="state"
				rules={[{ required: true, message: 'required field' }]}
				initialValue="ONSALE"
			>
				<Select>
					<Select.Option value="FREEZE" key="FREEZE">FREEZE</Select.Option>
					<Select.Option value="ONSALE" key="ONSALE">ONSALE</Select.Option>
				</Select>
			</Form.Item>
			<Form.Item wrapperCol={{ offset: 8, span: 16 }}>
				<Button type="primary" htmlType="submit" loading={loading}>
					Create
				</Button>
			</Form.Item>
		</Form>
	</>
}