let express = require('express');
let router = express.Router();
let validateUser = require('../middlewares/validateUser')
const { validationResult , body } = require("express-validator");

router.get('/',validateUser,async(req,res)=> {

    let allCompetitors = await Competitor.find({},{user_id: 1, name: 1}).catch(err => {
        return res.status(404).send('Competitors not found');
    })

    res.status(200).json({success: true, participants: allCompetitors})
});


router.post('/',
    body("comp_id","Competitor does not exist. Please vote for the correct competitor.").exists({checkFalsy: true}),
    validateUser,async(req,res)=> {

    // let errors = validationResult(req);

    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() });
    // }

    // competitor's user_id received in req.body

    let recordCompVote = await Competitor.updateOne({user_id : req.body.comp_id}, {$inc : {votes : 1}},{new : true}).catch(err => {
        return res.status(400).send("Unable to increment competitor's votes.")
    });

    console.log('Votes incremented: ', recordCompVote);
    
    res.status(200).json({success: true, 'Competitor Record': recordCompVote});
});

module.exports = router;