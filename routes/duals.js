const express = require("express");
const router = express.Router()
let createRivals = require('../operations/createRivals');
let Scheduler = require('../models/scheduler')
let Competitor = require('../models/competitor');
let Users = require('../models/users');
const { validationResult , body } = require("express-validator");
const validateUser = require('../middlewares/validateUser')

router.get('/:festid/:eventid/event-status',validateUser,async(req,res)=> {
    
    let currentRound = await Competitor.find({event_id: req.params.eventid}).catch(err => {
        return res.status(400).send('error loading the event rounds');
    })

    // console.log(currentRound)

    let schedule = await Scheduler.find({'events.event_id': req.params.eventid}).select({user_id:1}).catch(err => {
        return res.status(400).send('error loading the schedule');
    })

    if(schedule.length === 0) {
        return res.status(400).send('no registrations for this event available')
    }

    if(currentRound.length === 0) {

        // console.log('schedule:',schedule);
        console.log('currentRound length is zero')

        let n = schedule.length; 
        
        let nearestPow2 = Math.pow(2,Math.floor(Math.log(n)/Math.log(2)) + 1);
        let roundDetails = [];
        console.log(nearestPow2)

        let temp = schedule;

        if(temp.length !== nearestPow2) {
            temp = schedule.slice(0,2*n-nearestPow2);
        }

        temp.map(element => {
            roundDetails.push({
                user_id: element.user_id,
                event_id: req.params.eventid,
                round_no: (nearestPow2 === schedule.length) ? 0 : -1, 
                competitorScore: []
            })
        });

        console.log('total competitors for this round: ',roundDetails.length)

        let competitorsDetails = await Competitor.insertMany(roundDetails).catch(err => {
            return res.status(400).send('error loading competitor details');
        });

        // console.log(competitorsDetails)
        currentRound = competitorsDetails;
        
    }

    // console.log('currentRound:',currentRound)

    let names = await Users.find({_id : {$in : currentRound.map(details => details.user_id)}}).select('name').catch(err => {
        return res.status(400).send('error loading users');
    });
    // console.log(names)

    let duals = createRivals(names);
    // console.log('duals:',duals)

    res.status(200).json({currentRound: currentRound, roundNo: currentRound[0].round_no, participants: schedule.length, duals : duals});
});

router.post('/:festid/:eventid/nextMatch',
    // body("score1","Enter a valid competitor score.").isFloat({min : 0}),
    // body("score2","Enter a valid competitor score.").isFloat({min : 0}),
    // body("comp1","Competitor does not exist. Please try again.").exists({checkFalsy: true}),
    // body("comp2","Competitor does not exist. Please try again.").exists({checkFalsy: true}),
    // body("round","Round number should be greater than 0").isFloat({min : 0}),
    validateUser,async(req,res)=> {

    // let errors = validationResult(req);

    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() });
    // }
    
    //next match button will be disabled after 1 click
    let {comp1, comp2, score1,score2, round} = req.body;

    let rec1 = await Competitor.updateOne({user_id : comp1}, { $set : { round_no : round }, $push : {competitorScore : score1}}).catch(err => {
        return res.status(400).send('Cannot update competitor score for the current match.');
    })
    
    let rec2 = await Competitor.updateOne({user_id : comp2}, { $set : { round_no : round }, $push : {competitorScore : score2}}).catch(err => {
        return res.status(400).send('Cannot update competitor score for the current match.');
    })

    console.log('Competitor1 updated record: ', rec1);
    console.log('Competitor2 updated record: ', rec2);

    let deleteEvent = await Scheduler.updateOne({user_id: (score1 > score2) ? comp2 : comp1}, {$pull : {events: {event_id : req.params.eventid}}}).catch(err => {
        return res.status(200).send('not able to remove the event from user schedule');
    })

    res.status(200).json({success: true, winner : (score1 > score2) ? comp1 : comp2});
});

router.get('/:festid/:eventid/nextRound',validateUser,async(req,res)=> {

    //next round button will be disabled after 1 click
    let findCompetitors = await Scheduler.find({'events.event_id': req.params.eventid}).catch(err => {
        return res.status(400).send('error loading the schedule');
    });

    let currentCompetitors = await Competitor.find({user_id: {$in : findCompetitors.map(details => details.user_id)}}).catch(err => {
        return res.status(400).send('error loading all competitors');
    });

    let names = await Users.find({_id : {$in : currentCompetitors.map(details => details.user_id)}}).select('name').catch(err => {
        return res.status(400).send('error loading users');
    });
    console.log(names)

    let duals = createRivals(names);
    console.log('duals: ',duals)

    res.status(200).json({currentRound: currentCompetitors, roundNo: currentCompetitors[0].round_no, participants: findCompetitors.length, duals : duals});

});

router.post('/:festid/:eventid/finish',
    // body("score1","Enter a valid competitor score.").isFloat({min : 0}),
    // body("score2","Enter a valid competitor score.").isFloat({min : 0}),
    // body("comp1","Competitor does not exist. Please try again.").exists({checkFalsy: true}),
    // body("comp2","Competitor does not exist. Please try again.").exists({checkFalsy: true}),
    // body("round","Round number should be greater than 0").isFloat({min : 0}),
    validateUser,async(req,res)=> {

    // let errors = validationResult(req);

    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() });
    // }
    
    //finish button will be disabled after 1 click

    let {comp1, comp2, score1,score2, round} = req.body;

    let rec1 = await Competitor.updateOne({user_id : comp1}, { $set : { round_no : round }, $push : {competitorScore : score1}}).catch(err => {
        return res.status(400).send('Cannot update competitor score for the current match.');
    })
    
    let rec2 = await Competitor.updateOne({user_id : comp2}, { $set : { round_no : round }, $push : {competitorScore : score2}}).catch(err => {
        return res.status(400).send('Cannot update competitor score for the current match.');
    })

    console.log('Competitor1 updated record: ', rec1);
    console.log('Competitor2 updated record: ', rec2);

    let deleteEvent = await Scheduler.updateOne({user_id: (score1 > score2) ? comp2 : comp1}, {$pull : {events : {event_id : req.params.eventid}}}).catch(err => {
        return res.status(200).send('not able to remove the event from user schedule');
    })

    let findWinners = await Competitor.aggregate([
        { "$project": {
            "user_id": 1,
            "event_id": 1,
            "competitorScore": 1,
            recent: { $arrayElemAt: [ "$competitorScore", -1 ] }
        }},
        { "$sort": { "round_no" : -1, "competitorScore": -1 } },
        { "$limit": 3 }
    ]).catch(err => {
        return res.status(400).send("Can't fetch the winners")
    })

    console.log(findWinners)

    let cleanDB = await Competitor.deleteMany({}).catch(err => {
        return res.status(400).send('Unable to clean the database');
    })

    console.log(cleanDB);

    res.status(200).json({success: 1, winners: findWinners});
})

module.exports = router;