let express = require('express');
let Scheduler = require('../models/scheduler');
let router = express.Router();
let validateUser = require('../middlewares/validateUser');
const Fest = require('../models/fests');
let Events = require('../models/events');

const createjson = async (userSchedule) => {
    let newjson = [];
    for (let i = 0; i < userSchedule.length; i++) {
        const fest = await Fest.findOne({ _id: userSchedule[i].fest_id },{coordinators:0,_id:0,user:0,timestamp:0});
        let eventids = userSchedule[i].events.map(event => event.event_id)
        // console.log('eventids: ',eventids)
        
        const event = await Events.find({_id:{$in: eventids}},{_id:0,fest_id:0}).catch(err => {
            return res.status(400).send('not able to fetch the events with these ids')
        });
        newjson.push({fest,event});
    }
    // console.log('newjson: ',newjson)
    return newjson;
}

router.get('/getSchedule', validateUser, async (req, res,) => {

    let userSchedule = await Scheduler.find({ user_id: req.user },{'event.isRegistered':0}).catch(err => {
        return res.status(500).json({ error: err });
    });

    // console.log(userSchedule)
    const contentjson = await createjson(userSchedule);
    console.log('contentjson: ',contentjson);
    res.status(200).send(contentjson);
});

router.post('/addToSchedule/:festid/:eventid', validateUser, async (req, res) => {

    let event = await Scheduler.findOne({ user_id: req.user, fest_id: req.params.festid }).catch(err => {
        return res.status(400).send('Cannot find user');
    });

    if (!event) {
        event = new Scheduler({ user_id: req.user, events: [{ event_id: req.params.eventid, isRegistered: false }], fest_id: req.params.festid });
        event.save();
    }
    else {
        let savedevent = await Scheduler.findOne({ user_id: req.user, fest_id: req.params.festid, 'events.event_id': req.params.eventid })
        console.log(savedevent, req.params.eventid)
        if (savedevent) {
            return res.status(409).json({ error: "Event exist in schedule" });
        }

        event = await Scheduler.updateOne({ user_id: req.user }, { $push: { events: { event_id: req.params.eventid, isRegistered: false } } }).catch(err => {
            return res.status(400).json({ 'error': err });
        });
    }
    //notification part remaining
    res.status(200).json({ "Added to schedule": event });
});

router.delete('/deleteFromSchedule/:eventid', validateUser, async (req, res) => {

    let event = await Scheduler.updateOne({ user_id: req.user }, { $pull: { 'events.event_id': req.params.eventid } }).catch(err => {
        return res.status(500).json({ error: 'Unable to register for the event at the moment' });
    });

    res.status(200).json({ 'event deleted': event });
});

router.post('/register-event/:festid/:eventid', validateUser, async (req, res) => {

    let event = await Scheduler.findOne({ user_id: req.user, fest_id: req.params.festid }).catch(err => {
        return res.status(400).send('Cannot find user');
    });

    if (!event) {
        event = new Scheduler({ user_id: req.user, events: [{ event_id: req.params.eventid, isRegistered: true }], fest_id: req.params.festid });
        event.save();
    }
    else {
        let savedevent = await Scheduler.findOne({ user_id: req.user, fest_id: req.params.festid, 'events.event_id': req.params.eventid })

        if (savedevent) {
            savedevent = await Scheduler.updateOne({ user_id: req.user, 'events.event_id': req.params.eventid }, { $set: { 'events.$.isRegistered': true } })
            return res.status(200).json({ 'Updated Registered Events': savedevent });
        }

        event = await Scheduler.updateOne({ user_id: req.user }, { $push: { events: { event_id: req.params.eventid, isRegistered: true } } }).catch(err => {
            return res.status(400).json({ 'error': err });
        });
    }

    res.status(200).json({ 'Updated Registered Events': event });
});

router.post('/unregister-event/:eventid', validateUser, async (req, res) => {

    let record = await Scheduler.updateOne({ user_id: req.user }, { $pull: { events: { event_id: req.params.eventid } } }).catch(err => {
        return res.status(500).json({ error: 'Unable to register for the event at the moment' });
    });



    res.status(200).json({ 'Updated Registered Events': record });
});

module.exports = router;
