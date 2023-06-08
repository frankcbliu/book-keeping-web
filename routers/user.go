package routers

import (
	"book-keeping-web/models"
	"book-keeping-web/utils"
	"log"

	"github.com/gin-gonic/gin"
)

type UserReq struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// UserRegister 注册接口
func UserRegister(c *gin.Context) {
	req := UserReq{}
	if err := c.BindJSON(&req); err != nil {
		utils.FailMessage(c, "parse param error")
		return
	}
	user := models.User{}
	if !user.CreateUser(req.Username, req.Password) {
		utils.FailMessage(c, "register error")
		return
	}
	utils.SuccessMessage(c, "register success")
}

// UserLogin 登录接口
func UserLogin(c *gin.Context) {
	req := UserReq{}
	if err := c.BindJSON(&req); err != nil {
		utils.FailMessage(c, "parse param error")
		return
	}
	log.Println("username:", req.Username)
	user := models.User{}
	if !user.FindUser(req.Username) || !user.CheckPassword(req.Password) {
		utils.FailMessage(c, "login fail")
		return
	}
	utils.SetAuthorization(c, req.Username, user.ID)
	utils.SuccessMessage(c, "login success")
}

// CheckAuth 校验登录状态
func CheckAuth(c *gin.Context) {
	utils.SuccessMessage(c, "check success")
}
