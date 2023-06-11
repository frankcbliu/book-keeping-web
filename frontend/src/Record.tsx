import { ExclamationCircleOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Button, Card, DatePicker, Modal, Space, theme } from 'antd';
import { useNavigate } from "react-router-dom";
import { cacheService } from './services/cache';
import { RecordItem } from './api/interface';
import recordApi from './api/record';
import { DATE_TIME_FORMAT, commonMessage } from './constants';

const { confirm } = Modal;

// 登录页面
const Record: React.FC = () => {
  const [beginTime, setBeginTime] = useState<dayjs.Dayjs | null>(dayjs().subtract(10, 'day'));
  const [endTime, setEndTime] = useState<dayjs.Dayjs | null>(dayjs());
  const [recordList, setRecordList] = useState<RecordItem[]>([]);

  const navigate = useNavigate()

  const onFinish = async (values: any) => {

  };

  useEffect(() => {
    if (!beginTime || !endTime)
      return

    cacheService.getRecordList(beginTime.format(DATE_TIME_FORMAT), endTime.format(DATE_TIME_FORMAT)).then((records) => {
      setRecordList(records)
      console.log(records)
    })

  }, [beginTime, endTime]);


  const format = (date: string) => {
    return dayjs(date).format("YYYY-MM-DD")
  };

  // 删除账单
  const deleteRecord = (id: number) => {
    confirm({
      'okText': '确认',
      'cancelText': '取消',
      'title': '是否删除 id:' + id,
      'icon': <ExclamationCircleOutlined />,
      onOk() {
        recordApi.deleteRecord(id).then((res) => {
          cacheService.NeedToUpdateRecord()
          setRecordList(recordList.filter((record) => {
            return record.id !== id
          }))
          commonMessage.success('删除' + id + '成功')
        })
      },
      onCancel() {
        commonMessage.warning('取消删除')
      }
    })
  }

  const onFinishFailed = (errorInfo: any) => {
    localStorage.clear()
    console.log('Failed:', errorInfo);
  };

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <div style={{ backgroundColor: colorBgContainer }}>
      <div style={{ height: '5vh', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
        <Button style={{ backgroundColor: '#09aeae', color: 'white' }} onClick={() => {
          setBeginTime(dayjs().subtract(7, 'day')); setEndTime(dayjs())
        }} >近一周</Button>
        <Button style={{ backgroundColor: '#09aeae', color: 'white' }} onClick={() => {
          setBeginTime(dayjs().subtract(1, 'month')); setEndTime(dayjs())
        }} >近一月</Button>
        <Button style={{ backgroundColor: '#09aeae', color: 'white' }} onClick={() => {
          setBeginTime(dayjs().subtract(1, 'year')); setEndTime(dayjs())
        }} >近一年</Button>
      </div>
      <Space style={{ height: '5vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ color: "black" }}>起始:</div>
        <DatePicker value={beginTime} onChange={(date) => { setBeginTime(date) }} placeholder='开始日期' />
        <div style={{ color: "black" }}>截止:</div>
        <DatePicker value={endTime} onChange={(date) => { setEndTime(date) }} placeholder='截止日期' />
      </Space>
      <Card style={{ height: '90%' }}>
        {
          recordList.map((item) => {
            return <Card key={item.id} type="inner" title={format(item.consumption_time)} extra={
              <div style={{ display: 'flex', }}>
                <div style={{ color: 'green', marginRight: '5px' }} >{item.type}</div>
                <div>{'¥' + item.amount}</div>
              </div>
            } style={{ marginBottom: '3%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>{item.classification + '-' + item.sub_classification + ' ' + item.note}</div>
                <Button danger onClick={() => { deleteRecord(item.id) }}>删除</Button>
              </div>
            </Card>
          })
        }
      </Card>
    </div >
  );
};

export default Record;