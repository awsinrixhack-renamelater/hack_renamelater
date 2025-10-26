import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function UserScores() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  if(!username) {
    navigate("/login");
  }

  const [users, setUsers] = useState
  ([ 
    { name: username, score: 0 },
    { name: "Alice", score: 0 },
    { name: "Bob", score: 0 },
    { name: "Claude", score: 0 },
   ]);

  const [newUser, setNewUser] = useState(username);

  // OKAY so yourName is Alice right now but we can change afterwards when we connect backend
  const [yourName, setYourName] = useState(username); 
  // ^^^ OKAY so yourName is Alice

  function addUser() {
    // if(newUser == null) return;
    // const checker = newUser.trim(); //trim() func removes whitespace @ start & end &&& checks if user input is empty \t and \n
    // // if empty return
    // if (!checker) return;
    // // does name already exist?
    // if (users.some((u) => u.name.toLowerCase() === checker.toLowerCase())) 
    //   {
    //   alert("That username already exists, please try something else!");
    //   return;
    //   }
    // // If passes checks add user
    // setUsers([...users, { name: checker, score: 0 }]);
    // //resets input box
    // setNewUser("");
  }

  // WE CAN GET RID OF THIS LATER WHEN CONNECT TO BACKEND
  function increaseScore(index: number) { //incr by 1
    setUsers(users.map( ( u, i ) => i === index ? { ...u, score: u.score + 1 } : u ));
  }

  function resetScores() { //resets score to 0
    setUsers(users.map( (u) => ({ ...u, score: 0 }) ));
  }
  // ^^^ WE CAN GET RID OF THIS LATER WHEN CONNECT TO BACKEND

  // sorts users by largest to smallest score
  const rankedUsers = [...users]. sort(( a, b ) => b.score - a.score);

//I LOVE COLORS
  const colors = {
    ltgr: "#72d3dcff",
    ltbu: "#83b5f1ff",
    mint: "#abf2dbff",
    teal: "#4C96A8",
    navy: "#2C3E58",
    white: "#ffffff",
  };
  
  // finds "your user" object so you can see your own score
  const yourUser = users.find(u => u.name === yourName);

  // MAIN RETURN
  return (

    //container!
    <div
      style={{
        display: "flex", // helps with centering
        flexDirection: "column", // stacks banners vertically
        alignItems: "center", // centers horizontally
        minHeight: "100vh", // height of viewport (viewport = visible area of webpage!)
        width: "100%", // width of viewport
        backgroundColor: colors.white,
        fontFamily: "'Poppins', sans-serif", // clean and yet pretty
        color: colors.navy,
        padding: "2rem", // spacing around edges
        boxSizing: "border-box", // ensures padding doesn't mess with width/height, who knew?
      }}
    >
      <h2 style={{ marginBottom: "1rem", color: colors.navy }}>
        🏆 Scoreboard 🏆
      </h2>

      {/* INPUTS */}
      {/* specifically: username input box and add user button */}
      <div style={{ marginBottom: "1rem" }}>
        {/* GPT came in clutch with template once more */}
        <input
          type="text"
          // FOR BACK END PEEPS!!! Need to connect User ID to User's Name 
          // so that only name is shown on leader board, not ID
          placeholder="Enter user ID"

          // value={newUser} // controlled component = value is tied to state = we can reset it after adding user
          onChange={(e) => setNewUser(e.target.value)} // updates state as user types
          onKeyDown={(e) => e.key === 'Enter' && addUser()} // ALLOWS ADD W/ ENTER KEY
          style={{
            padding: "0.5rem",
            borderRadius: "8px",
            border: `1px solid ${colors.teal}`,
            marginRight: "0.5rem",
            width: "200px",
          }}
        />
        {/* add user button */}
        <button
          onClick={addUser}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            border: "none",
            backgroundColor: colors.ltbu,
            color: "white",

            cursor: "pointer", //Makes clickable!
            fontWeight: "bold",
          }}
        >
          Add Friend
        </button>
      </div>

          {/* Your Score banner */}
      {yourUser && (
        //Friend Gpt helped out here, used it's templet to created banners
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: colors.teal,
            color: "white",
            borderRadius: "14px",
            padding: "1rem 2rem",
            width: "60%",
            fontWeight: "bold",
            fontSize: "1.1rem",
            //boxShadow: "0 3px 8px rgba(0,0,0,0.15)",


            border: `1px solid ${colors.navy}`,// highlight border


            margin: "0 auto",
          }}
        >
          <div>Your Score ( {yourUser.name} )</div>
          <div>{yourUser.score}</div>
        </div>
      )}

      {/* Makes Scoreboard scrollable */}
      <div
        style={{
          flex: 1, // helps with empty vert space
          width: "60%",
          overflowY: "auto",
           //^^^ allows for scroll if too many users
          display: "flex", // Stacks the banners!
          flexDirection: "column", //specifically stacks vertically
          gap: "1rem", // space between banners
          padding: "0.5rem 0", // vertical padding
          marginBottom: "1rem", // space btw/n scoreboard and reset button, NOT on the sides like docs
        }}
      >
        {rankedUsers.map((user, index) => {
          // Assigns banner color based on rank
          const bannerColor =
            index === 0
              ? colors.ltbu
              : index === 1 // #1 = lightblue
              ? colors.ltgr
              : index === 2 // #2 = lightgreen
              ? colors.mint //#3 = mint
              : colors.white; // everyone else = white

          //const textColor = index <= 2 ? colors.white : colors.navy;
          // top 3 are gifted white text, everyone else gets navy
          const textColor = colors.navy;

          return (
            //Friend Gpt helped out here, used it's templet to created banners
            <div
              key={user.name}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: bannerColor,
                borderRadius: "14px",
                padding: "1rem 2rem",
                border: `1px solid ${colors.navy}`,
              }}
            >
              {/* Rank number */}
              <div style={{ fontWeight: "bold", fontSize: "1.2rem", color: textColor }}>
                #{index + 1}
              </div>
              {/* Username */}
              <div
                style={{
                  flexGrow: 1, // takes up remaining space!
                  textAlign: "left", // aligns text to left side of div?
                  marginLeft: "1rem",// space between rank number and name
                  fontSize: "1.1rem", // makes smaller than rank number

                  color: textColor, //note: NOT text.Color, 2 diff things
                }}
              >
                {/* MORE Username */}
                {user.name}
              </div>

              {/* User Score */}
              <div
                style={{
                  fontWeight: "bold",
                  marginRight: "1rem",
                  fontSize: "1.1rem",
                  color: textColor,
                }}
              >
                {user.score}
              {/* THIS BUTTON INCREASES SCORE, we can delete this later and rewrite when we connect to backend */}
              </div>
              <button
                onClick={() => increaseScore(users.findIndex((u) => u.name === user.name)) }
                style={{
                  padding: "0.4rem 0.8rem",
                  borderRadius: "8px",
                  backgroundColor: colors.teal,
                  color: "white",
                  border: `1px solid ${colors.navy}`,
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                +1 
              </button>
            </div> // ^^^^^^THIS BUTTON INCREASES SCORE (end)
          );
        })}
      </div>
  
      

    {/* button routes from SCOREBOARD to HOMEPAGE*/}
    <div>
      <button 
        onClick={() => navigate("/home")}
        style={{
          backgroundColor: colors.teal,
          border: "2px solid white",
          color: "white",

          padding: "10px 20px",
          borderRadius: "8px",
          fontSize: "1rem",
          cursor: "pointer",
          marginBottom: "1rem",
        }}

        > Homepage
        
      </button>
    </div>
    {/* ^^^ button routes from SCOREBOARD to HOMEPAGE*/}

      {/* Reset button, CAN ALSO DELETE once connected with backend */}
      <button
        onClick={resetScores}
        style={{
          marginBottom: "1rem",
          padding: "0.5rem 1.5rem",
          borderRadius: "8px",
          border: "none",
          backgroundColor: colors.ltbu,
          color: "white",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Reset Scores
      </button>


    </div>
  );
}

