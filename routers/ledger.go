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

// LedgerList 查询当前用户的所有账本
func LedgerList(c *gin.Context) {
	var ledgers []models.Ledger
	ledger := models.Ledger{UserId: c.GetInt("UserId")}
	if !ledger.ListLedger(&ledgers) {
		utils.FailMessage(c, "list ledgers error")
		return
	}
	res := ledger.ToLedgerView(&ledgers)
	utils.Success(c, gin.H{"ledgers": res}, "list ledgers success")
}

// LedgerDelete 删除账本
func LedgerDelete(c *gin.Context) {
	name := c.PostForm("name")
	if len(name) <= 0 {
		utils.FailMessage(c, "ledger name is empty.")
		return
	}
	ledger := models.Ledger{Name: name, UserId: c.GetInt("UserId")}
	if !ledger.DeleteLedger() {
		utils.FailMessage(c, "delete ledger error")
		return
	}
	utils.SuccessMessage(c, "delete ledger success")
}
