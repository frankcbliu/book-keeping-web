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
	classification := r.Group("/classification")
	{
		classification.Use(utils.CookieCheck())
		classification.POST("/create", ClassificationCreate) // 创建分类
		classification.POST("/list", ClassificationList)     // 查询分类
		classification.POST("/delete", ClassificationDelete) // 删除分类
	}
	subClassification := r.Group("/sub_classification")
	{
		subClassification.Use(utils.CookieCheck())
		subClassification.POST("/create", SubClassificationCreate) // 创建子类别
		subClassification.POST("/list", SubClassificationList)     // 查询子类别
		subClassification.POST("/delete", SubClassificationDelete) // 删除子类别
	}

	// 单接口的登录校验
	//r.GET("/home", utils.CookieCheck(), func(c *gin.Context) {
	//	c.JSON(200, gin.H{"data": "Your home page"})
	//})
	return r
}
