import React from 'react';
import { Card, theme } from 'antd';
import { useNavigate } from "react-router-dom";

// 登录页面
const Record: React.FC = () => {
  const navigate = useNavigate()

  const onFinish = async (values: any) => {

  };


  const onFinishFailed = (errorInfo: any) => {
    localStorage.clear()
    console.log('Failed:', errorInfo);
  };

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <div style={{ backgroundColor: colorBgContainer }}>
      <Card title="Card title">
        <Card type="inner" title="Inner Card title" extra={<a href="#">More</a>}>
          Inner Card content
        </Card>
        <Card
          style={{ marginTop: 16 }}
          type="inner"
          title="Inner Card title"
          extra={<a href="#">More</a>}
        >
          Inner Card content
        </Card>
      </Card>
    </div>
  );
};

export default Record;