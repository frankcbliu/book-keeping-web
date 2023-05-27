package main

import (
	"go-gin-gorm-demo/conf"
	"go-gin-gorm-demo/models"
	"go-gin-gorm-demo/routers"
)

func main() {
	// 初始化
	conf.InitSetting()
	models.InitSqlite()
	r := routers.InitRouter()

	// 启动服务
	r.Run(conf.Setting.Server.Addr)
}
