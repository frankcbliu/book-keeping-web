package routers

import (
	"book-keeping-web/models"
	"book-keeping-web/utils"
	"github.com/gin-gonic/gin"
)

type ClassificationReq struct {
	Name     string `json:"name" binding:"omitempty"`
	LedgerId int    `json:"ledger_id"`
}

// ClassificationCreate 为当前用户创建分类
func ClassificationCreate(c *gin.Context) {
	req := ClassificationReq{}
	if err := c.BindJSON(&req); err != nil {
		utils.FailMessage(c, "parse param error")
		return
	}
	classification := models.Classification{Name: req.Name, UserId: c.GetInt("UserId"), LedgerId: req.LedgerId}
	if !classification.CreateClassification() {
		utils.FailMessage(c, "create classification error")
		return
	}
	utils.SuccessMessage(c, "create classification success")
}

// ClassificationList 查询当前用户的所有分类
func ClassificationList(c *gin.Context) {
	req := ClassificationReq{}
	if err := c.BindJSON(&req); err != nil {
		utils.FailMessage(c, "parse param error")
		return
	}
	var classifications []models.Classification
	classification := models.Classification{UserId: c.GetInt("UserId"), LedgerId: req.LedgerId}
	if !classification.ListClassification(&classifications) {
		utils.FailMessage(c, "list classifications error")
		return
	}
	res := classification.ToClassificationView(&classifications)
	utils.Success(c, gin.H{"classifications": res}, "list classifications success")
}

// ClassificationDelete 删除分类
func ClassificationDelete(c *gin.Context) {
	req := ClassificationReq{}
	if err := c.BindJSON(&req); err != nil {
		utils.FailMessage(c, "parse param error")
		return
	}
	classification := models.Classification{Name: req.Name, UserId: c.GetInt("UserId"), LedgerId: req.LedgerId}
	if !classification.DeleteClassification() {
		utils.FailMessage(c, "delete classification error")
		return
	}
	utils.SuccessMessage(c, "delete classification success")
}
