package utils

import (
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"go-gin-gorm-demo/conf"
	"log"
	"net/http"
	"time"
)

const (
	TOKEN            = "token"
	TokenTime        = 30 // 默认 30 分钟
	RefreshTokenTime = 5  // 剩余时间只剩 5 分钟以内进行刷新
)

func SetCookie(c *gin.Context, userName string) {
	token := generateToken(userName)
	c.SetCookie(TOKEN, token, 0, "/", "localhost", false, true)
}

func CookieCheck() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get cookie
		if token, err := c.Cookie(TOKEN); err == nil {
			if CheckToken(c, token) {
				c.Next()
				return
			}
		}
		// Cookie verification failed
		c.JSON(http.StatusForbidden, gin.H{"error": "Forbidden with no cookie"})
		c.Abort()
	}
}

type myCustomClaims struct {
	UserName string `json:"user_name"`
	jwt.RegisteredClaims
}

// 生成 token
func generateToken(userName string) string {
	mySigningKey := []byte(conf.Setting.Cookie.SecretKey)
	// Create the Claims
	claims := myCustomClaims{
		userName,
		jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(TokenTime * time.Minute)),
		},
	}
	// 计算 token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	ss, err := token.SignedString(mySigningKey)
	if err != nil {
		log.Println("token.SignedString fail")
	}
	return ss
}

// CheckToken 验证 token 是否有效
func CheckToken(c *gin.Context, tokenString string) bool {
	token, err := jwt.ParseWithClaims(tokenString, &myCustomClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(conf.Setting.Cookie.SecretKey), nil
	})
	if claims, ok := token.Claims.(*myCustomClaims); ok && token.Valid {
		log.Println(claims.UserName, " expire_time: ", claims.RegisteredClaims.ExpiresAt)
		// 如果有效期少于5min，自动延长
		if claims.RegisteredClaims.ExpiresAt.Sub(time.Now()) <= RefreshTokenTime*time.Minute {
			SetCookie(c, claims.UserName)
		}
	} else {
		log.Println(err)
	}
	// token 有效
	return token.Valid
}
