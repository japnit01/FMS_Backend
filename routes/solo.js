let express = require('express');
let router = express.Router();
let Scheduler = require('../models/scheduler')
let Competitor = require('../models/competitor');
let Users = require('../models/users');
const { validationResult , body } = require("express-validator");
const validateUser = require('../middlewares/validateUser')
const mongoose = require('mongoose');
let Results = require('../models/results')


router.get('/:festid/:eventid/event-status',async(req, res)=> {

    // {user_id:1,name:1,college:1}
    let compDetails = await Competitor.find({event_id: req.params.eventid}).select({user_id:1, name:1, college:1}).catch(err => {
        return res.status(400).send('error loading the event rounds');
    })

    // console.log('compDetails: ',compDetails)

    let schedule = await Scheduler.find({'events.event_id': req.params.eventid},{user_id:1,name: 1}).catch(err => {
        return res.status(400).send('error loading the schedule');
    })

    if(compDetails.length === 0) {

        // console.log('schedule:',schedule);
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

        // console.log('competitorDetails: ',competitorsDetails)
        compDetails = competitorsDetails;
    }

    // console.log('competitor details on backend:',compDetails)

    let names = await Users.find({_id : {$in : compDetails.map(details => details.user_id)}},{name: 1, _id: 1, college: 1}).select('name').catch(err => {
        return res.status(400).send('error loading users');
    });
    // console. log(names)
    // compDetails: compDetails

    res.status(200).json({participants: schedule.length, compList: names});
});

router.post('/:festid/:eventid/voting',
    body("comp_id","Competitor does not exist. Please vote for the correct competitor.").exists({checkFalsy: true}),
    validateUser,async(req,res)=> {

    // let errors = validationResult(req);

    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() });
    // }

    // competitor's user_id received in req.body
    if(req.body.selectedCandidates.length > 20) {
        return res.status(400).json({success: false,msg:"You cannot vote for more than 20 participants"});
    }

    let recordCompVote = await Competitor.updateOne({user_id : {$in: req.body.selectedCandidates}, event_id:req.params.eventid}, {$inc : {votes : 1}},{new : true}).catch(err => {
        return res.status(400).json({success:false,msg:"Unable to increment competitor's votes."})
    });

    console.log('Votes incremented: ', recordCompVote);
    
    res.status(200).json({success: true, 'Competitor Record': recordCompVote});
});

router.get("/:festid/:eventid/finish", validateUser, async (req, res) => {
    let findWinners = await Competitor.aggregate([
        { "$match": { "event_id": mongoose.Types.ObjectId(req.params.eventid) } },
        {
            "$project": {
                "user_id": 1,
                "event_id": 1,
                "votes": 1
            }
        },
        { "$sort": { "votes": -1 } },
    ]).catch(err => {
        return res.status(400).send("Can't fetch the winners")
    })

    console.log(findWinners)
    let winnersUserIds = findWinners.map(winner => winner.user_id);
    // console.log(winnersUserIds)
    const winnersnames = await getwinnername(winnersUserIds)


    let findresult = await Results.findOne({ event_id: req.params.eventid })
    // console.log(findresult)
    if (!findresult) {
        let resultRecord = new Results({ fest_id: req.params.festid, event_id: req.params.eventid, winners: winnersnames });
        // roundNo: findWinners[0].round_no
        resultRecord.save();
        console.log(resultRecord);
    }
    else {
        return res.status(404).send("Results have already been declared");
    }

    console.log(findWinners)

    res.status(200).json({ success: 1, winners: findWinners });
})

const getwinnername = async(winnersUserIds) =>{
    let winnersnames = [];
    winnersUserIds.map(async (wui) => {
        let name = await Users.findOne({_id : wui},{name:1})
        winnersnames.push(name)
    })

    return winnersnames;
}

module.exports = router;