import {
    Card,
    Col,
    DatePicker,
    Form,
    InputNumber,
    message,
    Modal,
    Radio,
    RadioChangeEvent,
    Row,
    Select,
    Space,
    theme,
    TimePicker
} from 'antd';
import React, {useEffect, useState} from 'react';
import axios from "axios";
import {AXIOS_CONFIG} from "./constants";
import dayjs from 'dayjs';
import TextArea from "antd/es/input/TextArea";

interface ClassificationItem {
    id: number;
    name: string;
}

interface SubClassificationItem {
    id: number;
    name: string;
}

interface FormDataItem {
    note?: string // 备注
    data_type?: string // 消费类型
    cur_classification_id?: number // 分类id
    cur_sub_classification_id?: number // 子分类id
    amount?: number | null // 金额
    consumption_time?: dayjs.Dayjs // 日期-时间
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

// 分类子页面
const Classification: React.FC<Props> = ({ledgerId}) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [classification, setClassification] = useState<ClassificationItem[]>([]);
    const [sub_classification, setSubClassification] = useState<SubClassificationItem[]>([]);
    // 模态
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [data, setData] = useState<FormDataItem>(
        {data_type: "expense", consumption_time: dayjs()});
    const rows = splitArray(classification, 2); // 将数据源分成多个数组，每个数组包含2个元素
    const {
        token: {colorBgContainer},
    } = theme.useToken();


    useEffect(() => {
        if (!ledgerId)
            return
        axios.post("/classification/list", {'ledger_id': ledgerId}, AXIOS_CONFIG).then((response) => {
            const data = response.data["data"]["classifications"] as ClassificationItem[];
            setClassification(data);
        });
    }, [ledgerId]);

    useEffect(() => {
        console.log('update cur cf')
        if (!data || !data.cur_classification_id)
            return
        axios.post("/sub_classification/list", {'classification_id': data.cur_classification_id}, AXIOS_CONFIG).then((response) => {
            const data = response.data["data"]["sub_classifications"] as SubClassificationItem[];
            setSubClassification(data);
        });
    }, [data?.cur_classification_id])


    const handleCard = (id: number) => {
        // 打开 modal
        setOpen(true);
        // 初始化
        setData({...data, cur_classification_id: id, consumption_time: dayjs()})
    };

    // 创建账单记录
    const handleOk = () => {
        axios.post("/record/create", {
            "classification_id": data.cur_classification_id,
            "sub_classification_id": data.cur_sub_classification_id,
            "note": data.note,
            "type": data.data_type,
            "amount": data.amount?.toString(),
            "consumption_time": data.consumption_time?.format("YYYY-MM-DD HH:mm:ss")
        }, AXIOS_CONFIG).then((response) => {
            const code = response.data["code"]
            if (code == 0) {
                messageApi.open({
                    type: 'success',
                    content: response.data["msg"],
                });
                // 重新初始化
                setData({...data, amount: null, cur_sub_classification_id: 0, note: ""})
            } else {
                messageApi.open({
                    type: 'error',
                    content: response.data["msg"],
                });
            }
            setOpen(false);
        }).catch((err) => {
            messageApi.open({
                type: 'error',
                content: err["message"],
            });
        });
    };

    const handleSubCf = (e: RadioChangeEvent) => {
        setData({...data, cur_sub_classification_id: e.target.value})
    };

    return (
        <div style={{minHeight: "100%"}}>
            {contextHolder}
            {rows.map((row, rowIndex) => (
                <Row key={rowIndex} gutter={[16, 16]} style={{backgroundColor: colorBgContainer, padding: "10px"}}>
                    {row.map((item, itemIndex) => (
                        <Col key={itemIndex} span={12}>
                            <Card id={item.id.toString()} title={item.name}
                                  onClick={(e) => handleCard(item.id)}>Money, 占空</Card>
                        </Col>
                    ))}
                </Row>
            ))}
            <Modal
                title="创建账单"
                open={open}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={() => {
                    setOpen(false);
                }}
            >
                <Form
                    labelCol={{span: 4}}
                    wrapperCol={{span: 14}}
                    layout="horizontal"
                    style={{maxWidth: 600}}
                >
                    <Form.Item label="交易信息">
                        <Space direction="horizontal">
                            <Space.Compact>
                                <Select value={data.data_type} onChange={(value) => {
                                    setData({...data, data_type: value})
                                }}>
                                    <Select.Option value="expense">支出</Select.Option>
                                    <Select.Option value="income">收入</Select.Option>
                                </Select>
                            </Space.Compact>
                            <Space.Compact>
                                <DatePicker value={data.consumption_time} onChange={(e) => {
                                    if (e) setData({...data, consumption_time: e})
                                }}/>
                            </Space.Compact>
                            <Space.Compact>
                                <TimePicker value={data.consumption_time} onChange={(e) => {
                                    if (e) setData({...data, consumption_time: e})
                                }}/>
                            </Space.Compact>
                        </Space>
                    </Form.Item>
                    <Form.Item label="金额">
                        <InputNumber addonAfter="￥" value={data.amount} onChange={(value) => {
                            setData({...data, amount: value})
                        }}/>
                    </Form.Item>
                    <Form.Item label="子类别">
                        <Radio.Group onChange={handleSubCf} value={data.cur_sub_classification_id}
                                     buttonStyle="solid">
                            {sub_classification.map((item, index) => (
                                <Radio.Button key={index} value={item.id}>{item.name}</Radio.Button>
                            ))}
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="更多信息">
                        <TextArea rows={2} placeholder="备注" value={data.note}
                                  onChange={(e) => setData({...data, note: e.target.value})}/>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default Classification;