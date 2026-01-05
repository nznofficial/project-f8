// Get the mongoose object
import mongoose, { version } from 'mongoose';
import 'dotenv/config';

// Initialize consts
const F8_DB_NAME = 'project_f8';
const LAP_COLLECTION = 'laps';
const LAP_CLASS = 'Lap';
const PITSTOP_COLLECTION = "pit_stops";
const PITSTOP_CLASS = "PitStop";

// Initialize undefined variables
let connection = undefined;
let Lap = undefined;
let PitStop = undefined;


/**
 * This function connects to the MongoDB server.
 */
async function connect(dropCollection){
    try{
        connection = await createConnection();
        console.log("Successfully connected to MongoDB using Mongoose!");
        if(dropCollection){
            await connection.db.dropCollection(LAP_COLLECTION);
        }
        // Create models
        Lap = createModel();
        PitStop = createPitStopModel();
    } catch(err){
        console.log(err);
        throw Error(`Could not connect to MongoDB ${err.message}`)
    }
}

// Create connection
async function createConnection(){
    await mongoose.connect(process.env.MONGODB_CONNECT_STRING, 
        {dbName: F8_DB_NAME});
    return mongoose.connection;
}

// Create model function
function createModel(){
    // Define the schema
    const lapSchema = mongoose.Schema({
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        date: {type: Date, required: true},
        weightAmLb: {type: Number, required: true, min: 50, max: 500},
        steps: {type: Number, default: 0, min: 0},
        workout: {type: String, required: true, enum: ['lift', 'walk', 'both', 'rest']},
        calories: {type: Number, min: 0},
        proteinG: {type: Number, default: 0, min: 0},
        sleepHours: {type: Number, min: 0, max: 24},
        notes: {type: String}
    },
    { versionKey: false});

    lapSchema.index({ userId: 1, date: 1 }, { unique: true });

    return mongoose.model(LAP_CLASS, lapSchema);
}

//Create PitStop model function
function createPitStopModel(){
    const pitStopSchema = mongoose.Schema({
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
        weekStart: { type: Date, required: true},
        avgWeightLb: { type: Number, required: true},
        weightChangeLb: { type: Number, required: true},
        isFinal: { type: Boolean, required: true, default: false }
    },
    { versionKey: false});

    pitStopSchema.index({userId: 1, weekStart: 1}, { unique: true });

    return mongoose.model(PITSTOP_CLASS, pitStopSchema);
}

// Create lap async function
async function createLap(userId, date, weightAmLb, steps, workout, calories, proteinG, sleepHours, notes){
    const lap = new Lap({userId: userId, date: date, weightAmLb: weightAmLb, steps: steps, workout: workout, calories: calories, proteinG: proteinG, sleepHours: sleepHours, notes: notes});
    return await lap.save();
}

// Find laps async function
async function findLaps(filter){
    const lapArray = await Lap.find(filter).exec();
    return lapArray;
}

// Find laps by Id async function
async function findLapsById(id){
    const query = Lap.findById(id);
    return await query.exec();
}

// Find laps to update async function
async function findLapUpdate(id, bodyObject){
    const query = Lap.findByIdAndUpdate(id, bodyObject, {new: true})
    return await query.exec();
}

// Delete laps async function
async function deleteLaps(conditions){
    const query = Lap.deleteMany(conditions)
    return await query.exec();
}

// Delete laps by Id async function
async function deleteLapsById(id){
    const query = Lap.findByIdAndDelete(id)
    return await query.exec();
}

// Weekly Logic
async function computeAvgWeightForRange(userId, startDate, endDateExclusive) {
    const pipeline = [
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          date: { $gte: startDate, $lt: endDateExclusive }
        }
      },
      { $group: { _id: null, avgWeightLb: { $avg: "$weightAmLb" } } }
    ];
  
    const result = await Lap.aggregate(pipeline).exec();
    if (!result.length || result[0].avgWeightLb == null) return null;
    return Number(result[0].avgWeightLb.toFixed(2));
  }
  
async function finalizePitStop(userId, weekStart, avgWeightLb) {
    // Find previous finalized week
    const prevWeekStart = new Date(weekStart);
    prevWeekStart.setDate(prevWeekStart.getDate() - 7);
  
    const prev = await PitStop.findOne({
      userId,
      weekStart: prevWeekStart,
      isFinal: true
    }).exec();
  
    const weightChangeLb = prev
      ? Number((avgWeightLb - prev.avgWeightLb).toFixed(2))
      : 0;
  
    return await PitStop.findOneAndUpdate(
      { userId, weekStart },
      {
        userId,
        weekStart,
        avgWeightLb,
        weightChangeLb,
        isFinal: true
      },
      { upsert: true, new: true, runValidators: true }
    ).exec();
}
  

// find Pit Stops
async function findPitStops(filter) {
    return await PitStop.find(filter).sort({ weekStart: 1 }).exec();
  }
  export { findPitStops };
  

// Export functions
export { connect, createLap, findLaps, findLapsById, findLapUpdate, deleteLaps, deleteLapsById, computeAvgWeightForRange, finalizePitStop };