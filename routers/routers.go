package routers

import (
	"github.com/gin-gonic/gin"
)

// InitRouter 初始化路由
func InitRouter() *gin.Engine {
	r := gin.Default()
	// 初始化
	user := r.Group("/user")
	{
		user.POST("/register", UserRegister) // 注册
		user.POST("/login", UserLogin)       // 登录
	}
	//user.Use(utils.CookieCheck()) // 需要登录校验的接口的使用方法
	// 单接口的登录校验
	//r.GET("/home", utils.CookieCheck(), func(c *gin.Context) {
	//	c.JSON(200, gin.H{"data": "Your home page"})
	//})
	return r
}
