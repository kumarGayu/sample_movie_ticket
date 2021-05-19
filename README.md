# Your amazing app

## Description
Welcome to my great app.

## Setup
```
npm install             # To get things goind (download all neccessary packages)
```
* Use the `.env` file to hide any information (like API keys) from the repository
* Rename `.npmignore` to `.gitignore`
* Add any file or folder to `.gitignore` to have it not uploaded to the repository
* Don't forget to add `.env` in the `.gitignore` file

## Avaliable npm scripts

```
npm run start           # Start the node js server
npm run dev             # Start the node js server with nodemon
# new terminal
npm run build           # Start webpack (build the bundle js file)


npm run test            # to run the test in api for search
npm run killNodeWin     # Kill all node processes in Windows
npm run killNodeLinux   # Kill all node processes in Linux and Mac Os
```

## Usage of API
```
http://localhost:3002/api/book/:seatID to book the seat
http://localhost:3002/data/venues.json to get the entire availability
http://localhost:3002/api/search/2 to search 2 seats
http://localhost:3002/api/search/2,1,1 to multiple search for 2 seats, 1 seat, 1 seat
```
