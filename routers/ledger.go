package routers

import (
	"book-keeping-web/models"
	"book-keeping-web/utils"
	"github.com/gin-gonic/gin"
)

// LedgerCreate 为当前用户创建账本
func LedgerCreate(c *gin.Context) {
	name := c.PostForm("name")
	if len(name) <= 0 {
		utils.FailMessage(c, "ledger name is empty.")
		return
	}
	ledger := models.Ledger{Name: name, UserId: c.GetInt("UserId")}
	if !ledger.CreateLedger() {
		utils.FailMessage(c, "create ledger error")
		return
	}
	utils.SuccessMessage(c, "create ledger success")
}
