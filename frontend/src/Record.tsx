import { ExclamationCircleOutlined } from '@ant-design/icons';
import React, { useEffect, useRef, useState } from 'react';
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

interface SubPieChartData {
  sub_classification: string;
  amount: number;
}

interface PieChartData {
  classification: string;
  sub_classification: SubPieChartData[];
  amount: number;
}

// 登录页面
const Record: React.FC = () => {
  const [beginTime, setBeginTime] = useState<dayjs.Dayjs | null>(dayjs().subtract(10, 'day'));
  const [endTime, setEndTime] = useState<dayjs.Dayjs | null>(dayjs());
  const [recordList, setRecordList] = useState<RecordItem[]>([]);
  const [lineData, setLineData] = useState<LineDataItem[]>([]);
  const [pieData, setPieData] = useState<PieChartData[]>([]);
  const [subPieData, setSubPieData] = useState<SubPieChartData[]>([]);


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
      const pies: PieChartData[] = [];
      for (let item of recordList) {
        if (item.type !== "支出")
          continue

        let pie: PieChartData = {
          classification: item.classification || '其他',
          sub_classification: [],
          amount: Number(item.amount)
        }
        pie.sub_classification.push({ sub_classification: item.sub_classification || '其他', amount: Number(item.amount) })
        pies.push(pie)
      }
      // 合并相同类型的账单
      const result: PieChartData[] = Object.values(pies.reduce((acc: Record<string, PieChartData>, curr) => {
        if (acc[curr.classification]) {
          acc[curr.classification].amount += curr.amount;
          acc[curr.classification].sub_classification = acc[curr.classification].sub_classification.concat(curr.sub_classification);
        } else {
          acc[curr.classification] = { classification: curr.classification, amount: curr.amount, sub_classification: curr.sub_classification };
        }
        acc[curr.classification].amount = Math.floor(acc[curr.classification].amount);
        return acc;
      }, {}));

      if (result.length <= 0)
        return

      // 排序
      console.log('setPieData', result)
      setPieData(result)
    }

    calculateDateData(recordList)
    calculatePieData(recordList)

  }, [recordList])


  useEffect(() => {
    pieDataRef.current = pieData;
  }, [pieData])

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

  const commonConfig = {
    angleField: "amount",
    appendPadding: 10,
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
  }

  const commonStyle = {
    whiteSpace: "pre-wrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  }

  const pieConfig = {
    ...commonConfig,
    data: pieData,
    colorField: "classification",
    statistic: {
      title: false as const,
      content: {
        style: commonStyle,
        formatter: function formatter() {
          // 统计所有支出
          let total_res = 0;
          for (let i = 0; i < pieData.length; i++) {
            const element = pieData[i];
            total_res += element.amount;
          }
          return '' + total_res;
        }
      }
    }
  };

  const subPieConfig = {
    ...commonConfig,
    data: subPieData,
    colorField: "sub_classification",
    statistic: {
      title: false as const,
      content: {
        style: commonStyle,
        formatter: function formatter() {
          // 统计所有支出
          let total_res = 0;
          for (let i = 0; i < subPieData.length; i++) {
            const element = subPieData[i];
            total_res += element.amount;
          }
          return '' + total_res;
        }
      }
    }
  };

  const pieDataRef = useRef<PieChartData[]>();

  const onPieClick = (...args: any[]) => {
    console.log(pieConfig, subPieConfig)
    if (args[0].type !== "element:click") {
      return
    }
    if (!pieDataRef.current) {
      return
    }
    for (let i = 0; i < pieDataRef.current.length; i++) {
      const element = pieDataRef.current[i];
      console.log(element.classification, args[0].data.data.classification)
      if (element.classification === args[0].data.data.classification) {
        // 打印当前点击的元素
        console.log(element.sub_classification)
        // 合并相同类型的账单
        const result: SubPieChartData[] = Object.values(element.sub_classification.reduce((acc: Record<string, SubPieChartData>, curr) => {
          if (acc[curr.sub_classification]) {
            acc[curr.sub_classification].amount += curr.amount;
          } else {
            acc[curr.sub_classification] = { sub_classification: curr.sub_classification, amount: curr.amount };
          }
          acc[curr.sub_classification].amount = Math.floor(acc[curr.sub_classification].amount);
          return acc;
        }, {}));

        // 排序
        console.log('sort res', result)
        setSubPieData(result)
        break
      }
    }
  }

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
        <Pie {...pieConfig} onReady={(plot) => {
          plot.on('element:click', onPieClick);
        }}
        />
        <Pie {...subPieConfig} />
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