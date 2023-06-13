import {
  Card,
  Col,
  DatePicker,
  Form,
  InputNumber,
  Modal,
  Radio,
  RadioChangeEvent,
  Row,
  Select,
  Space,
  theme,
  TimePicker
} from 'antd';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import TextArea from "antd/es/input/TextArea";
import recordApi, { RecordCreateParams } from './api/record';
import { commonMessage, DATE_TIME_FORMAT, RecordType } from './constants';
import { cacheService } from "./services/cache";
import { ClassificationId, ClassificationItem, LedgerId, RecordItem } from './api/interface';

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
const Classification: React.FC<Props> = ({ ledgerId }) => {
  const [classification, setClassification] = useState<ClassificationItem[]>([]);
  const [sub_classification, setSubClassification] = useState<SubClassificationItem[]>([]);
  // 模态
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<FormDataItem>({ data_type: RecordType.expense, consumption_time: dayjs() });
  const rows = splitArray(classification, 2); // 将数据源分成多个数组，每个数组包含2个元素
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(() => {
    const updateLedgerId = async function () {
      if (!ledgerId)
        return
      const classifications = await cacheService.getClassificationList(ledgerId)
      for (let i = 0; i < classifications.length; i++) {
        const { amount, amount_rate } = await getAMountRateStr(ledgerId, classifications[i].id)
        classifications[i].amount = amount
        classifications[i].amount_rate = amount_rate
      }
      setClassification(classifications)
    }
    updateLedgerId()
  }, [ledgerId]);

  useEffect(() => {
    if (!data || !data.cur_classification_id)
      return
    cacheService.getSubClassificationList(data.cur_classification_id).then((sub_classifications) => {
      setSubClassification(sub_classifications);
    });
  }, [data, data?.cur_classification_id])


  const handleCard = (id: number) => {
    // 打开 modal
    setOpen(true);
    // 初始化
    setData({ ...data, cur_classification_id: id, consumption_time: dayjs() })
  };

  // 创建账单记录
  const handleOk = () => {
    const req: RecordCreateParams = {
      "classification_id": data.cur_classification_id,
      "sub_classification_id": data.cur_sub_classification_id,
      "note": data.note,
      "type": data.data_type,
      "amount": data.amount?.toString(),
      "consumption_time": data.consumption_time?.format("YYYY-MM-DD HH:mm:ss")
    };
    recordApi.recordCreate(req).then((res: any) => {
      const { msg } = res
      commonMessage.success(msg)
      // 重新初始化
      setData({ ...data, amount: null, cur_sub_classification_id: 0, note: "" })
      setOpen(false);
      cacheService.NeedToUpdateRecord()
    }).catch((err) => {
      commonMessage.error(err)
    })
  };

  const handleSubCf = (e: RadioChangeEvent) => {
    setData({ ...data, cur_sub_classification_id: e.target.value })
  };

  // 计算占比
  const getAMountRateStr = async (ledger_id: LedgerId, classification_id: ClassificationId) => {
    const records = await cacheService.getRecordList(dayjs().subtract(1, 'month').format(DATE_TIME_FORMAT), dayjs().format(DATE_TIME_FORMAT))
    let sum_amount = 0
    for (let i = 0; i < records.length; i++) {
      const element = records[i];
      sum_amount += parseFloat(element.amount)
    }

    const ledgerName = await cacheService.GetLedgerName(ledger_id)
    const classificationName = await cacheService.getClassificationName(ledger_id, classification_id)
    let amount = 0
    records.filter((record: RecordItem) => {
      return record.ledger === ledgerName && record.classification === classificationName
    }).forEach((record) => {
      amount += parseFloat(record.amount)
    })

    return { amount: amount, amount_rate: amount / sum_amount }
  }

  return (
    <div style={{ backgroundColor: colorBgContainer, marginTop: 16 }}>
      {rows.map((row, rowIndex) => (
        <Row key={rowIndex} style={{
          backgroundColor: colorBgContainer, marginBottom: 16,
          padding: "0px 16px"
        }}
          justify={"space-between"} align={"middle"}>
          {row.map((item, itemIndex) => (
            <Col key={itemIndex} span={11}>
              <Card id={item.id.toString()} title={item.name}
                onClick={(e) => handleCard(item.id)}>
                {
                  item.amount ?
                    <>
                      <span style={{ color: 'green' }}>{"¥" + (Number.isInteger(item.amount) ? item.amount : item.amount.toFixed(2))}</span>
                      {"(" + (item.amount_rate * 100).toFixed(2) + '%)'}
                    </>
                    :
                    <div>无</div>
                }
              </Card>
            </Col>
          ))}
        </Row>
      ))}
      <Modal
        title="创建账单"
        open={open}
        onOk={handleOk}
        onCancel={() => {
          setOpen(false);
        }}
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          style={{ maxWidth: 600 }}
        >
          <Form.Item label="交易信息">
            <Space direction="horizontal">
              <Space.Compact>
                <Select value={data.data_type} onChange={(value) => {
                  setData({ ...data, data_type: value })
                }}>
                  <Select.Option value={RecordType.expense}>{RecordType.expense}</Select.Option>
                  <Select.Option value={RecordType.income}>{RecordType.income}</Select.Option>
                </Select>
              </Space.Compact>
              <Space.Compact>
                <DatePicker value={data.consumption_time} onChange={(e) => {
                  if (e) setData({ ...data, consumption_time: e })
                }} />
              </Space.Compact>
              <Space.Compact>
                <TimePicker value={data.consumption_time} onChange={(e) => {
                  if (e) setData({ ...data, consumption_time: e })
                }} />
              </Space.Compact>
            </Space>
          </Form.Item>
          <Form.Item label="金额">
            <InputNumber type={"number"} pattern="[0-9]*" addonAfter="￥" value={data.amount} onChange={(value) => {
              setData({ ...data, amount: value })
            }} />
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
              onChange={(e) => setData({ ...data, note: e.target.value })} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Classification;