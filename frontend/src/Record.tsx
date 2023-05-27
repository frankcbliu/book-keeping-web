import React, {useEffect, useState} from 'react';
import {API_BASE_URL, AXIOS_CONFIG} from "./constants";
import {Card, List} from 'antd';
import axios from "axios";

interface LedgerItem {
    id: number;
    name: string;
}

const Record: React.FC = () => {

    const [data, setData] = useState<LedgerItem[]>([]);

    useEffect(() => {
        axios.post<LedgerItem[]>(API_BASE_URL + "/ledger/list",{}, AXIOS_CONFIG).then((response) => {
            setData(response.data);
        });
    }, []);

    return (
        <List
            grid={{gutter: 16, column: 1}}
            dataSource={data}
            renderItem={(item) => (
                <List.Item>
                    <Card title={item.name}>
                        <p>ID：{item.id}</p>
                    </Card>
                </List.Item>
            )}
        />
    );
};

export default Record;