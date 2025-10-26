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
<<<<<<< HEAD
	mux := http.NewServeMux()
=======
	router := mux.NewRouter()
	// router.Use(corsMiddleware)
>>>>>>> 3e04313902203bdb87e7d10befb10ff031a97b3d
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
