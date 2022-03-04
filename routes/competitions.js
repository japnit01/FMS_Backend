let express = require('express');
let router = express.Router();
let {body, validationResult} = require('express-validator');
let Competitions = require('../models/competition');
let Users = require('../models/user');
let requireLogin = require('../middlewares/requireLogin');

router.get('/:festid/getCompetitions',async(req,res)=> {
    let allCompetitions = await Competitions.find({fest_id: req.params.festid});
    res.status(200).json({competitions : allCompetitions});
})

router.post('/:festid/add-competition',async(req,res)=> {
    let compDetails = req.body;
    compDetails.fest_id = req.params.festid;

    let newComp = new Competitions(compDetails);
    await newComp.save().catch(err => {
        return res.status(500).send('Error creating the new competition');
    });

    res.status(200).json({'new-competition':newComp});
})

router.put('/:festid/update-competition/:compid',async(req,res)=> {
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

router.delete('/:festid/delete-competition/:compid',async(req,res)=> {
    let deletedRecord = await Competitions.findOneAndDelete({fest_id: req.params.festid, _id: req.params.compid}).catch(err=> {
        return res.status(500).send('Error deleting the competition');
    })

    res.status(200).json({'deleted-record':deletedRecord});
});

router.post('/register-event/:compid',requireLogin,async(req,res) => {
    let record = await Users.findByIdAndUpdate(req.session.user_id,{$push : {registered_events : req.params.compid}}, { new: true}).catch(err => {
        return res.status(500).json({error : 'Unable to register for the event at the moment'});
    });

    res.status(200).json({'Updated Registered Events' : record});
});

module.exports = router;