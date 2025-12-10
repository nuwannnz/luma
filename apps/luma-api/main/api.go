package main

import "github.com/gin-gonic/gin"

func main() {
	r := gin.Default()
	r.GET("/api/v1/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "hello world",
		})
	})

	r.GET("/api/v1/hello", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "helloooo",
		})
	})

	r.Run() // listen and serve on 0.0.0.0:8080
}
