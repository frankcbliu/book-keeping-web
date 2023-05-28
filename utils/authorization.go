package utils

import (
	"book-keeping-web/conf"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"log"
	"net/http"
	"time"
)

const (
	Authorization    = "Authorization"
	TokenTime        = 30 // 默认 30 分钟
	RefreshTokenTime = 5  // 剩余时间只剩 5 分钟以内进行刷新
)

func SetAuthorization(c *gin.Context, userName string, userId int) {
	token := generateToken(userName, userId)
	c.Header(Authorization, token)
}

func CookieCheck() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get cookie
		if token := c.Request.Header.Get(Authorization); CheckToken(c, token) {
			c.Next()
			return
		}
		// Cookie verification failed
		c.JSON(http.StatusForbidden, gin.H{"error": "Forbidden with no cookie"})
		c.Abort()
	}
}

type myCustomClaims struct {
	UserName string `json:"user_name"`
	UserId   int    `json:"user_id"`
	jwt.RegisteredClaims
}

// 生成 token
func generateToken(userName string, userId int) string {
	mySigningKey := []byte(conf.Setting.Cookie.SecretKey)
	// Create the Claims
	claims := myCustomClaims{
		userName,
		userId,
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
	if err != nil {
		log.Println("Parse token error: ", tokenString)
		return false
	}
	if claims, ok := token.Claims.(*myCustomClaims); ok && token.Valid {
		c.Set("UserId", claims.UserId)
		log.Println(claims.UserName, " expire_time: ", claims.RegisteredClaims.ExpiresAt)
		// 如果有效期少于5min，自动延长
		if claims.RegisteredClaims.ExpiresAt.Sub(time.Now()) <= RefreshTokenTime*time.Minute {
			SetAuthorization(c, claims.UserName, claims.UserId)
		}
	} else {
		log.Println(err)
	}
	// token 有效
	return token.Valid
}
