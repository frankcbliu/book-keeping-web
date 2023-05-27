package utils

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func ResponseMessage(ctx *gin.Context, httpStatus int, code int, msg string) {
	ctx.JSON(httpStatus, gin.H{
		"code": code,
		"msg":  msg,
	})
}

// SuccessMessage 成功
func SuccessMessage(ctx *gin.Context, msg string) {
	ResponseMessage(ctx, http.StatusOK, 0, msg)
}

// FailMessage 返回错误
func FailMessage(ctx *gin.Context, msg string) {
	ResponseMessage(ctx, http.StatusOK, 1, msg)
}

func Response(ctx *gin.Context, httpStatus int, code int, data gin.H, msg string) {
	ctx.JSON(httpStatus, gin.H{
		"code": code,
		"data": data,
		"msg":  msg,
	})
}

// Success 成功
func Success(ctx *gin.Context, data gin.H, msg string) {
	Response(ctx, http.StatusOK, 0, data, msg)
}

// Fail 返回错误
func Fail(ctx *gin.Context, data gin.H, msg string) {
	Response(ctx, http.StatusOK, 1, data, msg)
}
