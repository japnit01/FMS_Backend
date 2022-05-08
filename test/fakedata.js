let express = require('express');
let router = express.Router();
let Users = require("../models/users");
const { faker } = require('@faker-js/faker');
const Scheduler = require('../models/scheduler')

//Sarthak
const festid = '627791bb5c1b901230bfbce2';
const eventid = '6277b8485c1b901230bfbd76'; 

const password = "password";
const count = 4;

function generateRandom(min = 18, max = 24) {
    let difference = max - min;
    let rand = Math.random();
    rand = Math.floor(rand * difference);
    rand = rand + min;
    return rand;
}

let registerAll = async () => {
    let allusers = await Users.find({}, { _id: 1 }).catch(err => {
        return res.status(400).send('cannot fetch all the users');
    })

    allusers.map(async (userid) => {
        let event = await Scheduler.findOne({ user_id: userid, fest_id: festid }).catch(err => {
            return res.status(400).send('Cannot find user');
        });

        if (!event) {
            event = new Scheduler({ user_id: userid, events: [{ event_id: eventid, isRegistered: true }], fest_id: festid });
            event.save();
        }
        else {
            event = await Scheduler.updateOne({ user_id: userid }, { $push: { events: { event_id: eventid, isRegistered: true } } }).catch(err => {
                return res.status(400).json({ 'error': err });
            });
        }
    });
}

router.get("/fakeuser", async (req, res) => {
    faker.seed(123)
    let fakeusers = [];
    for (let i = 0; i < count; i++) {
        const name = faker.name.findName();
        const email = faker.internet.email();
        const college = faker.company.companyName();
        const age = generateRandom();
        fakeusers.push({ name, email, college, age, password })
    }

    let newUser = await Users.insertMany(fakeusers);
    res.json(newUser);
})

router.get("/registeralluser", async (req, res) => {
    res.json(registerAll())
});

router.delete("/deletefakeuser", async (req, res) => {
    let user = await Users.deleteMany({ name: { $nin: ["Sarthak", "Japnit Singh", "Gurtej Singh"] } })
    res.json(user);
});


module.exports = router;
