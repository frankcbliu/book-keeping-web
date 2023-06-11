package routers

import (
	"book-keeping-web/models"
	"book-keeping-web/utils"
	"time"

	"github.com/gin-gonic/gin"
)

type RecordReq struct {
	ClassificationId    int    `json:"classification_id" binding:"required"`      // 分类id
	SubClassificationId int    `json:"sub_classification_id" binding:"omitempty"` // 子类别id
	Note                string `json:"note" binding:"omitempty"`                  // 备注
	Type                string `json:"type"`                                      // 类型
	Amount              string `json:"amount" binding:"required"`                 // 金额
	ConsumptionTime     string `json:"consumption_time" binding:"required"`       // 消费时间
}

// RecordCreate 为当前用户创建分类
func RecordCreate(c *gin.Context) {
	req := RecordReq{}
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.FailMessage(c, "parse param error")
		return
	}
	// 解析时间
	consumptionTime, err := time.Parse(utils.TimeLayout, req.ConsumptionTime)
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

type RecordDeleteReq struct {
	RecordId int `json:"record_id" binding:"required"`
}

// RecordDelete 删除账本Ï
func RecordDelete(c *gin.Context) {
	req := RecordDeleteReq{}
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.FailMessage(c, "parse param error")
		return
	}

	record := models.Record{ID: req.RecordId, UserId: c.GetInt("UserId")}
	if !record.DeleteRecord() {
		utils.FailMessage(c, "delete record error")
		return
	}
	utils.SuccessMessage(c, "delete record success")
}

type RecordListReq struct {
	BeginTime string `json:"begin_time" binding:"required"` // 开始时间
	EndTime   string `json:"end_time" binding:"required"`   // 截止时间
}

// RecordList 查询账单
func RecordList(c *gin.Context) {
	req := RecordListReq{}
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.FailMessage(c, "parse param error")
		return
	}
	beginTime, err := time.Parse(utils.TimeLayout, req.BeginTime)
	if err != nil {
		utils.FailMessage(c, "parse begin_time error.")
		return
	}
	endTime, err := time.Parse(utils.TimeLayout, req.EndTime)
	if err != nil {
		utils.FailMessage(c, "parse end_time error.")
		return
	}

	var records []models.Record
	record := models.Record{UserId: c.GetInt("UserId")}
	if !record.ListRecordByTime(beginTime, endTime, &records) {
		utils.FailMessage(c, "list record error")
		return
	}
	res := record.ToRecordView(&records)
	utils.Success(c, gin.H{"records": res}, "list records success")
}

// RecordListAll 查询所有账单
func RecordListAll(c *gin.Context) {
	var records []models.Record
	record := models.Record{UserId: c.GetInt("UserId")}
	if !record.ListRecords(&records) {
		utils.FailMessage(c, "list record error")
		return
	}
	res := record.ToRecordView(&records)
	utils.Success(c, gin.H{"records": res}, "list records success")
}
