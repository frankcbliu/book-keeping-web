package routers

import (
	"book-keeping-web/models"
	"book-keeping-web/utils"
	"github.com/gin-gonic/gin"
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
	utils.SetCookie(c, userName, user.ID)
	utils.SuccessMessage(c, "login success")
}
