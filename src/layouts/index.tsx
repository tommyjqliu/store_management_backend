import React from 'react';
import { Link, Outlet, useLocation, history } from 'umi';
import { Layout, Menu,  Button } from 'antd';
import 'antd/dist/antd.css';

const { Header, Content, Footer } = Layout;

export default () => {
  const location = useLocation();
  const currentPath = location.pathname.split('/')[1]
  const logout = () => {
    localStorage.removeItem('isLogin')
    history.push('/login')
  }
  if (currentPath === 'login') {
    return (
      <Layout>
        {/* extra div to fix css priority problem */}
        <div className='min-h-screen'>

          <Content className="p-12 flex flex-col items-center">
            <div className='text-5xl p-12 font-medium'>Store Backend</div> 
            <div className="bg-white p-6 rounded-md w-min"><Outlet /></div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
        </div>
      </Layout>
    )
  }
  return (
    <Layout>
      {/* extra div to fix css priority problem */}
      <div className='min-h-screen'>
        <Header className='flex items-center justify-between'>
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[currentPath]}
            defaultSelectedKeys={['index']}
            items={[
              { label: <Link to="/">Index</Link>, key: '' },
              { label: <Link to="/product">Product</Link>, key: 'product' },
              { label: <Link to="/order">Order</Link>, key: 'order' },
            ]}
          />
          <Button danger type="primary" className='' onClick={logout}>Logout</Button>
        </Header>
        <Content className="p-12">
          <div className="bg-white p-6 rounded-md"><Outlet /></div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
      </div>
    </Layout>
  );
}
