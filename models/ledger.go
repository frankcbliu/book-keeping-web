package models

import (
	"gorm.io/gorm"
	"log"
)

// Ledger 账本
type Ledger struct {
	gorm.Model

	ID     int    `json:"id" gorm:"type:int"`           // 账本ID
	Name   string `json:"name" gorm:"type:varchar(30)"` // 账本名称
	UserId int    `json:"user_id" gorm:"type:int"`      // 所属用户ID
}

// CreateLedger 创建账本
func (ledger *Ledger) CreateLedger() bool {
	if ledger.FindLedger() {
		log.Println("[Ledger.CreateLedger] ledger name exist")
		return false
	}
	result := SqliteDB.Create(&Ledger{Name: ledger.Name, UserId: ledger.UserId})
	if result.Error != nil {
		log.Println("[Ledger.CreateLedger]", result.Error)
		return false
	}
	return true
}

// FindLedger 查找账本
func (ledger *Ledger) FindLedger() bool {
	SqliteDB.Find(&ledger, "name = ?", ledger.Name, "user_id = ?", ledger.UserId)
	if ledger.ID > 0 {
		return true
	}
	log.Println("[Ledger.FindLedger]", "Not found ledger:", ledger.Name)
	return false
}
