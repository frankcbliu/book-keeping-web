package models

import (
	"book-keeping-web/conf"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"log"
)

var SqliteDB = gorm.DB{}

func InitSqlite() {
	db, err := gorm.Open(sqlite.Open(conf.Setting.Sqlite.FileName), &gorm.Config{})
	if err != nil {
		log.Fatal("failed to connect database")
		return
	}
	SqliteDB = *db
	// 初始化数据库表
	err = SqliteDB.AutoMigrate(&User{})
	if err != nil {
		log.Fatal("failed to migrate User")
	}
	err = SqliteDB.AutoMigrate(&Ledger{})
	if err != nil {
		log.Fatal("failed to migrate Ledger")
	}
	err = SqliteDB.AutoMigrate(&Classification{})
	if err != nil {
		log.Fatal("failed to migrate Ledger")
	}
	err = SqliteDB.AutoMigrate(&SubClassification{})
	if err != nil {
		log.Fatal("failed to migrate Ledger")
	}
	err = SqliteDB.AutoMigrate(&Record{})
	if err != nil {
		log.Fatal("failed to migrate Ledger")
	}
}
