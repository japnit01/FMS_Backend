let express = require('express');
let Scheduler = require('../models/scheduler');
let Events = require('../models/events');
let router = express.Router();
let validateUser = require('../middlewares/validateUser');

router.get('/getSchedule',validateUser,async(req, res,)=> {

    let userSchedule = await Scheduler.find({user_id : req.user}).catch(err => {
        return res.status(500).json({error : err});
    });

    res.status(200).json({'User-Schedule' : userSchedule});
});

router.post('/addToSchedule/:eventid',validateUser,async(req,res)=> {

    let event = new Scheduler({user_id:req.user, event_id : req.params.eventid});
    event.save();
    //notification part remaining
    res.status(200).json({"Added to schedule" : event});
});

router.post('/deleteFromSchedule/:eventid',validateUser,async(req, res)=> {

    let event = await Scheduler.findOneAndDelete({user_id : req.user, event_id : req.params.eventid}).catch(err=> {
        return res.status(500).json({error : err});
    });

    res.status(200).json({'event deleted': event});
});

router.post('/register-event/:eventid',validateUser,async(req,res) => {
    
    let event = await Scheduler.findOne({user_id : req.user}).catch(err => {
        return res.status(400).send('Cannot find user');
    });

    if(!event) {
        event = new Scheduler({user_id : req.user, event_id : req.params.eventid, isRegistered : true});
        event.save();
    } else {
        event = await Scheduler.findOneAndUpdate(event, {$set : {isRegistered : true}},{new : true}).catch(err => {
            return res.status(400).json({'error':err});
        });
    }

    res.status(200).json({'Updated Registered Events' : event});
});

router.post('/unregister-event/:eventid',validateUser,async(req, res)=> {
    let record = await Users.findOneAndDelete({user_id : req.user, event_id : req.params.eventid}).catch(err => {
        return res.status(500).json({error : 'Unable to register for the event at the moment'});
    });

    res.status(200).json({'Updated Registered Events' : record});
});

module.exports = router;