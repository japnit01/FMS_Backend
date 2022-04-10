let express = require('express');
let router = express.Router();
let {body, validationResult} = require('express-validator');
let Events = require('../models/events');
let Results = require('../models/results')
let Users = require('../models/users')
let validateUser = require('../middlewares/validateUser')

router.get('/:festid/fetchevents',validateUser,async(req,res)=> {
    let events = await Events.find({fest_id: req.params.festid});
    res.status(200).json(events);
})

router.post('/:festid/add-event',validateUser,async(req,res)=> {
    let eventDetails = req.body;
    // console.log(eventDetails);
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



module.exports = router;