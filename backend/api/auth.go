package main

import (
	"crypto/sha256"
	"encoding/hex"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

func (a *App) Signup(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	vars := mux.Vars(r)
	username := vars["username"]
	if(len(username) > 20) {
		http.Error(w, "username too long", 400)
	}
	pwd := vars["pwd"]
	
	h := sha256.New()
	h.Write([]byte(pwd))
	hashed := hex.EncodeToString(h.Sum(nil))

	_, err := a.DB.ExecContext(ctx, "INSERT INTO auth (userID, hashPW) VALUES (NULL, $1)", hashed)
	if err != nil {
		log.Printf("signup exec error: %v", err)
		http.Error(w, "failed to create user", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	w.Write([]byte("created"))
}