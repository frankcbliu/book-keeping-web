package models

import (
	"log"

	"gorm.io/gorm"
)

// Ledger 账本
type Ledger struct {
	gorm.Model

	ID     int    `gorm:"type:int"`         // 账本ID
	Name   string `gorm:"type:varchar(30)"` // 账本名称
	UserId int    `gorm:"type:int"`         // 所属用户ID
}

// LedgerView 用于对外输出的账本信息
type LedgerView struct {
	ID   int    `json:"id"`   // 账本ID
	Name string `json:"name"` // 账本名称
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

// FindLedgerById 通过ID查找账本
func (ledger *Ledger) FindLedgerById() bool {
	SqliteDB.Find(&ledger, "id = ?", ledger.ID)
	if ledger.ID > 0 {
		return true
	}
	log.Println("[Ledger.FindLedger]", "Not found ledger:", ledger.ID)
	return false
}

// ListLedger 查询所有账本
func (ledger *Ledger) ListLedger(ledgers *[]Ledger) bool {
	SqliteDB.Find(ledgers, "user_id = ?", ledger.UserId)
	if len(*ledgers) > 0 {
		return true
	}
	log.Println("[Ledger.ListLedger]", "User:", ledger.UserId, "no exist ledgers")
	return false
}

// ToLedgerView 将 model 转为对外输出的数据
func (ledger *Ledger) ToLedgerView(ledgers *[]Ledger) []LedgerView {
	var ledgerViewList []LedgerView
	for _, v := range *ledgers {
		ledgerView := LedgerView{
			ID:   v.ID,
			Name: v.Name,
		}
		ledgerViewList = append(ledgerViewList, ledgerView)
	}
	return ledgerViewList
}

// DeleteLedger 删除账本
func (ledger *Ledger) DeleteLedger() bool {
	if !ledger.FindLedger() {
		return false
	}
	result := SqliteDB.Delete(&ledger)
	if result.Error != nil {
		log.Println("[Ledger.DeleteLedger]", result.Error)
		return false
	}
	return true
}
