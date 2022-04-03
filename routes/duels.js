const express = require("express");
const router = express.Router()
let createRivals = require('../operations/createRivals');
let Scheduler = require('../models/scheduler')
// let Results = require('../models/results')
let Competitor = require('../models/competitor');
let Users = require('../models/users')
// const Scheduler = require("../models/scheduler");

router.get('/:festid/:eventid/event-status',async(req,res)=> {
    // let results = await Results.findOne({fest_id: req.params.festid, event_id: req.params.eventid}).catch(err=> {
    //     return res.tatus(404).send("Competition not found");
    // });
    let currentRound = await Competitor.find({event_id: req.params.eventid}).catch(err => {
        return res.status(400).send('error loading the event rounds');
    })

    if(currentRound.length === 0) {
        // let allCompetitors = await Scheduler.find({event_id: req.params.eventid}).catch(function(err) {
        //     return res.status(400).json({error: err.array()});
        // })
        let schedule = await Scheduler.find({'events.event_id': req.params.eventid}).select({user_id:1}).catch(err => {
            return res.status(400).send('error loading the schedule');
        })

        console.log('schedule:',schedule);

        let roundDetails = [];

        schedule.map(element => {
            roundDetails.push({
                user_id: element.user_id,
                event_id: req.params.eventid,
                round_no: 1, 
                competitorScore: []
            })
        });

        let competitorsDetails = await Competitor.insertMany(roundDetails).catch(err => {
            return res.status(400).send('error loading competitor details');
        });

        console.log(competitorsDetails)

        currentRound = competitorsDetails
        
        // let roundDetails = {
        //     user_id: , 
        //     event_id: req.params.eventid, 
        //     roundNo: 1, 
        //     competitorScore: []
        // }

        // let prevRound = new Results(roundDetails);
        // let saveRound = await prevRound.save();

        // console.log(saveRound);
    }

    // let currentRound = await Results.find().sort({_id:-1}).limit(1).catch(err => {
    //     return res.status(400).send('error loading the current round');
    // })
    console.log('currentRound:',currentRound)

    // let names = currentRound.map(details => details.name);
    let names = await Users.find({user_id : {$in : currentRound.map(details => details.user_id)}}).select('name').catch(err => {
        return res.status(400).send('error loading users');
    });
    console.log(names)

    let duels = createRivals(names);
    console.log('duels:',duels)

    res.status(200).json({currentRound: currentRound, duels : duels});
});

router.post('/:festid/:eventid/nextRound',async(req,res)=> {

    let results = await Results.find({fest_id: req.params.festid, event_id: req.params.eventid, }).catch(err => {
        return res.status(400).send("Can't fetch results of this competition");
    });

    let roundDetails = {
        fest_id: req.params.festid, 
        event_id: req.params.eventid, 
        roundNo: results.count()+1, 
        winners: req.body,
        competitors: []
    }

    let allCompetitors = [];
    previousRoundResults = await Results.find().sort({_id:-1}).limit(1).catch(function(err) {
        return res.status(400).json({error: err.array()})
    });

    allCompetitors = previousRoundResults.winners;

    // shuffling the competitors
    shuffle(allCompetitors);
    roundDetails.competitors = allCompetitors;

    let prevRound = new Results(roundDetails);
    let saveRound = await prevRound.save();

    console.log(saveRound);

    res.status(200).json({prevRound: saveRound});
});

module.exports = router;