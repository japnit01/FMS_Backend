let express = require('express');
let router = express.Router();
let {body, validationResult} = require('express-validator');
let Competitions = require('../models/competition');
let Users = require('../models/user');
let validateUser = require('../middlewares/validateUser');

router.get('/:festid/getCompetitions',validateUser,async(req,res)=> {
    let allCompetitions = await Competitions.find({fest_id: req.params.festid});
    res.status(200).json({competitions : allCompetitions});
})

router.post('/:festid/add-competition',
    // body("startTime","Enter a valid start time.").custom(({req})=> req.body.startTime > Date.now()),
    // body("startdate","Enter a valid end time.").custom(({req})=> req.body.endTime >= req.body.startTime),
    // body("sdate","Enter a valid start date.").custom(({req})=> req.body.startdate > Date.now()),
    // body("fee","Round number should be greater than or equal to 0").isFloat({min : 0}),
    validateUser,async(req,res)=> {

    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    let compDetails = req.body;
    compDetails.fest_id = req.params.festid;

    let newComp = new Competitions(compDetails);
    await newComp.save().catch(err => {
        return res.status(500).send('Error creating the new competition');
    });

    res.status(200).json({'new-competition':newComp});
})

router.put('/:festid/update-competition/:compid',
    // body("startTime","Enter a valid start time.").custom(({req})=> req.body.startTime > Date.now()),
    // body("startdate","Enter a valid end time.").custom(({req})=> req.body.endTime >= req.body.startTime),
    // body("sdate","Enter a valid start date.").custom(({req})=> req.body.startdate > Date.now()),
    // body("fee","Round number should be greater than or equal to 0").isFloat({min : 0}),
    validateUser,async(req,res)=> {

        let errors = validationResult(req);

        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }


    let updates = req.body;
    let updateData = {};

    if(updates.comp_type) {
        updateData.comp_type = updates.comp_type
    }

    if(updates.comp_name) {
        updateData.comp_name = updates.comp_name
    }

    if(updates.startTime) {
        updateData.startTime = updates.startTime
    }
    
    if(updates.endTime) {
        updateData.endTime = updates.endTime
    }

    if(updates.description) {
        updateData.description = updates.description
    }

    if(updates.date) {
        updateData.date = updates.date
    }

    if(updates.venue) {
        updateData.venue = updates.venue
    }

    if(updates.fee) {
        updateData.fee = updates.fee
    }

    let updatedComp = await Competitions.findOneAndUpdate({fest_id: req.params.festid, _id: req.params.compid},{$set : updateData}, { new: true }).catch(err => {
        return res.status(500).send('Error updating the competition');
    });

    console.log(updatedComp)

    res.status(200).json({'updated status':updatedComp});
});

router.delete('/:festid/delete-competition/:compid',validateUser,async(req,res)=> {
    let deletedRecord = await Competitions.findOneAndDelete({fest_id: req.params.festid, _id: req.params.compid}).catch(err=> {
        return res.status(500).send('Error deleting the competition');
    })

    res.status(200).json({'deleted-record':deletedRecord});
});

router.post('/register-event/:compid',validateUser,async(req,res) => {
    let record = await Users.findByIdAndUpdate(req.session.user_id,{$push : {registered_events : req.params.compid}}, { new: true}).catch(err => {
        return res.status(500).json({error : 'Unable to register for the event at the moment'});
    });

    res.status(200).json({'Updated Registered Events' : record});
});

module.exports = router;