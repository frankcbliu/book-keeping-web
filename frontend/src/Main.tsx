import React, { useEffect, useMemo, useState } from 'react';
import { Layout, Menu } from 'antd';
import Classification from "./Classification";
import Record from "./Record";
import { Route, Routes, useNavigate } from "react-router-dom";
import { RoutePath } from './constants'
import { LedgerItem } from './api/interface';
import { cacheService } from './services/cache';

const { Header, Content, Footer } = Layout;

enum FixedMenuKey {
  // 账单
  RECORD = 'record',
}

const FixedMenuItems = [{
  label: '账本',
  key: FixedMenuKey.RECORD,
}]

// 账本-分类 页面
const Main: React.FC = () => {
  const navigate = useNavigate()
  const [ledgerList, setLegerList] = useState<LedgerItem[]>([]);
  const [activeLedgerId, setActiveLedgerId] = useState<number>(0);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([FixedMenuKey.RECORD]);
  const menuItems = useMemo(() => (ledgerList.map(({ id, name }) => ({
    key: String(id),
    label: name
  })).concat(...FixedMenuItems)), [ledgerList]);

  useEffect(() => {
    document.querySelector('meta[name="apple-mobile-web-app-capable"]')?.setAttribute('content', 'yes')
    document.querySelector('meta[name="viewport"]')?.setAttribute('content', 'width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no')
  })

  useEffect(() => {
    cacheService.getLedgerList().then((ledgerList) => {
      if (!ledgerList.length) {
        navigate(RoutePath.PATH_LOGIN)
        return;
      }

      setLegerList(ledgerList);
      const defaultLedgerId = ledgerList[0].id;
      setSelectedKeys([String(defaultLedgerId)])
      setActiveLedgerId(defaultLedgerId)
      navigate(RoutePath.PATH_LEDGER)
    })
  }, []);

  const handleMenuClick = (menuKey: string) => {
    setSelectedKeys([menuKey])
    if (menuKey === FixedMenuKey.RECORD) {
      navigate(RoutePath.PATH_RECORD)
    } else {
      // 走账本
      navigate(RoutePath.PATH_LEDGER)
      setActiveLedgerId(Number(menuKey))
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', overflow: "hidden" }}>
      <Header style={headerStyle}>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={selectedKeys}
          items={menuItems}
          onClick={({ key }) => handleMenuClick(key)}
        />
      </Header>
      <Content style={contentStyle}>
        <Routes>
          <Route path="/ledger" element={<Classification ledgerId={activeLedgerId} />} />
          <Route path="/record" element={<Record />} />
        </Routes>
      </Content>
      <Footer style={footerStyle}>Ant Design ©2023 Created by Ant UED</Footer>
    </Layout>
  );
};


const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  height: 64,
  lineHeight: '64px',
};

const contentStyle: React.CSSProperties = {
  minHeight: 120,
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#fff'
};


const footerStyle: React.CSSProperties = {
  textAlign: 'center',
};

export default Main;