// vazqueem - Emmanuel Vazquez

import 'dotenv/config';
import express from 'express';
import asyncHandler from 'express-async-handler';
import * as laps from './lap-models.mjs';
import { localMidnight, mondayStartLocal, TZ } from "./utils/dates.mjs";

const app = express();
app.use(express.json())

const PORT = process.env.PORT;


// Validation
function isBodyValid(userId, date, weightAmLb, steps, workout, calories, proteinG, sleepHours){
    if (userId === undefined || date === undefined || weightAmLb === undefined|| 
        steps === undefined || workout === undefined || calories === undefined ||
        proteinG === undefined || sleepHours === undefined
        ) return false;
    if (!Number.isFinite(weightAmLb) || weightAmLb < 0) return false;
    if (!Number.isInteger(steps) || steps <= 0) return false;
    if (!['lift','walk','both','rest'].includes(workout)) return false;
    if (!Number.isInteger(calories) || calories <= 0) return false;
    if (!Number.isInteger(proteinG) || proteinG <= 0) return false;
    if (!Number.isFinite(sleepHours) || sleepHours <= 0) return false; 
    if (date !== undefined){
        const time = Date.parse(date);
        if (Number.isNaN(time)) return false;
    }
    return true;
}


//POST /laps
app.post('/laps', asyncHandler(async (req, res) =>{
    const userId = req.body.userId
    const date = req.body.date
    const weightAmLb = req.body.weightAmLb
    const steps = req.body.steps
    const workout = req.body.workout
    const calories = req.body.calories
    const proteinG = req.body.proteinG
    const sleepHours = req.body.sleepHours
    const notes = req.body.notes

    if (!isBodyValid(userId, date, weightAmLb, steps, workout, calories, proteinG, sleepHours)){
        return res.status(400).json({Error: 'Invalid request'})
    }
    
    res.status(201).send(await laps.createLap(userId, date, weightAmLb, steps, workout, calories, proteinG, sleepHours, notes))
}))


//GET /laps
app.get('/laps', asyncHandler(async (req, res) => {
    const lap = req.query

    res.send(await laps.findLaps(lap))
}))


//GET /laps/:_id
app.get('/laps/:_id', asyncHandler(async (req, res) => {
    const id = req.params._id
    const result = await laps.findLapsById(id)

    if (result !== null){
        res.send(result)
    } else {
        res.status(404).send({"Error": "Not found"})
    }
}))


//PUT /laps/:_id
app.put('/laps/:_id', asyncHandler(async (req, res) => {
    const id = req.params._id
    const userId = req.body.userId
    const date = req.body.date
    const weightAmLb = req.body.weightAmLb
    const steps = req.body.steps
    const workout = req.body.workout
    const calories = req.body.calories
    const proteinG = req.body.proteinG
    const sleepHours = req.body.sleepHours
    const notes = req.body.notes
    const updateObject = {}

    if (!isBodyValid(userId, date, weightAmLb, steps, workout, calories, proteinG, sleepHours)){
        return res.status(400).json({Error: 'Invalid request'})
    }
    if (userId !== undefined){
        updateObject.userId = userId
    }
    if (date !== undefined){
        updateObject.date = date
    }
    if (weightAmLb !== undefined){
        updateObject.weightAmLb = weightAmLb
    }
    if (steps !== undefined){
        updateObject.steps = steps
    }
    if (workout !== undefined){
        updateObject.workout = workout
    }
    if (calories !== undefined){
        updateObject.calories = calories
    }
    if (proteinG !== undefined){
        updateObject.proteinG = proteinG
    }
    if (sleepHours !== undefined){
        updateObject.sleepHours = sleepHours
    }
    if (notes !== undefined){
        updateObject.notes = notes
    }
    const result = await laps.findLapUpdate(id, updateObject);
    if (result !== null){
        res.send(result)
    } else {
        res.status(404).send({"Error": "Not found"})
    }
}))


//DELETE /laps/:_id
app.delete('/laps/:_id', asyncHandler(async (req, res) =>{
    const id = req.params._id
    const result = await laps.deleteLapsById(id)

    if (result !== null){
        res.status(204).send()
    } else {
        res.status(404).send({"Error": "Not found"})
    }
}))


//POST /pit-stops/preview
app.post("/pit-stops/preview", asyncHandler(async (req, res) => {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "userId is required" });
  
    const weekStart = mondayStartLocal(new Date());
    const now = new Date(); // end exclusive
  
    const avgWeightLb = await laps.computeAvgWeightForRange(userId, weekStart, now);
    if (avgWeightLb == null) return res.status(404).json({ error: "No laps found for current week." });
  
    res.status(200).json({ userId, weekStart, avgWeightLb, isFinal: false });
  }));
  
//PUT /pit-stops/finalize
app.put("/pit-stops/finalize", asyncHandler(async (req, res) => {
    const { userId, weekStartLocal } = req.body;
    if (!userId || !weekStartLocal) {
      return res.status(400).json({ error: "userId and weekStartLocal (YYYY-MM-DD) required" });
    }
  
    const weekStart = localMidnight(weekStartLocal);
    const weekEndExclusive = new Date(weekStart);
    weekEndExclusive.setDate(weekEndExclusive.getDate() + 7);
  
    const avgWeightLb = await laps.computeAvgWeightForRange(userId, weekStart, weekEndExclusive);
    if (avgWeightLb == null) return res.status(404).json({ error: "No laps found for that week." });
  
    const saved = await laps.finalizePitStop(userId, weekStart, avgWeightLb);
    res.status(200).json(saved);
  }));

// GET Pit Stops
app.get("/pit-stops", asyncHandler(async (req, res) => {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: "userId is required" });
  
    const results = await laps.findPitStops({ userId });
    res.status(200).json(results);
  }));
  

app.listen(PORT, async () => {
    await laps.connect(false)
    console.log(`Project F8 backend running on port ${PORT}`);
});
