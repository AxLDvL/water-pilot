const express = require('express');
const router = express.Router();
const {authenticate} = require ('../controllers/UserController');
const {getSchedules,addSchedule, deleteSchedule} = require ('../controllers/ScheduleController');

router.route('/')
    .get(async (req,res) => {

        console.log(req.idSetting);

        try{
            const schedules = await getSchedules(req.idSetting);
            res.status(200).json(schedules)
        }catch(err){
            res.status(400).json({errorMsg:"Un problème est survenu lors de la récupération des plages horaires:"+err})
        }
    })
    .post (async (req,res) => {
        const {hourStart, hourEnd, days} = req.body;
        try{
            const schedule = await addSchedule(hourStart, hourEnd, days, req.idSetting);
            res.status(200).json(schedule)
        }catch (err){
            res.status(400).json({errorMsg:"Un problème est survenu lors de l'enregistrement des plages horaires:"+err})
        }
    })
router.route('/:idSchedule')
    .delete(async (req, res) => {
        req.idSchedule = parseInt(req.params.idSchedule) ;
        try {
            const deleteSc = await deleteSchedule (req.idSchedule);
            res.status(200).json(deleteSc)
        } catch (err){
            res.status(400).json({errorMsg:"Un problème est survenu lors de la suppression des plages horaires:"+err})
        }
    })
    .patch(async (req,res) => {
        req.idSchedule = parseInt(req.params.idSchedule) ;
        const {hourStart, hourEnd, days} = req.body;
        try{
            const patchSchedule = await updateSchedule(hourStart, hourEnd, days, req.idSchedule, req.idSetting, req.idValve, req.userId);
            res.status(200).json(patchSchedule)
        }catch(err){
            res.status(400).json({errorMsg:"Un problème est survenu lors de la modification de l'éléctrovalve:"+err})
        }
    })
module.exports=router;