import React, { useEffect, useState } from 'react';
import { Layout, Menu, MenuProps, theme } from 'antd';
import Classification from "./Classification";
import Record from "./Record";
import { Route, Routes, useNavigate } from "react-router-dom";
import ledgerApi from './api/ledger';
const { Header, Content, Footer } = Layout;

interface LedgerItem {
    id: number;
    name: string;
}

// 账本-分类 页面
const Main: React.FC = () => {
    const navigate = useNavigate()
    const [data, setData] = useState<LedgerItem[]>([]);
    const [ledgerId, setLedgerId] = useState(0);
    const [selectedKey, setSelectedKey] = React.useState<string[] | undefined>(
        data.length > 0 ? [data[0].id.toString()] : undefined
    );

    const [menus, setMenus] = React.useState<MenuProps['items']>()


    useEffect(() => {
        ledgerApi.ledgerList().then((response) => {
            const data = response.data["ledgers"] as LedgerItem[];
            setData(data);
            setLedgerId(data[0].id)
            setSelectedKey([data[0].id.toString()])
            setMenus([...Array.from({ length: data.length }, (_, index) => {
                const key = data[index].id.toString();
                const name = data[index].name
                return {
                    key,
                    label: `${name}`,
                }
            }), {
                label: '账单',
                key: 'record',
            },
            {
                label: '待使用',
                key: 'app',
            }
            ])
            navigate("/main/ledger")
        });
    }, []);

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const handleClick = (event: any) => {
        setSelectedKey([event.key])
        if (event.key === "record")
            navigate("/main/record")
        else { // 走账本
            setLedgerId(parseInt(event.key))
            navigate("/main/ledger")
        }
    };


    return (
        <Layout style={{ minHeight: '100vh', overflow: "hidden", backgroundColor: colorBgContainer }}>
            <Header style={headerStyle}>
                <Menu
                    theme="dark"
                    mode="horizontal"
                    selectedKeys={selectedKey}
                    items={menus}
                    onClick={handleClick}
                />
            </Header>
            <Content style={contentStyle}>
                <Routes>
                    <Route path="/ledger" element={<Classification ledgerId={ledgerId} />} />
                    <Route path="/record" element={<Record />} />
                </Routes>
            </Content>
            <Footer style={footerStyle}>Ant Design ©2023 Created by Ant
                UED</Footer>
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
};


const footerStyle: React.CSSProperties = {
    textAlign: 'center',
};

export default Main;