package models

import (
	"log"

	"gorm.io/gorm"
)

// SubClassification 子类别
type SubClassification struct {
	gorm.Model

	ID               int    `gorm:"type:int"`         // 子类别ID
	Name             string `gorm:"type:varchar(30)"` // 子类别名称
	ClassificationId int    `gorm:"type:int"`         // 所属分类ID
	UserId           int    `gorm:"type:int"`         // 所属用户ID
}

type SubClassificationView struct {
	ID   int    `json:"id"`   // 子类别ID
	Name string `json:"name"` // 子类别名称
}

// CreateSubClassification 创建子类别
func (subCf *SubClassification) CreateSubClassification() bool {
	if subCf.FindSubClassification() {
		log.Println("[SubClassification.CreateSubClassification] sub_cf name exist")
		return false
	}
	result := SqliteDB.Create(&SubClassification{Name: subCf.Name, UserId: subCf.UserId, ClassificationId: subCf.ClassificationId})
	if result.Error != nil {
		log.Println("[SubClassification.CreateSubClassification]", result.Error)
		return false
	}
	return true
}

// FindSubClassification 查找子类别
func (subCf *SubClassification) FindSubClassification() bool {
	SqliteDB.Find(&subCf, "name = ?", subCf.Name, "user_id = ?", subCf.UserId)
	if subCf.ID > 0 {
		return true
	}
	log.Println("[SubClassification.FindSubClassification]", "Not found sub_cf:", subCf.Name)
	return false
}

// FindSubClassificationById 查找子类别
func (subCf *SubClassification) FindSubClassificationById() bool {
	SqliteDB.Find(&subCf, "id = ?", subCf.ID)
	return subCf.ID > 0
}

// ListSubClassification 查询所有子类别
func (subCf *SubClassification) ListSubClassification(classifications *[]SubClassification) bool {
	SqliteDB.Where("user_id = ?", subCf.UserId).Where("classification_id = ?", subCf.ClassificationId).Find(classifications)
	if len(*classifications) > 0 {
		return true
	}
	log.Println("[SubClassification.ListSubClassification]", "User:", subCf.UserId, "no exist classifications")
	return false
}

// ToSubClassificationView 将 model 转为对外输出的数据
func (subCf *SubClassification) ToSubClassificationView(classifications *[]SubClassification) []SubClassificationView {
	var classificationViewList []SubClassificationView
	for _, v := range *classifications {
		classificationView := SubClassificationView{
			ID:   v.ID,
			Name: v.Name,
		}
		classificationViewList = append(classificationViewList, classificationView)
	}
	return classificationViewList
}

// DeleteSubClassification 删除子类别
func (subCf *SubClassification) DeleteSubClassification() bool {
	if !subCf.FindSubClassification() {
		return false
	}
	result := SqliteDB.Delete(&subCf)
	if result.Error != nil {
		log.Println("[SubClassification.DeleteSubClassification]", result.Error)
		return false
	}
	return true
}
