 // Catching elements from dom
 const tilesContainer = document.querySelector(".tiles");
 const alertHeader = document.getElementById("alert");
 const buttonContainer = document.getElementById("button-container");
 const button = document.createElement("button");
 const characterData = document.getElementById("character-data");
 
 //Defining default values
 let tileCount = 0;
 let maxPages = 0;
 let startingTime;
 
 // Game state
 let pageNumber = 0;
 let revealedCount = 0;
 let activeTile = null;
 let awaitingEndOfMove = false;
 
 //Event listener on mount
 document.addEventListener("DOMContentLoaded", buildGame);
 
 //Shuffles an array
 function shuffle(arr) {
   for (let i = arr.length - 1; i > 0; i--) {
     const j = Math.floor(Math.random() * (i + 1));
     [arr[i], arr[j]] = [arr[j], arr[i]];
   }
   return arr.slice(0, 10);
 }
 
 //Function that builds us a game
 async function buildGame() {
   // Gets the data from the API
   fetch(
     `https://api.disneyapi.dev/characters?page=${pageNumber}`
   ).then((data=>data.json())).then((jsonData)=>{
     const randomizedCharacters = shuffle(jsonData.data);
     const disneyCardArray = [...randomizedCharacters, ...randomizedCharacters];
     tileCount = disneyCardArray.length;
     maxPages = jsonData.totalPages;
     // Date class, by default the current time. getTime converts the time into miliseconds
   
     // Restart game
     if (revealedCount !== 0) {
       revealedCount = 0;
       activeTile = null;
       awaitingEndOfMove = false;
       characterData.innerText = "";
       alertHeader.innerText = "";
       Array.from(tilesContainer.childNodes).forEach((element) => {
         tilesContainer.removeChild(element);
       });
       buttonContainer.removeChild(button);
     }
   
     //Build the game
     for (let i = 0; i < tileCount; i++) {
       const randomIndex = Math.floor(Math.random() * disneyCardArray.length);
       const color = disneyCardArray[randomIndex];
       const tile = buildTile(color);
   
       disneyCardArray.splice(randomIndex, 1);
       tilesContainer.appendChild(tile);
     }
   
   });
   
   //get time
 
   fetch(`get_current_time.php`).then(data=>data.json()).then((res) =>{
     startingTime = res;
   });  
 
 }
 
 // Building each tile
 function buildTile(character) {
   //Creating elements
   const element = document.createElement("div");
   const elementImage = document.createElement("img");
   const elementText = document.createElement("span");
   elementImage.classList.add("tile-img");
   elementImage.classList.add("hidden");
   elementImage.src = character.imageUrl;
   elementText.classList.add("tile-text");
   elementText.classList.add("hidden");
   elementText.innerText = character.name;
 
   // setting values for each main element
   element.classList.add("tile");
   element.setAttribute("data-id", character._id);
   element.setAttribute("data-revealed", "false");
   element.appendChild(elementImage);
   element.appendChild(elementText);
 
   //Onclick event
   element.addEventListener("click", () => {
     const revealed = element.getAttribute("data-revealed");
 
     // Error handling
     if (awaitingEndOfMove || revealed === "true" || activeTile === element) {
       return;
     }
 
     //Display the image and the text
     elementImage.classList.remove("hidden");
     elementText.classList.remove("hidden");
 
     // div 1, div 2
     if (!activeTile) {
       activeTile = element;
       return;
     }
 
     // Getting the ID's and trying to match them
     const activeTileId = activeTile.getAttribute("data-id");
     const elementId = element.getAttribute("data-id");
 
     if (activeTileId === elementId) {
       //Styling an message for the user
       alertHeader.style.color = "green";
       alertHeader.innerText = "You picked correctly! nice!";
 
       // Revealing the element
       element.setAttribute("data-revealed", "true");
       activeTile.setAttribute("data-revealed", "true");
       revealedCount += 2;
       awaitingEndOfMove = false;
       activeTile = null;
 
       //Show data about the specific character
       characterData.innerText = `Film list: ${
         character.films.length === 0 ? "none" : character.films.join(", ")
       } 
     TV show list: ${
       character.tvShows.length === 0 ? "none" : character.tvShows.join(", ")
     }
     Video game list: ${
       character.videoGames.length === 0
         ? "none"
         : character.videoGames.join(", ")
     }
     Peak attractions: ${
       character.parkAttractions.length === 0
         ? "none"
         : character.parkAttractions.join(", ")
     }`;
 
       //Ending game
       if (revealedCount === tileCount) {
         fetch("get_current_time.php").then(data=>data.json()).then((time)=>{
             endingTime = time;
             const calculatedTimePlayed = `${Math.floor(
                 (endingTime - startingTime) 
               )} seconds`;
               alert(`You win! Great job! you played for: ${calculatedTimePlayed}`);
               button.innerText = "Play again?";
               //Recreate a game
               button.addEventListener("click", buildGame);
               buttonContainer.appendChild(button);
               if (pageNumber === maxPages) {
                 pageNumber === 0;
               } else {
                 pageNumber++;
               }
         });
       }
       return;
     } else {
       //Styling a message for the user
       alertHeader.style.color = "red";
       alertHeader.innerText = "Wrong pick! try again!";
     }
 
     // Incase a wrong answer, hiding the cards
     awaitingEndOfMove = true;
 
     setTimeout(() => {
       activeTile.children[0].classList.add("hidden");
       activeTile.children[1].classList.add("hidden");
       element.children[0].classList.add("hidden");
       element.children[1].classList.add("hidden");
       activeTile.style.backgroundColor = null;
       element.style.backgroundColor = null;
 
       awaitingEndOfMove = false;
       activeTile = null;
     }, 500);
   });
   return element;
 }