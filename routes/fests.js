const express = require("express");
const router = express.Router();
let validateUser = require('../middlewares/validateUser')
const Fest = require('../models/fest')
let Competitions = require('../models/competition');
const { body, validationResult } = require("express-validator");

router.get('/fetchfest',validateUser,async (req,res)=>{
    const fests = await Fest.find({user: req.user});
    res.json(fests);
});

router.get('/fetchallfest',async(req,res)=>{
    const fests = await Fest.find({}).select("-user");
    res.json(fests)
});

router.post('/addfest',validateUser,
body("title","The length of Title should be between 3 and 30").isLength({min: 3, max: 30}),
body("sdate","Enter a valid start date.").custom(({req})=> req.body.sdate > Date.now()),
body("edate","Enter a valid end date.").custom(({req})=> req.body.edate >= req.body.sdate),
body("fee","Enter a valid fee.").custom(({req})=> req.body.fee >= 0),
async (req,res)=>{
    const {name,description,organisation,startdate,enddate,city,state} = req.body;
    
    const fest = new Fest({user: req.user,name,description,organisation,startdate,enddate,city,state});
    const savedfest = await fest.save();

    res.json(savedfest);
});

router.put("/updatefest/:id",validateUser,  
body("title","The length of Title should be between 3 and 30").isLength({min: 3, max: 30}),
body("sdate","Enter a valid start date.").custom(({req})=> req.body.sdate > Date.now()),
body("edate","Enter a valid end date.").custom(({req})=> req.body.edate >= req.body.sdate),
body("fee","Enter a valid fee.").custom(({req})=> req.body.fee >= 0),
async(req,res)=>{
    const {title,description,organisation,startdate,enddate,city,state} = req.body;
    const newfest = {}
    
    if(title)
    {
        newfest.title = title;
    }

    if(description)
    {
        newfest.description = description;
    }

    if(organisation)
    {
        newfest.organisation = organisation;
    }

    if(startdate)
    {
        newfest.startdate = startdate;
    }    

    if(enddate)
    {
        newfest.enddate = enddate;
    }

    if(city)
    {
        newfest.city = city;
    }

    if(state)
    {
        newfest.state = state;
    }

    let fest = await Fest.findById(req.params.id);

    if (!fest) {
        res.status(404).send("Not Found");
    }

    fest = await Fest.findByIdAndUpdate(req.params.id, { $set: newfest}, { new: true })
    res.json(fest);
});

router.delete('/deletefest/:id',validateUser,async(req,res)=>{
    let fest = await Fest.findById(req.params.id);
    if (!fest) {
        res.status(404).send("Not Found");
    }

    fest = await Fest.findByIdAndDelete(req.params.id)
    res.json({ "Success": "Note has been deleted", fest: fest});
});

module.exports = router;
