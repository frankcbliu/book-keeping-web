package models

import (
	"go-gin-gorm-demo/conf"
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
}
