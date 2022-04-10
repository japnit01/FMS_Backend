let express = require('express');
let router = express.Router();
let validateUser = require('../middlewares/validateUser')
const { validationResult , body } = require("express-validator");

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

module.exports = router;