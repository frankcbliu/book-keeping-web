package routers

import (
	"book-keeping-web/models"
	"book-keeping-web/utils"
	"github.com/gin-gonic/gin"
	"log"
)

type UserReq struct {
	Username string `json:"username"`
	Password string `json:"password"`
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
