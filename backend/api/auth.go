package main

import (
	"context"
	"crypto/sha256"
	"database/sql"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/gorilla/mux"
)

type contextKey string

const claimsKey contextKey = "claims"


func (a *App) Signup(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	vars := mux.Vars(r)
	username := vars["username"]
	if len(username) == 0 || len(username) > 20 {
		http.Error(w, "username invalid", http.StatusBadRequest)
		return
	}
	grade := vars["grade"]
	gradeInt, err := strconv.Atoi(grade)
	if err != nil {
		http.Error(w, "atoi failure", http.StatusInternalServerError)
	}
	if gradeInt < 0 || gradeInt > 12 {
		http.Error(w, "grade out of bounds", http.StatusBadRequest)
		return
	}
	pwd := vars["pwd"]
	h := sha256.Sum256([]byte(pwd))
	hashed := hex.EncodeToString(h[:])

	res, err := a.DB.ExecContext(ctx, "INSERT INTO users (Username, Score, grade, questionsAnswered) VALUES (?, NULL, ?, 0)", username, grade)
	if err != nil {
		log.Printf("signup insert user error: %v", err)
		http.Error(w, "failed to create user", http.StatusInternalServerError)
		return
	}
	uid, err := res.LastInsertId()
	if err != nil {
		var id int64
		err2 := a.DB.QueryRowContext(ctx, "SELECT ID FROM users WHERE username=? LIMIT 1", username).Scan(&id)
		if err2 != nil {
			log.Printf("signup get id error: %v, %v", err, err2)
			http.Error(w, "failed to create user", http.StatusInternalServerError)
			return
		}
		uid = id
	}

	_, err = a.DB.ExecContext(ctx, "INSERT INTO auth (userID, Hash) VALUES (?, ?)", uid, hashed)
	if err != nil {
		log.Printf("signup insert auth error: %v", err)
		http.Error(w, "failed to create auth record", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	w.Write([]byte("created"))
}

func (a *App) Login(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	vars := mux.Vars(r)
	username := vars["username"]
	pwd := vars["pwd"]
	h := sha256.New()
	h.Write([]byte(pwd))
	hashed := hex.EncodeToString(h.Sum(nil))
	var id int64
	err := a.DB.QueryRowContext(ctx, "SELECT ID FROM users WHERE username=? LIMIT 1", username).Scan(&id)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "invalid credentials", http.StatusUnauthorized)
			return
		}
		log.Printf("select id error: %v", err)
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}

	var stored string
	err = a.DB.QueryRowContext(ctx, "SELECT hashPW FROM auth WHERE userID=? LIMIT 1", id).Scan(&stored)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "invalid credentials", http.StatusUnauthorized)
			return
		}
		log.Printf("select hash error: %v", err)
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}

	if stored != hashed {
		http.Error(w, "login failed", http.StatusUnauthorized)
		return
	}

	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "dev-secret"
	}
	claims := jwt.MapClaims{
		"sub": id,
		"exp": time.Now().Add(24 * time.Hour).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signed, err := token.SignedString([]byte(secret))
	if err != nil {
		log.Printf("token sign error: %v", err)
		http.Error(w, "failed to create token", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(map[string]string{"token": signed})
}

func (a *App) Auth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		auth := r.Header.Get("Authorization")
		if auth == "" {
			http.Error(w, "missing Authorization header", http.StatusUnauthorized)
			return
		}
		parts := strings.SplitN(auth, " ", 2)
		if len(parts) != 2 || parts[0] != "Bearer" {
			http.Error(w, "invalid Authorization header", http.StatusUnauthorized)
			return
		}
		tokenStr := parts[1]

		secret := os.Getenv("JWT_SECRET")
		if secret == "" {
			secret = "dev-secret"
		}

		parsed, err := jwt.Parse(tokenStr, func(t *jwt.Token) (any, error) {
			if t.Method.Alg() != jwt.SigningMethodHS256.Alg() {
				return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
			}
			return []byte(secret), nil
		})
		if err != nil || !parsed.Valid {
			http.Error(w, "invalid token", http.StatusUnauthorized)
			return
		}

		ctx := context.WithValue(r.Context(), claimsKey, parsed.Claims)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}