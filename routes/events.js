let express = require('express');
let router = express.Router();
let {body, validationResult} = require('express-validator');
let Events = require('../models/events');
let Results = require('../models/results')
let validateUser = require('../middlewares/validateUser')
let shuffle = require('../operations/shuffleRecords');

router.get('/:festid/fetchevents',validateUser,async(req,res)=> {
    let events = await Events.find({fest_id: req.params.festid});
    res.status(200).json(events);
})

router.post('/:festid/add-event',validateUser,async(req,res)=> {
    let eventDetails = req.body;
    console.log(eventDetails);
    eventDetails.fest_id = req.params.festid;

    // let newComp = await Competitions.create(compDetails).catch(err=> {
    //     // return res.status(500).json({'msg':err});
    // });

    let newEvent = await new Events(eventDetails);
    newEvent.save();

    res.status(200).send(newEvent);
})

router.put('/:festid/update-event/:eventid',validateUser,async(req,res)=> {
    let updates = req.body;
    let updateData = {};

    if(updates.type) {
        updateData.type = updates.type
    }

    if(updates.name) {
        updateData.name = updates.name
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

    let updatedEvent = await Events.findOneAndUpdate({fest_id: req.params.festid, _id: req.params.eventid},{$set : updateData}, { new: true }).catch(err => {
        return res.status(500).send('Error updating the event');
    });

    console.log(updatedEvent)

    res.status(200).json({'updated status':updatedEvent});
});

router.delete('/:festid/delete-event/:eventid',validateUser,async(req,res)=> {
    let deletedRecord = await Events.findOneAndDelete({fest_id: req.params.festid, _id: req.params.eventid}).catch(err=> {
        return res.status(500).send('Error deleting the event');
    })

    res.status(200).json({'deleted-record':deletedRecord});
});

router.get('/:festid/:eventid/event-status',async(req,res)=> {
    let results = await Results.findOne({fest_id: req.params.festid, event_id: req.params.eventid}).catch(err=> {
        return res.status(404).send("Competition not found");
    });

    if(results.length === 0) {
        let allCompetitors = await Users.find({event_id: req.params.eventid}).catch(function(err) {
            return res.status(400).json({error: err.array()});
        })

        let roundDetails = {
            fest_id: req.params.festid, 
            event_id: req.params.eventid, 
            roundNo: results.count()+1, 
            competitors: []
        }

        // shuffling the competitors
        shuffle(allCompetitors);
        roundDetails.competitors = allCompetitors;

        let prevRound = new Results(roundDetails);
        let saveRound = await prevRound.save();

        console.log(saveRound);
    }

    let currentRound = await Results.find().sort({_id:-1}).limit(1).catch(err => {
        return res.status(400).send('error loading the current round');
    })

    res.status(200).json({start: true, currentRound: currentRound});
});

router.post('/:festid/:eventid/nextRound',async(req,res)=> {

    let results = await Results.find({fest_id: req.params.festid, event_id: req.params.eventid, }).catch(err => {
        return res.status(400).send("Can't fetch results of this competition");
    });

    let roundDetails = {
        fest_id: req.params.festid, 
        event_id: req.params.eventid, 
        roundNo: results.count()+1, 
        winners: req.body,
        competitors: []
    }

    let allCompetitors = [];
    previousRoundResults = await Results.find().sort({_id:-1}).limit(1).catch(function(err) {
        return res.status(400).json({error: err.array()})
    });

    allCompetitors = previousRoundResults.winners;

    // shuffling the competitors
    shuffle(allCompetitors);
    roundDetails.competitors = allCompetitors;

    let prevRound = new Results(roundDetails);
    let saveRound = await prevRound.save();

    console.log(saveRound);

    res.status(200).json({prevRound: saveRound});
});

// /nextRound, /viewCompetition

module.exports = router;