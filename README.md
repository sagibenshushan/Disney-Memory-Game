Sagi Ben Shushan.
209351147.
EX1- Disney Memory Game.
URL- http://sagibe.mysoft.jce.ac.il/Ex1/

Files:
disney.js
get_current_time.php
index.html
main.css

An explanation for what the messages between the client and the server are at each stage of the game:
1)At the beginning of the game there is a call to the server for index.html .
2) When the user clicks on new game there is a call to the server in order to get the time of staring game from get_current_time.php .
3) Aftet the user clicks on new game there is a call to the Disney server, a request to the API using AJAX.
4) At the end of the game there is a call to the server for getting the time of ending game, calculation of how long the game took and alart it.

-The visual design of the game is chosen according to personal opinion.
