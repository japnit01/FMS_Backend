let express = require('express');
let session = require('express-session');
let Scheduler = require('../models/scheduler');
let Competitions = require('../models/competition');
let requireLogin = require('../middlewares/requireLogin');
let router = express.Router();

router.get('/getSchedule',requireLogin,async(req, res,)=> {
    console.log(req.session.user_id)
    let userSchedule = await Scheduler.findOne({user_id : req.session.user_id}).catch(err => {
        return res.status(500).json({'error':error});
    });
    let schedule = [];
    let compList = userSchedule.comp_list;

    for(let comp_id in compList) {
        let event = await Competitions.findOne({_id : compList[comp_id]}).catch(err => {
            return res.status(500).json({'error':error});
        });
        schedule.push(event);
        console.log(schedule)
    }
    
    console.log(schedule)

    res.status(200).json({'User-Schedule' : schedule});
});

router.post('/addToSchedule/:compid',async(req,res)=> {

    let userSchedule = await Scheduler.findOneAndUpdate({user_id : req.session.user_id},(!comp_list.includes(req.params.compid)) ? { $push : {comp_list : req.params.compid}} : {},{ new: true}).catch(err => {
        return res.status(500).json({'error':error});
    });
    //notification part remaining
    res.status(200).json({"Updated Schedule" : userSchedule});
});

module.exports = router;
