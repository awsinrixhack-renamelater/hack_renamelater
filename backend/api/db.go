package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"os"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/secretsmanager"
	_ "github.com/go-sql-driver/mysql"
)

type DBSecret struct {
	Username string `json:"username"`
	Password string `json:"password"`
	Host     string `json:"host"`
	Port     string `json:"port"`
	DBName   string `json:"dbname"`
}

func InitDB(ctx context.Context) (*sql.DB, error) {
	cfg, err := config.LoadDefaultConfig(ctx)
	if err != nil {
		return nil, fmt.Errorf("loading aws config: %w", err)
	}

	secretArn := os.Getenv("DB_SECRET_ARN")
	if secretArn == "" {
		return nil, fmt.Errorf("DB_SECRET_ARN environment variable not set")
	}

	sm := secretsmanager.NewFromConfig(cfg)
	getIn := &secretsmanager.GetSecretValueInput{
		SecretId: aws.String(secretArn),
	}

	resp, err := sm.GetSecretValue(ctx, getIn)
	if err != nil {
		return nil, fmt.Errorf("get secret value: %w", err)
	}

	var s DBSecret
	if resp.SecretString != nil {
		if err := json.Unmarshal([]byte(*resp.SecretString), &s); err != nil {
			return nil, fmt.Errorf("unmarshal secret json: %w", err)
		}
	} else {
		return nil, fmt.Errorf("secret has no SecretString; binary secrets not supported")
	}

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true", s.Username, s.Password, s.Host, s.Port, s.DBName)

	db, err := sql.Open("mysql", dsn)
	if err != nil {
		return nil, fmt.Errorf("sql open: %w", err)
	}

	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(25)
	db.SetConnMaxLifetime(5 * time.Minute)

	pingCtx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()
	if err := db.PingContext(pingCtx); err != nil {
		db.Close()
		return nil, fmt.Errorf("db ping: %w", err)
	}

	return db, nil
}