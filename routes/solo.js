let express = require('express');
let router = express.Router();
let Scheduler = require('../models/scheduler')
let Competitor = require('../models/competitor');
let Users = require('../models/users');
const { validationResult , body } = require("express-validator");
const validateUser = require('../middlewares/validateUser')

router.get('/:festid/:eventid/event-status',async(req, res)=> {

    let compDetails = await Competitor.find({event_id: req.params.eventid}).catch(err => {
        return res.status(400).send('error loading the event rounds');
    })

    let schedule = await Scheduler.find({'events.event_id': req.params.eventid}).select({user_id:1}).catch(err => {
        return res.status(400).send('error loading the schedule');
    })

    if(compDetails.length === 0) {

        console.log('schedule:',schedule);
        let roundDetails = [];

        schedule.map(element => {
            roundDetails.push({
                user_id: element.user_id,
                event_id: req.params.eventid
            })
        });

        let competitorsDetails = await Competitor.insertMany(roundDetails).catch(err => {
            return res.status(400).send('error loading competitor details');
        });

        console.log(competitorsDetails)
        compDetails = competitorsDetails;
    }

    console.log('Solo Performances Details:',compDetails)

    let names = await Users.find({_id : {$in : compDetails.map(details => details.user_id)}}).select('name').catch(err => {
        return res.status(400).send('error loading users');
    });
    console.log(names)

    res.status(200).json({compDetails: compDetails, participants: schedule.length, compList: names});
});

router.post('/',
    body("comp_id","Competitor does not exist. Please vote for the correct competitor.").exists({checkFalsy: true}),
    validateUser,async(req,res)=> {

    // let errors = validationResult(req);

    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() });
    // }

    // competitor's user_id received in req.body

    let userRecord = await Users.findOne({_id : req.user}).catch(err => {
        return res.status(404).send('User not found');
    })

    if(userRecord.hasVoted === true) {
        return res.status(200).json({success: false, msg : 'You have already voted!'});
    }

    let updateUserRecord = await Users.updateOne({_id : req.user}, {$set : {hasVoted : true}}, {new : true}).catch(err => {
        return res.status(400).send('Unable to record your vote');
    })

    console.log("Vote recorded: ",updateUserRecord);

    let recordCompVote = await Competitor.updateOne({user_id : req.body.comp_id}, {$inc : {votes : 1}},{new : true}).catch(err => {
        return res.status(400).send("Unable to increment competitor's votes.")
    });

    console.log('Votes incremented: ', recordCompVote);
    
    res.status(200).json({success: true, 'Competitor Record': recordCompVote});
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
    // }let allCompetito
    
    //finish button will be disabled after 1 click

    let findWinners = await Competitor.aggregate([
        { "$project": {
            "user_id": 1,
            "event_id": 1
        }},
        { "$sort": { "votes": -1 } }
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