import { Form, Input, Button } from 'antd'
import React, { useState } from 'react'
import { history } from "umi";


async function login({ email, password }) {
	try {
		const res = await fetch('/api/login', {
			method: 'POST',
			body: JSON.stringify({ email, password }),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		if (res.status !== 200) {
			console.error(await res.text());
			return;
		}
		const data = await res.json();
		localStorage.setItem("isLogin", "true");
		history.push('/');
	} catch (err) {
		console.error(err)
	}
}

export default function () {
	const [loading, setLoading] = useState(false)
	const onFinish = async (values: any) => {
		setLoading(true)
		await login(values)
		setLoading(false)
	};

	const onFinishFailed = (errorInfo: any) => {
		console.log('Failed:', errorInfo);
	};

	return (
		<Form
			labelCol={{ span: 8 }}
			wrapperCol={{ span: 16 }}
			onFinish={onFinish}
			onFinishFailed={onFinishFailed}
			autoComplete="off"
			className='w-96'
		>
			<Form.Item
				label="Email"
				name="email"
				rules={[{ required: true, message: 'Please input your email!' }]}
			>
				<Input />
			</Form.Item>

			<Form.Item
				label="Password"
				name="password"
				rules={[{ required: true, message: 'Please input your password!' }]}
			>
				<Input.Password />
			</Form.Item>


			<Form.Item wrapperCol={{ offset: 8, span: 16 }}>
				<Button type="primary" htmlType="submit" loading={loading}>
					Submit
				</Button>
			</Form.Item>
		</Form>
	)
}