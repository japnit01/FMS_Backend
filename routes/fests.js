const express = require("express");
const router = express.Router();
const { body, validationResult } = require('express-validator')
const Fest = require('../models/fest')
let Competitions = require('../models/competition');

router.get('/fetchfest',async (req,res)=>{
    const fests = await Fest.find();
    res.json(fests);
});



router.post('/addfest',async (req,res)=>{
    const {title,description,organisation,startdate,enddate,city,state} = req.body;
    
    const fest = new Fest({title,description,organisation,startdate,enddate,city,state});
    const savedfest = await fest.save();

    res.json(savedfest);
});

router.put("/updatefest/:id",async(req,res)=>{
    const {title,description,organisation,startdate,enddate,city,state} = req.body;
    const newfest = {}
    
    if(name)
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

router.delete('/deletefest/:id',async(req,res)=>{
    let fest = await Fest.findById(req.params.id);
    if (!fest) {
        res.status(404).send("Not Found");
    }

    fest = await Fest.findByIdAndDelete(req.params.id)
    res.json({ "Success": "Note has been deleted", fest: fest});
});

module.exports = router;
