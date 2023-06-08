package models

import (
	"log"
	"time"

	"gorm.io/gorm"
)

// Record 账单记录
type Record struct {
	gorm.Model

	ID                  int       `gorm:"type:int"` // 记录ID
	UserId              int       `gorm:"type:int"` // 所属用户ID
	LedgerId            int       `gorm:"type:int"` // 所属账本ID
	ClassificationId    int       `gorm:"type:int"` // 所属分类ID
	SubClassificationId int       `gorm:"type:int"` // 所属子分类ID
	ConsumptionTime     time.Time // 消费时间
	Amount              string    `gorm:"type:varchar(30)"`  // 金额
	Note                string    `gorm:"type:varchar(255)"` // 备注
	Type                string    `gorm:"type:varchar(30)"`  // 类型, 枚举: 收入/支出
}

type RecordView struct {
	ID                int    `json:"id"`                 // 记录ID
	Amount            string `json:"amount"`             // 金额
	Ledger            string `json:"ledger"`             // 账本名称
	Classification    string `json:"classification"`     // 分类名称
	SubClassification string `json:"sub_classification"` // 子分类名称
	ConsumptionTime   string `json:"consumption_time"`   // 消费时间
	Note              string `json:"note"`               // 备注
	Type              string `json:"type"`               // 类型
}

func (record *Record) GetClassificationName() string {
	cf := Classification{ID: record.ClassificationId}
	if !cf.FindClassificationById() {
		return ""
	}
	return cf.Name
}

func (record *Record) GetSubClassificationName() string {
	subCf := SubClassification{ID: record.SubClassificationId}
	if !subCf.FindSubClassificationById() {
		return ""
	}
	return subCf.Name
}

func (record *Record) GetLedgerName() string {
	ledger := Ledger{ID: record.LedgerId}
	if !ledger.FindLedgerById() {
		return ""
	}
	return ledger.Name
}

func (record *Record) GetLedgerIdByClassificationName() int {
	cf := Classification{ID: record.ClassificationId}
	if !cf.FindClassificationById() {
		return 0
	}
	return cf.LedgerId
}

// CreateRecord 创建账单
func (record *Record) CreateRecord() bool {
	record.LedgerId = record.GetLedgerIdByClassificationName()
	if record.LedgerId <= 0 {
		log.Println("[Record.CreateRecord] no LedgerId")
		return false
	}
	result := SqliteDB.Create(&Record{Amount: record.Amount,
		Note: record.Note, Type: record.Type, ConsumptionTime: record.ConsumptionTime,
		UserId: record.UserId, LedgerId: record.LedgerId, ClassificationId: record.ClassificationId, SubClassificationId: record.SubClassificationId})
	if result.Error != nil {
		log.Println("[Record.CreateRecord]", result.Error)
		return false
	}
	return true
}

// ListRecordByLedgerId 查询某个账本下的所有账单
func (record *Record) ListRecordByLedgerId(records *[]Record) bool {
	SqliteDB.Where("user_id = ?", record.UserId).Where("ledger_id = ?", record.LedgerId).Find(records)
	if len(*records) > 0 {
		return true
	}
	log.Println("[Record.ListRecord]", "LedgerId:", record.LedgerId, "no exist records")
	return false
}

// ListRecordByClassificationId 查询某个分类下的所有账单
func (record *Record) ListRecordByClassificationId(records *[]Record) bool {
	SqliteDB.Where("user_id = ?", record.UserId).Where("classification_id = ?", record.ClassificationId).Find(records)
	if len(*records) > 0 {
		return true
	}
	log.Println("[Record.ListRecord]", "ClassificationId:", record.ClassificationId, "no exist records")
	return false
}

// ToRecordView 将 model 转为对外输出的数据
func (record *Record) ToRecordView(records *[]Record) []RecordView {
	var recordViewList []RecordView
	for _, v := range *records {
		recordView := RecordView{
			ID:                v.ID,
			Amount:            v.Amount,
			Note:              v.Note,
			Type:              v.Type,
			ConsumptionTime:   v.ConsumptionTime.String(),
			Ledger:            v.GetLedgerName(),
			Classification:    v.GetClassificationName(),
			SubClassification: v.GetSubClassificationName(),
		}
		recordViewList = append(recordViewList, recordView)
	}
	return recordViewList
}

// DeleteRecord 删除记录
func (record *Record) DeleteRecord() bool {
	result := SqliteDB.Delete(&record)
	if result.Error != nil {
		log.Println("[Record.DeleteRecord]", result.Error)
		return false
	}
	return true
}
