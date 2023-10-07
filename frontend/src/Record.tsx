import { ExclamationCircleOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Button, Card, DatePicker, Modal, Space, theme } from 'antd';
import { cacheService } from './services/cache';
import { RecordItem } from './api/interface';
import recordApi from './api/record';
import { DATE_TIME_FORMAT, commonMessage } from './constants';
import { Line } from '@ant-design/charts';
import { Pie } from '@ant-design/plots';

const { confirm } = Modal;

interface LineDataItem {
  date: string;
  date_unix: number;
  amount: number;
}
interface PieChartData {
  classification: string;
  sub_classification: string;
  amount: number;
}

// 登录页面
const Record: React.FC = () => {
  const [beginTime, setBeginTime] = useState<dayjs.Dayjs | null>(dayjs().subtract(10, 'day'));
  const [endTime, setEndTime] = useState<dayjs.Dayjs | null>(dayjs());
  const [recordList, setRecordList] = useState<RecordItem[]>([]);
  const [lineData, setLineData] = useState<LineDataItem[]>([]);
  const [pieData, setPieData] = useState<PieChartData[]>([]);

  useEffect(() => {
    if (!beginTime || !endTime)
      return

    cacheService.getRecordList(beginTime.format(DATE_TIME_FORMAT), endTime.format(DATE_TIME_FORMAT)).then((records) => {
      setRecordList(records)
      console.log(records)

      // // 计算折线图数据
      // calculateDateData(records)
    })

  }, [beginTime, endTime]);

  useEffect(() => {
    // 为折线图计算数据
    const calculateDateData = (recordList: RecordItem[]) => {
      let dateData = [];
      for (let item of recordList) {
        if (item.type !== "支出")
          continue
        let cur_date = dayjs(item.consumption_time)
        dateData.push({
          'date': cur_date.format('YYYY-MM-DD'),
          'date_unix': cur_date.unix(),
          'amount': Number(item.amount)
        })
      }
      // 合并相同日期的账单
      const result: LineDataItem[] = Object.values(dateData.reduce((acc: Record<string, LineDataItem>, curr) => {
        if (acc[curr.date]) {
          acc[curr.date].amount += curr.amount;
        } else {
          acc[curr.date] = { date: curr.date, amount: curr.amount, date_unix: curr.date_unix };
        }
        return acc;
      }, {}));
      // 排序
      result.sort(function (a, b) { return a.date_unix - b.date_unix })

      console.log(result)
      setLineData(result)
    }
    // 为饼图计算数据
    const calculatePieData = (recordList: RecordItem[]) => {
      const pieData: PieChartData[] = [];
      for (let item of recordList) {
        if (item.type !== "支出")
          continue

        pieData.push({
          'classification': item.classification,
          'sub_classification': item.sub_classification,
          'amount': Number(item.amount)
        })
      }
      // 合并相同类型的账单
      const result: PieChartData[] = Object.values(pieData.reduce((acc: Record<string, PieChartData>, curr) => {
        if (acc[curr.classification]) {
          acc[curr.classification].amount += curr.amount;
        } else {
          acc[curr.classification] = { classification: curr.classification, amount: curr.amount, sub_classification: curr.sub_classification };
        }
        acc[curr.classification].amount = Math.floor(acc[curr.classification].amount);
        return acc;
      }, {}));
      // 排序
      console.log(result)
      setPieData(result)
    }

    calculateDateData(recordList)
    calculatePieData(recordList)
  }, [recordList])


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

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const lineConfig = {
    data: lineData,
    xField: 'date',
    yField: 'amount',
    point: {
      size: 5,
      shape: 'diamond',
    },
  };


  const pieConfig = {
    appendPadding: 10,
    data: pieData,
    angleField: "amount",
    colorField: "classification",
    radius: 1,
    innerRadius: 0.5,
    label: {
      type: "inner",
      offset: "-50%",
      content: "{value}",
      style: {
        textAlign: "center",
        fontSize: 14
      }
    },
    interactions: [{ type: "element-selected" }, { type: "element-active" }],
    statistic: {
      title: false as const,
      content: {
        style: {
          whiteSpace: "pre-wrap",
          overflow: "hidden",
          textOverflow: "ellipsis"
        },
        formatter: function formatter() {
          return `total\n134`;
        }
      }
    }
  };

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
      <Card title="支出趋势" style={{ height: '90%' }}>
        <Line {...lineConfig} />
      </Card>
      <Card title="支出类型" style={{ height: '90%' }}>
        <Pie {...pieConfig} />
      </Card>
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