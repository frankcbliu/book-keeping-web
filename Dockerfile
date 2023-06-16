# 第一阶段：构建 Node 项目
FROM node:16 AS frontend

# 安装指定版本的 Yarn
RUN curl -o install.sh https://yarnpkg.com/install.sh && chmod +x install.sh
ENTRYPOINT ["install.sh", "--version=1.22.19"]

# 复制应用程序代码并安装依赖
WORKDIR /app
COPY ./frontend/package.json ./frontend/yarn.lock ./

# 设置 Yarn 镜像源和缓存目录，并安装依赖项
RUN yarn config set registry https://registry.npm.taobao.org && \
    yarn config set cache-folder /app/.yarn-cache && \
    yarn install --frozen-lockfile

# 将当前目录复制到 Docker 镜像中的 /app 目录
COPY ./frontend /app

# 编译 React 项目
RUN yarn build

# 第二阶段：构建 Golang 二进制文件
FROM golang:1.20.4 AS builder

# 设置依赖代理
ENV GOPROXY=https://goproxy.cn
ENV CGO_ENABLED=1
ENV GIN_MODE=release

# 将当前目录复制到 Docker 镜像中的 /app 目录
COPY . /app

# 把前端打包好后复制过来
COPY --from=frontend /app/build /app/frontend/build

# 设置工作目录为 /app
WORKDIR /app

# 设置时区
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
RUN echo "Asia/Shanghai" > /etc/timezone

# 拉取依赖
RUN go get -d -v ./...

# 编译 Golang 二进制文件
RUN go build -o main .

# 暴露 9988 端口
EXPOSE 9988

# 运行 Golang 二进制文件
CMD ["/app/main"]