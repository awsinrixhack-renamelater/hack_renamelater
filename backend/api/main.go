package main

import (
	"context"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

func main() {
	ctx := context.Background();
	router := mux.NewRouter()

	router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, "Hello, World!")
	})

	db, err := InitDB(ctx);
	if err != nil {
		log.Fatalf("cannot access db: %v", err)
	}
	app := &App{DB: db}

	router.HandleFunc("/signup/{id}/{pwd}", app.Signup)

	log.Println("listening on :8000")
	log.Fatal(http.ListenAndServe(":8000", router))
}
