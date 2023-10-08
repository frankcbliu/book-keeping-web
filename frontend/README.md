# 启动

`yarn start`

目前主要页面:
- Login.tsx: 登录页面
- Main.tsx: 主体结构页面(上中下)
  - Classification.tsx (内容页面，单账本下的分类)
  - Record.tsx (账单页面，用于查看详情)

# 发布

因为服务器的机器 build 得很慢，所以建议在本地 `yarn build` 之后，再到服务器进行部署。服务器优先使用 `build/` 文件夹