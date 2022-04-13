const Users = require('../models/users');
const Scheduler = require('../models/scheduler')

let registerAll = async(festid,eventid) => {
    let allusers = await Users.find({},{_id:1}).catch(err => {
        return res.status(400).send('cannot fetch all the users');
      })
      
      allusers.map(async(userid) => {
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

module.exports = registerAll;