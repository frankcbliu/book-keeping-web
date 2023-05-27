package routers

import (
	"book-keeping-web/models"
	"book-keeping-web/utils"
	"github.com/gin-gonic/gin"
	"strconv"
	"time"
)

type RecordReq struct {
	ClassificationId    int       // 分类id
	SubClassificationId int       // 子类别id
	Note                string    // 备注
	Type                string    // 类型
	Amount              string    // 金额
	ConsumptionTime     time.Time // 消费时间
}

func (req *RecordReq) ParseRequest(c *gin.Context) bool {
	req.Note = c.PostForm("note")
	req.Type = c.PostForm("type")
	req.Amount = c.PostForm("amount")
	consumptionTime := c.PostForm("consumption_time")
	if len(req.Amount) <= 0 || len(consumptionTime) <= 0 {
		utils.FailMessage(c, "amount is empty or consumption_time is empty.")
		return false
	}
	// 解析id
	id, err := strconv.Atoi(c.PostForm("classification_id"))
	if err != nil {
		utils.FailMessage(c, "parse classification_id error.")
		return false
	}
	req.ClassificationId = id
	// 解析时间
	req.ConsumptionTime, err = time.Parse("2006-01-02 15:04:05", consumptionTime)
	if err != nil {
		utils.FailMessage(c, "parse consumption_time error.")
		return false
	}
	// 解析子分类id，可以不携带
	id, err = strconv.Atoi(c.PostForm("sub_classification_id"))
	req.SubClassificationId = id
	return true
}

// RecordCreate 为当前用户创建分类
func RecordCreate(c *gin.Context) {
	req := RecordReq{}
	if !req.ParseRequest(c) {
		return
	}
	record := models.Record{Amount: req.Amount, UserId: c.GetInt("UserId"), ClassificationId: req.ClassificationId,
		Note: req.Note, Type: req.Type, ConsumptionTime: req.ConsumptionTime, SubClassificationId: req.SubClassificationId}
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
