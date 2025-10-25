package main

import (
	"crypto/sha256"
	"database/sql"
	"encoding/hex"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

type App struct {
	DB *sql.DB
}

func (a *App) Signup(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]
	pwd := vars["pwd"]

	h := sha256.New()
	h.Write([]byte(pwd))
	hashed := hex.EncodeToString(h.Sum(nil))

	ctx := r.Context()
	_, err := a.DB.ExecContext(ctx, "INSERT INTO users (id, password_hash) VALUES (?, ?)", id, hashed)
	if err != nil {
		log.Printf("signup exec error: %v", err)
		http.Error(w, "failed to create user", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	w.Write([]byte("created"))
}