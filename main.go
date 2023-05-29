package main

import (
	"book-keeping-web/conf"
	"book-keeping-web/models"
	"book-keeping-web/routers"
	"embed"
	"fmt"
	"github.com/gin-gonic/gin"
	"mime"
	"strings"
)

func main() {
	// 初始化
	conf.InitSetting()
	models.InitSqlite()
	r := routers.InitRouter()
	// 当 API 不存在时，返回静态文件
	r.NoRoute(FrontendRoute)

	// 启动服务
	r.Run(conf.Setting.Server.Addr)
}

// 使用 go:embed 注解，将文件内容嵌入到程序中
//
//go:embed frontend/build/*
var static embed.FS

func FrontendRoute(c *gin.Context) {
	path := c.Request.URL.Path                                   // 获取请求路径
	s := strings.Split(path, ".")                                // 分割路径，获取文件后缀
	prefix := "frontend/build"                                   // 前缀路径
	if data, err := static.ReadFile(prefix + path); err != nil { // 读取文件内容
		// 如果文件不存在，返回首页 index.html
		if data, err = static.ReadFile(prefix + "/index.html"); err != nil {
			c.JSON(404, gin.H{
				"err": err,
			})
		} else {
			c.Data(200, mime.TypeByExtension(".html"), data)
		}
	} else {
		// 如果文件存在，根据请求的文件后缀，设置正确的mime type，并返回文件内容
		c.Data(200, mime.TypeByExtension(fmt.Sprintf(".%s", s[len(s)-1])), data)
	}
}
