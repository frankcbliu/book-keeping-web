package routers

import (
	"book-keeping-web/models"
	"book-keeping-web/utils"
	"github.com/gin-gonic/gin"
	"strconv"
)

type ClassificationReq struct {
	Name     string
	LedgerId int
	// 是否需要
	needName     bool
	needLedgerId bool
}

func (req *ClassificationReq) ParseRequest(c *gin.Context) bool {
	if req.needName {
		req.Name = c.PostForm("name")
		if len(req.Name) <= 0 {
			utils.FailMessage(c, "classification name is empty.")
			return false
		}
	}
	if req.needLedgerId {
		ledgerId, err := strconv.Atoi(c.PostForm("ledger_id"))
		if err != nil {
			utils.FailMessage(c, "parse ledger_id error.")
			return false
		}
		req.LedgerId = ledgerId
	}
	return true
}

// ClassificationCreate 为当前用户创建分类
func ClassificationCreate(c *gin.Context) {
	req := ClassificationReq{needName: true, needLedgerId: true}
	if !req.ParseRequest(c) {
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
	req := ClassificationReq{needLedgerId: true}
	if !req.ParseRequest(c) {
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
	req := ClassificationReq{needName: true, needLedgerId: true}
	if !req.ParseRequest(c) {
		return
	}
	classification := models.Classification{Name: req.Name, UserId: c.GetInt("UserId"), LedgerId: req.LedgerId}
	if !classification.DeleteClassification() {
		utils.FailMessage(c, "delete classification error")
		return
	}
	utils.SuccessMessage(c, "delete classification success")
}
