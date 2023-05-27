package conf

import (
	"gopkg.in/yaml.v3"
	"log"
	"os"
)

// Set 全局的配置结构
type Set struct {
	Sqlite SqliteConf // 数据库
	Server ServerConf // 服务器相关
	Cookie CookieConf // cookie 验证相关
}

var Setting = Set{}

// InitSetting 初始化设置文件
func InitSetting() {
	file, err := os.ReadFile("./conf/app.yml")
	if err != nil {
		log.Fatal("fail to read file:", err)
	}

	err = yaml.Unmarshal(file, &Setting)
	if err != nil {
		log.Fatal("fail to yaml unmarshal:", err)
	}
}

// SqliteConf Sqlite 数据库的相关配置
type SqliteConf struct {
	FileName string `yaml:"file_name"`
}

type ServerConf struct {
	Addr string `yaml:"addr"`
}

type CookieConf struct {
	SecretKey string `yaml:"secret_key"`
}
