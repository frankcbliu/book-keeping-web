import React, {useEffect, useState} from 'react';
import {AXIOS_CONFIG} from "./constants";
import {Layout, Menu, theme} from 'antd';
import axios from "axios";
import Classification from "./Classification";
import styles from './Main.module.css';

const {Header, Content, Footer} = Layout;

interface LedgerItem {
    id: number;
    name: string;
}

// 账本-分类 页面
const Main: React.FC = () => {

    const [data, setData] = useState<LedgerItem[]>([]);
    const [ledgerId, setLedgerId] = useState(0);

    useEffect(() => {
        axios.post("/ledger/list", {}, AXIOS_CONFIG).then((response) => {
            const data = response.data["data"]["ledgers"] as LedgerItem[];
            setData(data);
            setLedgerId(data[0].id)
            setSelectedKey([data[0].id.toString()])
        });
    }, []);

    const {
        token: {colorBgContainer},
    } = theme.useToken();

    const handleClick = (event: any) => {
        setLedgerId(parseInt(event.key))
        setSelectedKey([event.key])
    };

    const [selectedKey, setSelectedKey] = React.useState<string[] | undefined>(
        data.length > 0 ? [data[0].id.toString()] : undefined
    );

    return (
        <Layout className="layout">
            <Header style={{display: 'flex', alignItems: 'center'}}>
                <div className="demo-logo"/>
                <Menu
                    theme="dark"
                    mode="horizontal"
                    selectedKeys={selectedKey}
                    items={
                        Array.from({length: data.length}, (_, index) => {
                            const key = data[index].id.toString();
                            const name = data[index].name
                            return {
                                key,
                                label: `${name}`,
                            }
                        })
                    }
                    onClick={handleClick}
                />
            </Header>
            <Content style={{padding: '2px 10px', minHeight:"100%"}}>
                <div className="site-layout-content" style={{background: colorBgContainer}}>
                    <Classification ledgerId={ledgerId}/>
                </div>
            </Content>
            <Footer className={styles.footer} style={{textAlign: 'center'}}>Ant Design ©2023 Created by Ant UED</Footer>
        </Layout>

    );
};

export default Main;