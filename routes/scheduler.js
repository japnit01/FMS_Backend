let express = require('express');
let Scheduler = require('../models/scheduler');
let Events = require('../models/events');
let router = express.Router();
let validateUser = require('../middlewares/validateUser');

router.get('/getSchedule',validateUser,async(req, res,)=> {

    let userSchedule = await Scheduler.find({user_id : req.user}).catch(err => {
        return res.status(500).json({error : err});
    });

    res.status(200).json(userSchedule);
});

router.post('/addToSchedule/:festid/:eventid',validateUser,async(req,res)=> {

    let event = new Scheduler({user_id:req.user, festid:req.params.festid, eventid : req.params.eventid});
    event.save();
    //notification part remaining
    res.status(200).json({"Added to schedule" : event});
});

router.delete('/deleteFromSchedule/:eventid',validateUser,async(req, res)=> {

    let event = await Scheduler.findOneAndDelete({user_id : req.user, event_id : req.params.eventid}).catch(err=> {
        return res.status(500).json({error : err});
    });

    res.status(200).json({'event deleted': event});
});

router.post('/register-event/:festid/:eventid',validateUser,async(req,res) => {
    
    let event = await Scheduler.findOne({user_id : req.user}).catch(err => {
        return res.status(400).send('Cannot find user');
    });

    if(!event) {
        event = new Scheduler({user_id : req.user, events : [{event_id: req.params.eventid, isRegistered : true}], fest_id: req.params.festid});
        event.save();
    } else {
        event = await Scheduler.findOneAndUpdate(event, {$push : {events : {event_id: req.params.eventid, isRegistered : true}}},{new : true}).catch(err => {
            return res.status(400).json({'error':err});
        });
    }

    res.status(200).json({'Updated Registered Events' : event});
});

router.post('/unregister-event/:festid',validateUser,async(req, res)=> {
    let record = await Users.findOneAndDelete({user_id : req.user, eventid : req.params.eventid}).catch(err => {
        return res.status(500).json({error : 'Unable to register for the event at the moment'});
    });

    res.status(200).json({'Updated Registered Events' : record});
});

module.exports = router;
