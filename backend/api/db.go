package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/rds"
	"github.com/go-sql-driver/mysql"
)


func InitDB(ctx context.Context) (*sql.DB, error) {
	/*
	cfg, err := config.LoadDefaultConfig(ctx)
	if err != nil {
		return nil, fmt.Errorf("loading aws config: %w", err)
	}
	*/
	cfg := mysql.NewConfig()
	cfg.User = "ivyz"
	cfg.Passwd = "alanfung"
	var dbHost string = "usersandfriends-instance-1.csbvaawkysob.us-east-1.rds.amazonaws.com"
	var dbPort int = 3306
	var dbName string = "usersandfriends"
	var dbEndpoint string = fmt.Sprintf("%s:%d", dbHost, dbPort)

	/*
	authenticationToken, err := auth.BuildAuthToken(
		ctx, dbEndpoint, region, dbUser, cfg.Credentials)
	if err != nil {
		return nil, fmt.Errorf("failed to create authentication token: %w", err)
	}
	*/

    dsn := fmt.Sprintf("%s:%s@tcp(%s)/%s?tls=true&allowCleartextPasswords=true",
        dbUser, dbPass, dbEndpoint, dbName,
    )

	db, err := sql.Open("mysql", dsn)
	if err != nil {
		return nil, fmt.Errorf("open db: %w", err)
	}

	if err := db.Ping(); err != nil {
		_ = db.Close()
		return nil, fmt.Errorf("ping db: %w", err)
	}

	return db, nil
}

func testDB(app *App, ctx context.Context) error {
	// If the App provided a DB pool, use it first to validate connectivity.
	if app != nil && app.DB != nil {
		log.Println("testing DB connection via app.DB")
		pingCtx, cancel := context.WithTimeout(ctx, 5*time.Second)
		defer cancel()
		if err := app.DB.PingContext(pingCtx); err != nil {
			// try a small query as a fallback (may surface different errors)
			log.Printf("PingContext failed: %v; trying SELECT 1", err)
			qCtx, qCancel := context.WithTimeout(ctx, 5*time.Second)
			defer qCancel()
			var one int
			if err2 := app.DB.QueryRowContext(qCtx, "SELECT 1").Scan(&one); err2 != nil {
				return fmt.Errorf("db health check failed: ping error: %w; select error: %v", err, err2)
			}
		}
		log.Println("DB connection check via app.DB succeeded")
	} else {
		log.Println("app.DB not provided; skipping DB connectivity check")
	}

	cfg, err := config.LoadDefaultConfig(ctx)
	if err != nil {
		return fmt.Errorf("loading aws config: %w", err)
	}

	client := rds.NewFromConfig(cfg)

	out, err := client.DescribeDBClusters(ctx, &rds.DescribeDBClustersInput{})
	if err != nil {
		return fmt.Errorf("describe db clusters: %w", err)
	}

	if len(out.DBClusters) == 0 {
		log.Println("no DB clusters found")
		return nil
	}

	for _, c := range out.DBClusters {
		id := aws.ToString(c.DBClusterIdentifier)
		engine := aws.ToString(c.Engine)
		status := aws.ToString(c.Status)
		endpoint := aws.ToString(c.Endpoint)
		reader := aws.ToString(c.ReaderEndpoint)

		log.Printf("RDS Cluster: id=%s engine=%s status=%s endpoint=%s reader=%s",
			id, engine, status, endpoint, reader)
	}

	return nil
}