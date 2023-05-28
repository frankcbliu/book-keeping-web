package routers

import (
	"book-keeping-web/models"
	"book-keeping-web/utils"
	"github.com/gin-gonic/gin"
	"strconv"
	"time"
)

type RecordReq struct {
	ClassificationId    int    `json:"classification_id"`                         // 分类id
	SubClassificationId int    `json:"sub_classification_id" binding:"omitempty"` // 子类别id
	Note                string `json:"note" binding:"omitempty"`                  // 备注
	Type                string `json:"type"`                                      // 类型
	Amount              string `json:"amount"`                                    // 金额
	ConsumptionTime     string `json:"consumption_time"`                          // 消费时间
}

// RecordCreate 为当前用户创建分类
func RecordCreate(c *gin.Context) {
	req := RecordReq{}
	if err := c.BindJSON(&req); err != nil {
		utils.FailMessage(c, "parse param error")
		return
	}
	// 解析时间
	consumptionTime, err := time.Parse("2006-01-02 15:04:05", req.ConsumptionTime)
	if err != nil {
		utils.FailMessage(c, "parse consumption_time error.")
		return
	}
	record := models.Record{Amount: req.Amount, UserId: c.GetInt("UserId"), ClassificationId: req.ClassificationId,
		Note: req.Note, Type: req.Type, ConsumptionTime: consumptionTime, SubClassificationId: req.SubClassificationId}
	if !record.CreateRecord() {
		utils.FailMessage(c, "create record error")
		return
	}
	utils.SuccessMessage(c, "create record success")
}

// RecordDelete 删除账本
func RecordDelete(c *gin.Context) {
	id, err := strconv.Atoi(c.PostForm("record_id"))
	if err != nil {
		utils.FailMessage(c, "parse record_id error.")
		return
	}

	record := models.Record{ID: id, UserId: c.GetInt("UserId")}
	if !record.DeleteRecord() {
		utils.FailMessage(c, "delete record error")
		return
	}
	utils.SuccessMessage(c, "delete record success")
}
