const express = require("express");
const router = express.Router()
let createRivals = require('../operations/createRivals');
let Scheduler = require('../models/scheduler')
let Competitor = require('../models/competitor');
let Users = require('../models/users');
const { validationResult , body } = require("express-validator");
const validateUser = require('../middlewares/validateUser')

router.get('/:festid/:eventid/event-status',validateUser,async(req,res)=> {

    let allCompetitors = await Competitor.find({event_id: req.params.eventid}).catch(err => {
        return res.status(400).send('unable to fetch competitors');
    })

    let findDistinct = await Competitor.find({}).sort('round_no').catch(err => {
        return res.status(400).send('error finding distinct records.');
    })

    let i;

    for(i=0;i<findDistinct.length;i++) {
        if(findDistinct[i].round_no > 0) {
            break;
        }
    }

    let currentRound;

    if(findDistinct.length > 0) {
        currentRound = await Competitor.find({event_id: req.params.eventid, round_no: findDistinct[i].round_no}).catch(err => {
            return res.status(400).send('error loading the event rounds');
        })
    }
    
    if(!allCompetitors) {
        return res.status(400).send('no participants available');
    }
                                

    let schedule = await Scheduler.find({'events.event_id': req.params.eventid}).select({user_id:1}).catch(err => {
        return res.status(400).send('error loading the schedule');
    })


    if(schedule.length === 0) {
        return res.status(400).send('no registrations for this event available')
    }        

    let n = schedule.length;

    if(allCompetitors.length === 0) {

        
        let nearestPow2 = Math.pow(2,Math.floor(Math.log(n)/Math.log(2)) + 1);
        let roundDetails = [];
        let temp;

        temp = JSON.parse(JSON.stringify(schedule.slice(2*n-nearestPow2, n)))

        if(schedule.length !== nearestPow2) {
            schedule = JSON.parse(JSON.stringify(schedule.slice(0,2*n-nearestPow2)));
        }


        schedule.map(element => {
            roundDetails.push({
                user_id: element.user_id,
                event_id: req.params.eventid,
                round_no: 1 , 
                competitorScore: []
            })
        });


        currentRound = JSON.parse(JSON.stringify(roundDetails));  

        temp.map(element => {
            roundDetails.push({
                user_id: element.user_id,
                event_id: req.params.eventid,
                round_no: (n !== nearestPow2) ? 2 : 1,
                competitorScore: []
            })
        })


        let competitorsDetails = await Competitor.insertMany(roundDetails).catch(err => {
            return res.status(400).send('error loading competitor details');
        });

        
    }


    let names = await Users.find({_id : {$in : currentRound.map(details => details.user_id)}}).select('name').catch(err => {
        return res.status(400).send('error loading users');
    });

    let duals = createRivals(names);

    res.status(200).json({currentRound: currentRound, roundNo: currentRound[0].round_no, participants: n, duals : duals});
});

router.post('/:festid/:eventid/nextMatch',
    body("score1","Enter a valid competitor score.").isFloat({min : 0}),
    body("score2","Enter a valid competitor score.").isFloat({min : 0}),
    body("comp1","Competitor does not exist. Please try again.").exists({checkFalsy: true}),
    body("comp2","Competitor does not exist. Please try again.").exists({checkFalsy: true}),
    body("round","Round number should be greater than 0").isFloat({min : 0}),
    validateUser,async(req,res)=> {

    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    //next match button will be disabled after 1 click
    let {comp1, comp2, score1,score2, round} = req.body;
    console.log(req.body)


    let rec1 = await Competitor.updateOne({user_id: (score1 > score2) ? comp2 : comp1}, { $set : { round_no : -round }, $push : {competitorScore :  (score1 > score2) ? score2 : score1}}).catch(err => {
        return res.status(400).send('Cannot update competitor score for the current match.');
    })
    

    let rec2 = await Competitor.updateOne({user_id: (score1 > score2) ? comp1 : comp2}, { $set : { round_no : (round+1)}, $push : {competitorScore : (score1 > score2) ? score1 : score2}}).catch(err => {
        return res.status(400).send('Cannot update competitor score for the current match.');
    })


    res.status(200).json({success: true, winner : (score1 > score2) ? comp1 : comp2});
});

router.post('/:festid/:eventid/nextRound',
    body("score1","Enter a valid competitor score.").isFloat({min : 0}),
    body("score2","Enter a valid competitor score.").isFloat({min : 0}),
    body("comp1","Competitor does not exist. Please try again.").exists({checkFalsy: true}),
    body("comp2","Competitor does not exist. Please try again.").exists({checkFalsy: true}),
    body("round","Round number should be greater than 0").isFloat({min : 0}),
    validateUser,async(req,res)=> {

        let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let {comp1, comp2, score1,score2, round} = req.body;

    let rec1 = await Competitor.updateOne({user_id: (score1 > score2) ? comp2 : comp1}, { $set : { round_no : -round }, $push : {competitorScore :  (score1 > score2) ? score2 : score1}}).catch(err => {
        return res.status(400).send('Cannot update competitor score for the current match.');
    })
    

    let rec2 = await Competitor.updateOne({user_id: (score1 > score2) ? comp1 : comp2}, { $set : { round_no : (round+1)}, $push : {competitorScore : (score1 > score2) ? score1 : score2}}).catch(err => {
        return res.status(400).send('Cannot update competitor score for the current match.');
    })


    let findDistinct = await Competitor.find({}).sort('round_no').catch(err => {
        return res.status(400).send('error finding distinct records.');
    })

    console.log('findDistinct: ',findDistinct)
    let i;

    for(i=0;i<findDistinct.length;i++) {
        if(findDistinct[i].round_no > 0) {
            break;
        }
    }

    let currentCompetitors;

    if(findDistinct.length > 0) {
        currentCompetitors = await Competitor.find({event_id: req.params.eventid, round_no: findDistinct[i].round_no}).catch(err => {
            return res.status(400).send('error loading the event rounds');
        })
    }

    let names = await Users.find({_id : {$in : currentCompetitors.map(details => details.user_id)}}).select('name').catch(err => {
        return res.status(400).send('error loading users');
    });

    let duals = createRivals(names);

    res.status(200).json({currentRound: currentCompetitors, roundNo: currentCompetitors[0].round_no, participants: currentCompetitors[0].length, duals : duals});

});

router.post('/:festid/:eventid/finish',
    body("score1","Enter a valid competitor score.").isFloat({min : 0}),
    body("score2","Enter a valid competitor score.").isFloat({min : 0}),
    body("comp1","Competitor does not exist. Please try again.").exists({checkFalsy: true}),
    body("comp2","Competitor does not exist. Please try again.").exists({checkFalsy: true}),
    body("round","Round number should be greater than 0").isFloat({min : 0}),
    validateUser,async(req,res)=> {

    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    

    let {comp1, comp2, score1,score2, round} = req.body;


    let rec1 = await Competitor.updateOne({user_id: (score1 > score2) ? comp2 : comp1}, { $set : { round_no : -round }, $push : {competitorScore :  (score1 > score2) ? score2 : score1}}).catch(err => {
        return res.status(400).send('Cannot update competitor score for the current match.');
    })
    

    let rec2 = await Competitor.updateOne({user_id: (score1 > score2) ? comp1 : comp2}, { $set : { round_no : (round+1)}, $push : {competitorScore : (score1 > score2) ? score1 : score2}}).catch(err => {
        return res.status(400).send('Cannot update competitor score for the current match.');
    })

    let findWinners = await Competitor.aggregate([
        { "$project": {
            "user_id": 1,
            "event_id": 1,
            "competitorScore": 1,
            "round_no": {"$abs" : "$round_no"}    ,
            "length" : {"$size" : "$competitorScore"}
        }},
        { "$sort": { "round_no": -1,"length": -1} },
        { "$limit": 3 }
    ]).catch(err => {
        return res.status(400).send("Can't fetch the winners")
    })

    let Winners = await Results.insertMany(findWinners).catch(err => {
        return res.status(400).send('unable to store winners')
    })

    res.status(200).json({success: 1, currentRoundWinner: (score1 >= score2) ? comp1 : comp2});
})

module.exports = router;