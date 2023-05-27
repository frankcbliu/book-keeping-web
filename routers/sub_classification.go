package routers

import (
	"book-keeping-web/models"
	"book-keeping-web/utils"
	"github.com/gin-gonic/gin"
	"strconv"
)

type SubClassificationReq struct {
	Name             string
	ClassificationId int
	// 是否需要
	needName             bool
	needClassificationId bool
}

func (req *SubClassificationReq) ParseRequest(c *gin.Context) bool {
	if req.needName {
		req.Name = c.PostForm("name")
		if len(req.Name) <= 0 {
			utils.FailMessage(c, "sub_classification name is empty.")
			return false
		}
	}
	if req.needClassificationId {
		classificationId, err := strconv.Atoi(c.PostForm("classification_id"))
		if err != nil {
			utils.FailMessage(c, "parse classification_id error.")
			return false
		}
		req.ClassificationId = classificationId
	}
	return true
}

// SubClassificationCreate 为当前用户创建分类
func SubClassificationCreate(c *gin.Context) {
	req := SubClassificationReq{needName: true, needClassificationId: true}
	if !req.ParseRequest(c) {
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
	req := SubClassificationReq{needClassificationId: true}
	if !req.ParseRequest(c) {
		return
	}
	var classifications []models.SubClassification
	classification := models.SubClassification{UserId: c.GetInt("UserId"), ClassificationId: req.ClassificationId}
	if !classification.ListSubClassification(&classifications) {
		utils.FailMessage(c, "list classifications error")
		return
	}
	res := classification.ToSubClassificationView(&classifications)
	utils.Success(c, gin.H{"classifications": res}, "list classifications success")
}

// SubClassificationDelete 删除分类
func SubClassificationDelete(c *gin.Context) {
	req := SubClassificationReq{needName: true, needClassificationId: true}
	if !req.ParseRequest(c) {
		return
	}
	classification := models.SubClassification{Name: req.Name, UserId: c.GetInt("UserId"), ClassificationId: req.ClassificationId}
	if !classification.DeleteSubClassification() {
		utils.FailMessage(c, "delete classification error")
		return
	}
	utils.SuccessMessage(c, "delete classification success")
}
