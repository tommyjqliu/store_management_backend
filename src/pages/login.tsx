import { Form, Input, Button } from 'antd'
import React from 'react'
import { history } from "umi";


async function login({email, password}) {
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
		alert(`欢迎回来，${data.name}`);
		// history.push('/posts/create');
	} catch (err) {
		console.error(err)
	}
}

export default function () {
	const onFinish = (values: any) => {
		console.log('Success:', values);
		login(values)
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
				<Button type="primary" htmlType="submit">
					Submit
				</Button>
			</Form.Item>
		</Form>
	)
}