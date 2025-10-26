package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

type friend struct {
	Username string `json:"username"`
	Score    int    `json:"score"`
}

// adds a friendship to the friends DB
func (a *App) addFriend(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("Bad response type"))
		return
	}
	queryParams := r.URL.Query()

	user1_string := queryParams.Get("user1")
	user2_string := queryParams.Get("user2")

	user1, err1 := strconv.Atoi(user1_string)
	user2, err2 := strconv.Atoi(user2_string)
	if err1 != nil || err2 != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("Invalid user IDs"))
		return
	}
	_, err := a.DB.ExecContext(r.Context(), "INSERT INTO friends (ID1, ID2) VALUES (?, ?), (?, ?)", user1, user2, user2, user1)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(fmt.Sprintf("Error updating DB: %v", err)))
		return
	}
	w.WriteHeader(http.StatusOK)
}

// get all friends of a user, route: getallfriends/{user}
func (a *App) getAllFriends(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("Invalid request method"))
		return
	}
	vars := mux.Vars(r)
	userID, ok := vars["user"]
	if !ok {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("Missing user var"))
		return
	}
	rows, err := a.DB.QueryContext(r.Context(), "SELECT Username, Score FROM users LEFT JOIN friends ON friends.ID2 = users.ID WHERE friends.ID1 = ?", userID)
	defer rows.Close()

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(fmt.Sprintf("Failed to query DB: %v", err)))
		return
	}

	friendList := []friend{}

	for rows.Next() {
		var username string
		var score int
		if err := rows.Scan(&username, &score); err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(fmt.Sprintf("Error scanning SQL row: %v", err)))
			return
		}
		friendList = append(friendList, friend{Username: username, Score: score})
	}

	jsonData, err := json.Marshal(friendList)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(fmt.Sprintf("Error parsing to JSON: %v", err)))
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/json")
	fmt.Fprintln(w, string(jsonData))
	// w.Write(jsonData)
}
