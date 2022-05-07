let express = require('express');
let router = express.Router();
const { validationResult , body } = require("express-validator");
const validateUser = require('../middlewares/validateUser')
let Competitor = require('../models/competitor');

router.get("/:event-type/:festid/:eventid",validateUser,async(req,res) => {

    let findWinners = []

    if(req.params.event-type === "solo") {
        findWinners = await Competitor.aggregate([
            { "$project": {
                "user_id": 1,
                "event_id": 1
            }},
            { "$sort": { "votes": -1 } },
            { "$limit": 3 }
        ]).catch(err => {
            return res.status(400).send("Can't fetch the winners")
        })
    
        console.log(findWinners)
    } else {


        findWinners = await Competitor.aggregate([
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

        console.log('winners: ',findWinners)

    }
    res.status(200).json({success: 1, winners: findWinners});
})

module.exports = router;