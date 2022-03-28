let express = require('express');
let router = express.Router();
let {body, validationResult} = require('express-validator');
let Competitions = require('../models/competition');
let Users = require('../models/user');
let Results = require('../models/results')
let validateUser = require('../middlewares/validateUser')

router.get('/:festid/getCompetitions',validateUser,async(req,res)=> {
    let allCompetitions = await Competitions.find({fest_id: req.params.festid});
    res.status(200).json({competitions : allCompetitions});
})

router.post('/:festid/add-competition',validateUser,async(req,res)=> {
    let compDetails = req.body;
    compDetails.fest_id = req.params.festid;

    // let newComp = await Competitions.create(compDetails).catch(err=> {
    //     // return res.status(500).json({'msg':err});
    // });

    let newComp = await new Competitions(compDetails);
    newComp.save();

    res.status(200).send(newComp);
})

router.put('/:festid/update-competition/:compid',validateUser,async(req,res)=> {
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

    if(updates.guests) {
        updateData.guests = updates.guests
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

router.get('/:festid/:compid/competition-status',async(req,res)=> {
    let results = await Results.findOne({fest_id: req.params.festid, _id: req.params.compid}).catch(err=> {
        return res.status(404).send("Competition not found");
    });

    if(results.length === 0) {
        return res.json({start: false, results: []});
    }

    res.status(200).json({start: true, results: results});
});

router.post('/:festid/:compid/nextRound',async(req,res)=> {
    let roundDetails = {
        fest_id: req.params.festid, 
        comp_id: req.params.compid, 
        roundNo: results.count()+1, 
        // competitors: 
    }

    let prevRound = new Results(roundDetails);
    let saveRound = await prevRound.save();

    console.log(saveRound);

    res.status(200).json({prevRound: saveRound});
});

// /nextRound, /viewCompetition

module.exports = router;