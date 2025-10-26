package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"github.com/rs/cors"
)

type App struct {
	DB *sql.DB
}

func main() {
	ctx := context.Background()
	mux := http.NewServeMux()
	fmt.Printf("started backend api")

	db, err := InitDB(ctx)
	if err != nil {
		log.Fatalf("cannot access db: %v", err)
	}
	app := &App{DB: db}

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, "Hello, World!")
	})
	mux.HandleFunc("/signup", app.Signup)
	mux.HandleFunc("/login", app.Login)

	protected := http.NewServeMux()
	protected.HandleFunc("/addfriend", app.addFriend)
	protected.HandleFunc("/getallfriends/{user}", app.getAllFriends)
	protected.HandleFunc("/gen", func(w http.ResponseWriter, r *http.Request) {
		Gen(ctx, w, r)
	})
	protected.HandleFunc("/eval", func(w http.ResponseWriter, r *http.Request) {
		Eval(ctx, w, r)
	})
	mux.Handle("/addfriend", Auth(protected))
	mux.Handle("/getallfriends/{user}", Auth(protected))
	mux.Handle("/gen", Auth(protected))
	mux.Handle("/eval", Auth(protected))
	handler := cors.Default().Handler(mux)

	log.Println("listening on :5000")
	log.Fatal(http.ListenAndServe(":5000", handler))
}
