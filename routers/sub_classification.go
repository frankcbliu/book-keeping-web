package routers

import (
	"book-keeping-web/models"
	"book-keeping-web/utils"

	"github.com/gin-gonic/gin"
)

type SubClassificationReq struct {
	Name             string `json:"name" binding:"omitempty"`
	ClassificationId int    `json:"classification_id"`
}

// SubClassificationCreate 为当前用户创建分类
func SubClassificationCreate(c *gin.Context) {
	req := SubClassificationReq{}
	if err := c.BindJSON(&req); err != nil {
		utils.FailMessage(c, "parse param error")
		return
	}
	classification := models.SubClassification{Name: req.Name, UserId: c.GetInt("UserId"), ClassificationId: req.ClassificationId}
	if !classification.CreateSubClassification() {
		utils.FailMessage(c, "create classification error")
		return
	}
	utils.SuccessMessage(c, "create classification success")
}

// SubClassificationList 查询当前用户的所有分类
func SubClassificationList(c *gin.Context) {
	req := SubClassificationReq{}
	if err := c.BindJSON(&req); err != nil {
		utils.FailMessage(c, "parse param error")
		return
	}
	var classifications []models.SubClassification
	classification := models.SubClassification{UserId: c.GetInt("UserId"), ClassificationId: req.ClassificationId}
	if !classification.ListSubClassification(&classifications) {
		utils.FailMessage(c, "list classifications error")
		return
	}
	res := classification.ToSubClassificationView(&classifications)
	utils.Success(c, gin.H{"sub_classifications": res}, "list classifications success")
}

// SubClassificationDelete 删除分类
func SubClassificationDelete(c *gin.Context) {
	req := SubClassificationReq{}
	if err := c.BindJSON(&req); err != nil {
		utils.FailMessage(c, "parse param error")
		return
	}
	classification := models.SubClassification{Name: req.Name, UserId: c.GetInt("UserId"), ClassificationId: req.ClassificationId}
	if !classification.DeleteSubClassification() {
		utils.FailMessage(c, "delete classification error")
		return
	}
	utils.SuccessMessage(c, "delete classification success")
}
