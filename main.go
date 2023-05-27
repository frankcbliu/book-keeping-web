package main

import (
	"book-keeping-web/conf"
	"book-keeping-web/models"
	"book-keeping-web/routers"
)

func main() {
	// 初始化
	conf.InitSetting()
	models.InitSqlite()
	r := routers.InitRouter()

	// 启动服务
	r.Run(conf.Setting.Server.Addr)
}
