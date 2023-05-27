package models

import (
	"gorm.io/gorm"
	"log"
)

// Classification 分类
type Classification struct {
	gorm.Model

	ID       int    `gorm:"type:int"`         // 分类ID
	Name     string `gorm:"type:varchar(30)"` // 分类名称
	LedgerId int    `gorm:"type:int"`         // 所属账本ID
	UserId   int    `gorm:"type:int"`         // 所属用户ID
}

type ClassificationView struct {
	ID   int    `json:"id"`   // 分类ID
	Name string `json:"name"` // 分类名称
}

// CreateClassification 创建分类
func (cf *Classification) CreateClassification() bool {
	if cf.FindClassification() {
		log.Println("[Classification.CreateClassification] cf name exist")
		return false
	}
	result := SqliteDB.Create(&Classification{Name: cf.Name, UserId: cf.UserId, LedgerId: cf.LedgerId})
	if result.Error != nil {
		log.Println("[Classification.CreateClassification]", result.Error)
		return false
	}
	return true
}

// FindClassification 查找分类
func (cf *Classification) FindClassification() bool {
	SqliteDB.Find(&cf, "name = ?", cf.Name, "user_id = ?", cf.UserId, "ledger_id = ?", cf.LedgerId)
	if cf.ID > 0 {
		return true
	}
	log.Println("[Classification.FindClassification]", "Not found cf:", cf.Name)
	return false
}

// FindClassificationById 通过ID查找分类
func (cf *Classification) FindClassificationById() bool {
	SqliteDB.Find(&cf, "id = ?", cf.ID)
	if cf.ID > 0 {
		return true
	}
	log.Println("[Classification.FindClassification]", "Not found cf:", cf.ID)
	return false
}

// ListClassification 查询所有分类
func (cf *Classification) ListClassification(classifications *[]Classification) bool {
	SqliteDB.Where("user_id = ?", cf.UserId).Where("ledger_id = ?", cf.LedgerId).Find(classifications)
	if len(*classifications) > 0 {
		return true
	}
	log.Println("[Classification.ListClassification]", "User:", cf.UserId, "no exist classifications")
	return false
}

// ToClassificationView 将 model 转为对外输出的数据
func (cf *Classification) ToClassificationView(classifications *[]Classification) []ClassificationView {
	var classificationViewList []ClassificationView
	for _, v := range *classifications {
		classificationView := ClassificationView{
			ID:   v.ID,
			Name: v.Name,
		}
		classificationViewList = append(classificationViewList, classificationView)
	}
	return classificationViewList
}

// DeleteClassification 删除分类
func (cf *Classification) DeleteClassification() bool {
	if !cf.FindClassification() {
		return false
	}
	result := SqliteDB.Delete(&cf)
	if result.Error != nil {
		log.Println("[Classification.DeleteClassification]", result.Error)
		return false
	}
	return true
}
