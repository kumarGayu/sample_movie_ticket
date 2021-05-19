const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit'); // Limits allowed calls for x amount of ms
const slowDown = require('express-slow-down'); // Slows each following request if spammed
const axios = require('axios'); // Use axios to make http requests
// const example = require('./example.js'); ==> load specifc api file
const fs = require('fs');
const { request } = require('express');
const middlewares = require('../middlewares.js');

const AVAILABLE = "AVAILABLE";
const validateCount = (req, res, next) => {
  const rawCount = req.params.count;
  let counts = rawCount.split(",");
  let invalid = counts.find((c) => isNaN(parseInt(c)) === true);
  if(invalid === undefined) {
    req.params["counts"] = counts.map((c) => parseInt(c));
    return next();
  }
  return res.status(422).json({success: false, error: 'Sorry, wrong input'});
}
// Limiting number of requests possible for a set amount of time
const limiter = rateLimit({
	windowMs: 30 * 1000, // Time frame (30 seconds * 1000ms)
	max: 10, // Max amount of requests
});

const sortColumnBasedOnCenter = (columns, center) => {
  const neededColumns = columns.map((c) => c-center);
  const sortedColumns = neededColumns.sort((a,b) => Math.abs(a) - Math.abs(b))
  return sortedColumns.map((c) => c+center); 
};

const getContinuousSeats = (count, seats, centerNumber) => {
  let contSeats = [];
  if(count === 1) {
    contSeats = seats.splice(0,1);
  } else {
    for (var seat of seats) {
      let seatColNumber = parseInt(seat.match(/\d+/)?.[0] ?? 0);
      let seatRowNumber = seat.match(/[a-z]+/)?.[0];
      let neighbor = seatColNumber >= centerNumber ? seatColNumber - 1: seatColNumber + 1;
      if(contSeats.includes(seatRowNumber+neighbor)) {
        contSeats.push(seat);
      } else {
        contSeats = [seat];
      }
      if(contSeats.length === count) {
        break;
      }
    }
  }
  contSeats.map((s) => seats.splice(seats.findIndex((si) => si === s), 1));
  return contSeats.length === count ? contSeats : [];
};

const findBestSeats = (counts, availability) => {
  const { columns } = availability?.venue?.layout;
  const { seats } = availability;
  const availableSeatKeys = Object.keys(seats)?.filter(seat => availability.seats[seat].status === AVAILABLE );
  const rowVsSeat = {};
  availableSeatKeys.forEach((s) => {
    const { row, column } = seats[s]; 
    rowVsSeat[row] === undefined ? rowVsSeat[row] = [column] :  rowVsSeat[row] = [ ...rowVsSeat[row], column];
  });
  let rowSet = new Set();
  Object.keys(rowVsSeat).map((k) => rowSet.add(k));
  const sortedRows = [...rowSet].sort();
  const columnCenter = Math.round(columns/2);
  let sortedSeats = [], result = [];
  sortedRows.forEach((nearRow) => {
    let sortedColumns = sortColumnBasedOnCenter(rowVsSeat[nearRow], columnCenter);
    sortedSeats = [...sortedSeats, ...sortedColumns.map(c => `${nearRow}${c}`)]
  });
  counts.map((c) => {
    if(sortedSeats.length >= c) {
      const contSeats = getContinuousSeats(c, sortedSeats, columnCenter);
      result.push(contSeats.map(s => seats[s]));
    } else {
      result.push(-1);
    }
  })
  

  return result;
}

// Slowing down each request after a specific number of requests
const speedLimiter = slowDown({
	windowMs: 30 * 1000, // Time frame (30 seconds * 1000ms)
	delayAfter: 3, // Start delaying after 3 requests within the time frame
	delayMs: 500 // Make each requests 500ms slower
});

router.get('/', limiter, speedLimiter, (req, res) => {
	res.json({
		message: 'API - 👋🌎🌍🌏'
	});
});

router.get('/search/:count', limiter, speedLimiter, validateCount, (req, res) => {
  let counts = req.params.counts;
  counts = counts.sort()
  let rawdata = fs.readFileSync('data/venues.json');
  let venues = JSON.parse(rawdata);
  let seats = findBestSeats(counts, venues);
	res.json({
		seats
	});
});

router.get('/book/:keys', limiter, speedLimiter, (req, res) => {
  let seatKeys = req.params.keys.split(",");
  let rawdata = fs.readFileSync('data/venues.json');
  let venues = JSON.parse(rawdata);
  seatKeys.forEach((k) => { 
    if (venues.seats[k] === undefined || venues.seats[k].status === "BOOKED" ) {
      return res.status(400).json({success: false, error: 'Sorry, the seat is not available'});
    } else {
      venues.seats[k].status = "BOOKED" 
    } 
  })
  fs.writeFileSync('data/venues.json', JSON.stringify(venues));
	res.json({
		booked: seatKeys
	});
});



// router.use('/example-path', example); ==> to be routed to: api/chosen_path for example

module.exports = router;