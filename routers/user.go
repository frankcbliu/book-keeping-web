package routers

import (
	"github.com/gin-gonic/gin"
	"go-gin-gorm-demo/models"
	"go-gin-gorm-demo/utils"
)

// UserRegister 注册接口
func UserRegister(c *gin.Context) {
	userName := c.PostForm("username")
	password := c.PostForm("password")
	user := models.User{}
	if !user.CreateUser(userName, password) {
		utils.FailMessage(c, "register error")
		return
	}
	utils.SuccessMessage(c, "register success")
}

// UserLogin 登录接口
func UserLogin(c *gin.Context) {
	userName := c.PostForm("username")
	password := c.PostForm("password")

	user := models.User{}
	if !user.FindUser(userName) || !user.CheckPassword(password) {
		utils.FailMessage(c, "login fail")
		return
	}
	utils.SetCookie(c, userName)
	utils.SuccessMessage(c, "login success")
}
