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
	ctx := context.Background();
	router := mux.NewRouter();

	db, err := InitDB(ctx);
	if err != nil {
		log.Fatalf("cannot access db: %v", err);
	}
	app := &App{DB: db};
	testDB(app, ctx);

	router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, "Hello, World!");
	})
	router.HandleFunc("/signup/{id}/{pwd}", app.Signup);

	log.Println("listening on :8000")
	log.Fatal(http.ListenAndServe(":8000", router))
}
