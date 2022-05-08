let express = require('express');
let router = express.Router();
const { validationResult , body } = require("express-validator");
const validateUser = require('../middlewares/validateUser')
let Competitor = require('../models/competitor');
let Results = require('../models/results')

router.get("/r",validateUser,async(req,res) => {
    res.send("Got it")
});

router.get("/:festid/:eventid/checkstatus",validateUser,async (req, res) => {
    let findresult = await Results.findOne({ event_id: req.params.eventid })

    if(findresult)
    {
        return res.status(200).json({"declared":true})
    }
    else
    {
        return res.status(200).json({"declared":false})
    }
})

router.get("/:eventid",validateUser,async(req,res)=>{
    let findresult = await Results.findOne({ event_id: req.params.eventid })
    if(findresult) {
        res.send(200).json({result:findresult.winners})
    }
})




module.exports = router;