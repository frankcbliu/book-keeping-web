import { message } from "antd"

export const RecordType = {
    expense: "支出",
    income: "收入",
}

// 路由地址
export const RoutePath = {
    PATH_PREFIX_MAIN: "/main/*",
    PATH_RECORD: "/main/record",
    PATH_LEDGER: "/main/ledger",
    PATH_LOGIN: "/login",
}

// 共用的消息组件
export const commonMessage = {
    success: (msg: string) => {
        message.success(msg, 1)
    },
    warning: (msg: string) => {
        message.warning(msg, 1)
    },
    info: (msg: string) => {
        message.info(msg, 1)
    },
    error: (msg: string) => {
        message.error(msg, 1)
    },
}

// 日期 & 时间格式
export const DATE_TIME_FORMAT = "YYYY-MM-DD HH:mm:ss"