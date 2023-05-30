# book-keeping-web

基于 Go + Sqlite + React + Antd 搭建个人记账 web 软件

## v0.4 - 2023年05月30日
- [x] 调整后端接口路由，统一加上 `/api` 前缀
- [x] 重构前端代码架构 - 重构 api 结构
- [ ] 重构前端代码架构 - 重构 页面 结构

## v0.3 - 2023年05月29日

- [x] 支持 docker-compose 构建部署
  - 启动方法: `docker-compose -d up`
- [x] 完成部署构建流程
- [x] 修复前端样式

## v0.2 - 2023年05月28日

- [x] 新增账单的 crud 接口
- [x] 初始化 web 页面
- [x] 解决测试环境的跨域问题
    - 前端需要使用代理
- [x] 调整后端请求参数解析
- [x] 前端支持添加账单

## v0.1 - 2023年05月27日

- [x] 新增账本库表
- [x] 新增账本创建接口
- [x] 新增账本读取接口
- [x] 新增账本删除接口
- [x] 修复登录校验功能
- [x] 新增分类、子分类的 crud 接口

启动方式:

- `terminal` 执行：`air` 即可