// Get the mongoose object
import mongoose from 'mongoose';
import 'dotenv/config';

// Initialize consts
const LAP_DB_NAME = 'project_f8';
const LAP_COLLECTION = 'laps';
const LAP_CLASS = 'Lap';

// Initialize undefined variables
let connection = undefined;
let Lap = undefined;


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
        // Create model
        Lap = createModel();
    } catch(err){
        console.log(err);
        throw Error(`Could not connect to MongoDB ${err.message}`)
    }
}

// Create connection
async function createConnection(){
    await mongoose.connect(process.env.MONGODB_CONNECT_STRING, 
        {dbName: LAP_DB_NAME});
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
        adherence: {type: Boolean, required: true, default: true},
        notes: {type: String}
    });

    lapSchema.index({ userId: 1, date: 1 }, { unique: true });

    return mongoose.model(LAP_CLASS, lapSchema);
}

// Create lap async function
async function createLap(userId, date, weightAmLb, steps, workout, calories, proteinG, sleepHours, adherence, notes){
    const lap = new Lap({userId: userId, date: date, weightAmLb: weightAmLb, steps: steps, workout: workout, calories: calories, proteinG: proteinG, sleepHours: sleepHours, adherence: adherence, notes: notes});
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

// Export functions
export { connect, createLap, findLaps, findLapsById, findLapUpdate, deleteLaps, deleteLapsById };