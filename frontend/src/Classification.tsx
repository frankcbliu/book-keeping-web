import {Card, Col, Row, theme} from 'antd';
import React, {useEffect, useState} from 'react';
import axios from "axios";
import {AXIOS_CONFIG} from "./constants";


interface ClassificationItem {
    id: number;
    name: string;
}

function splitArray<T>(array: T[], size: number): T[][] {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
}

interface Props {
    ledgerId: number;
}

const Classification: React.FC<Props> = ({ledgerId}) => {

    const [classification, setClassification] = useState<ClassificationItem[]>([]);

    useEffect(() => {
        if (!ledgerId)
            return
        axios.post("/classification/list", {'ledger_id': ledgerId}, AXIOS_CONFIG).then((response) => {
            const data = response.data["data"]["classifications"] as ClassificationItem[];
            setClassification(data);
        });
    }, [ledgerId]);

    const rows = splitArray(classification, 2); // 将数据源分成多个数组，每个数组包含2个元素
    const {
        token: {colorBgContainer},
    } = theme.useToken();
    return (
        <div style={{minHeight:"100%"}}>
            {rows.map((row, rowIndex) => (
                <Row key={rowIndex} gutter={[16, 16]} style={{backgroundColor: colorBgContainer, padding:"10px"}}>
                    {row.map((item, itemIndex) => (
                        <Col key={itemIndex} span={12}>
                            <Card title={item.name}>Money, 占空</Card>
                        </Col>
                    ))}
                </Row>
            ))}
        </div>
    )
}

export default Classification;