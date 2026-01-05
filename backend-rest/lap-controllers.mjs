// vazqueem - Emmanuel Vazquez

import 'dotenv/config';
import express from 'express';
import asyncHandler from 'express-async-handler';
import * as laps from './lap-models.mjs';

const app = express();
app.use(express.json())

const PORT = process.env.PORT;

// Validation
function isBodyValid(userId, date, weightAmLb, steps, workout, calories, proteinG, sleepHours, adherence){
    if (userId === undefined || date === undefined || weightAmLb === undefined|| 
        steps === undefined || workout === undefined || calories === undefined ||
        proteinG === undefined || sleepHours === undefined || adherence === undefined
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
    const adherence = req.body.adherence
    const notes = req.body.notes

    if (!isBodyValid(userId, date, weightAmLb, steps, workout, calories, proteinG, sleepHours, adherence)){
        return res.status(400).json({Error: 'Invalid request'})
    }
    
    res.status(201).send(await laps.createLap(userId, date, weightAmLb, steps, workout, calories, proteinG, sleepHours, adherence, notes))
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
    const adherence = req.body.adherence
    const notes = req.body.notes
    const updateObject = {}

    if (!isBodyValid(userId, date, weightAmLb, steps, workout, calories, proteinG, sleepHours, adherence)){
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
    if (adherence !== undefined){
        updateObject.adherence = adherence
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


app.listen(PORT, async () => {
    await laps.connect(false)
    console.log(`Project F8 backend running on port ${PORT}`);
});
