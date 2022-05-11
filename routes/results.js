let express = require('express');
let router = express.Router();
const { validationResult , body } = require("express-validator");
const validateUser = require('../middlewares/validateUser')
let Competitor = require('../models/competitor');
let Results = require('../models/results')

router.get('/r',(req,res)=>{
    res.send("hi")
})


router.get("/:festid/:eventid",validateUser,async(req,res)=>{
    let findresult = await Results.findOne({ event_id: req.params.eventid })

    if(findresult) {
        return res.status(200).json({result:findresult.winners})
    }
   return res.status(404).send("Result not declared");
})


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




module.exports = router;