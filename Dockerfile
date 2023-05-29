# 第一阶段：构建 Golang 二进制文件
FROM golang:latest AS builder

ENV GOPROXY=https://goproxy.cn

# 将当前目录复制到 Docker 镜像中的 /app 目录
COPY . /app

# 设置工作目录为 /app
WORKDIR /app

# 编译 Golang 二进制文件
RUN go build -o main .

# 第二阶段：构建 Node 项目
FROM node:latest AS frontend

# 安装 Yarn
RUN curl -o- -L https://yarnpkg.com/install.sh | bash

# 将当前目录复制到 Docker 镜像中的 /app 目录
COPY ./frontend /app

# 设置工作目录为 /app
WORKDIR /app

# 安装项目依赖项
RUN yarn install

# 编译 React 项目
RUN yarn build

# 第三阶段：合并 Golang 二进制文件和 Node 项目
FROM alpine:latest

# 将 Golang 二进制文件复制到 Docker 镜像中的 /app 目录
COPY --from=builder /app/main /app/main

# 将 Node 项目的静态文件复制到 Docker 镜像中的 /app/build 目录
COPY --from=frontend /app/build /app/frontend/build

# 暴露 8080 端口
EXPOSE 8080

# 运行 Golang 二进制文件
CMD ["/app/main"]