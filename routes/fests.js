const express = require("express");
const router = express.Router();
let validateUser = require('../middlewares/validateUser')
const Fest = require('../models/fests')
const Users = require("../models/users");
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
// body("name","The length of Title should be between 3 and 30").isLength({min: 3, max: 30}),
// body("startdate","Enter a valid start date.").custom(({req})=> req.body.startdate >= Date.now()),
// body("enddate","Enter a valid end date.").custom(({req})=> req.body.enddate >= req.body.startdate),
async (req,res)=>{

    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors)
      return res.status(400).json({ errors: errors.array() });
    }

    const {name,description,organisation,startdate,enddate,city,state} = req.body;
    
    const fest = new Fest({user: req.user,name,description,organisation,startdate,enddate,city,state});
    const savedfest = await fest.save();

    console.log(savedfest);

    res.json(savedfest);
});

router.put("/updatefest/:id",validateUser,  
// body("title","The length of Title should be between 3 and 30").isLength({min: 3, max: 30}),
// body("sdate","Enter a valid start date.").custom(({req})=> req.body.sdate > Date.now()),
// body("edate","Enter a valid end date.").custom(({req})=> req.body.edate >= req.body.sdate),
async(req,res)=>{


    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {name,description,organisation,startdate,enddate,city,state} = req.body;
    const newfest = {}

    if(name)
    {
        newfest.name = name;
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
    res.json({ "Success": "Fest has been deleted", fest: fest});
});

router.post('/addcoordinator/:id',validateUser, async(req,res)=>{
    const {coordinators} = req.body;

    let fest = await Fest.findById(req.params.id);
    if(!fest)
    {
        return res.status(404).send("Not found");
    }

    let user = await Users.find({email: {$in: coordinators}},{_id:1});
    let email = await Users.find({email: {$in: coordinators}},{_id:0,email:1});
    console.log(user)
    if(!user)
    {
        return res.status(404).send("Not found user");
    }

    fest = await Fest.updateOne({_id:req.params.id},{$addToSet: {coordinators: {$each: user}}});
    res.json({ "Success":"Coordinator added", "coordinators": coordinators,"email":email});
});

module.exports = router;
