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

	fmt.Printf("Started backend api")

	router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, "Hello, World!");
	})
	// router.HandleFunc("/signup/{id}/{pwd}", app.Signup);
	router.HandleFunc("/testDB", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, "Testing DB");
		db, err := InitDB(ctx);
		if err != nil {
			log.Fatalf("cannot access db: %v", err);
		}
		app := &App{DB: db};
		testDB(app, ctx);
	})

	log.Println("listening on :5000")
	log.Fatal(http.ListenAndServe(":5000", router))
}
