require('dotenv').config();
const mongoose=require('mongoose');
const models=require('./models');
const seed=require('./seed-data');
(async()=>{if(!process.env.MONGODB_URI)throw new Error('Set MONGODB_URI to seed MongoDB.');await mongoose.connect(process.env.MONGODB_URI);for(const e of seed){let doc=await models.Event.findOne({title:e.title});if(!doc){const{ id,unavailableSeats,...data}=e;doc=await models.Event.create(data);}if(!await models.Seat.exists({eventId:doc._id})){await models.Seat.insertMany(Array.from({length:e.capacity},(_,i)=>{const label=`${String.fromCharCode(65+Math.floor(i/8))}${(i%8)+1}`;return{eventId:doc._id,label,section:['Orchestra','Mezzanine','Balcony'][Math.floor(i/16)],price:e.price+(i<8?25:0),state:(e.unavailableSeats||[]).includes(label)?'booked':'available'}}));}}console.log('Seed events and seats are ready.');await mongoose.disconnect();})().catch(e=>{console.error(e);process.exitCode=1});
