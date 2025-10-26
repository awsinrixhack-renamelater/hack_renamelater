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

// func corsMiddleware(next http.Handler) http.Handler {
// 	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
// 		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
// 		w.Header().Set("Access-Control-Allow-Credentials", "true")
// 		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
// 		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
// 		if r.Method == "OPTIONS" {
// 			w.WriteHeader(http.StatusOK)
// 			return
// 		}

// 		next.ServeHTTP(w, r)
// 	})
// }

func main() {
	ctx := context.Background()
	router := mux.NewRouter()
	// router.Use(corsMiddleware)
	fmt.Printf("started backend api")

	db, err := InitDB(ctx)
	if err != nil {
		log.Fatalf("cannot access db: %v", err)
	}
	app := &App{DB: db}

	router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, "Hello, World!")
	})
	router.HandleFunc("/signup", app.Signup)
	router.HandleFunc("/login", app.Login)
	router.HandleFunc("/addfriend", app.addFriend)
	router.HandleFunc("/getallfriends/{user}", app.getAllFriends)

	protected := router.PathPrefix("/").Subrouter()
	protected.Use(app.Auth)
	protected.HandleFunc("/testDB", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, "Testing DB")
		testDB(app, ctx)
	})
	router.HandleFunc("/gen", func(w http.ResponseWriter, r *http.Request) {
		Gen(ctx, w, r)
	})
	router.HandleFunc("/eval", func(w http.ResponseWriter, r *http.Request) {
		Eval(ctx, w, r)
	})

	log.Println("listening on :5000")
	log.Fatal(http.ListenAndServe(":5000", router))
}
