package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

type App struct {
	DB *sql.DB
}

func main() {
	ctx := context.Background()
	router := mux.NewRouter()
	fmt.Printf("started backend api")

	db, err := InitDB(ctx)
	if err != nil {
		log.Fatalf("cannot access db: %v", err)
	}
	app := &App{DB: db}

	router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, "Hello, World!")
	})
	router.HandleFunc("/signup/{username}/{pwd}/{grade}", app.Signup)
	router.HandleFunc("/login/{username}/{pwd}", app.Login)

	protected := router.PathPrefix("/").Subrouter()
	protected.Use(app.Auth)
	protected.HandleFunc("/testDB", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, "Testing DB")
		testDB(app, ctx)
	})
	protected.HandleFunc("/gen", func(w http.ResponseWriter, r *http.Request) {
		Gen(ctx, w, r)
	})

	log.Println("listening on :5000")
	log.Fatal(http.ListenAndServe(":5000", router))
}
