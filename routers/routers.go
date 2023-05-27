package routers

import (
	"book-keeping-web/utils"
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
	ledger := r.Group("/ledger")
	{
		ledger.Use(utils.CookieCheck())
		ledger.POST("/create", LedgerCreate) // 创建账本
		ledger.POST("/list", LedgerList)     // 查询账本
		ledger.POST("/delete", LedgerDelete) // 删除账本
	}

	// 单接口的登录校验
	//r.GET("/home", utils.CookieCheck(), func(c *gin.Context) {
	//	c.JSON(200, gin.H{"data": "Your home page"})
	//})
	return r
}
