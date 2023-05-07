const express = require('express');
const router = express.Router();
const {addValveSetting,getValveSetting,deleteValveSetting,updateValveSetting} = require ('../controllers/valveSettingController');
const {authenticate} = require ('../controllers/UserController');

router.route('/')
    .post(authenticate,async (req,res) => {
        const {rainThreshold, moistureThreshold, duration, isAutomatic} = req.body;
        if(rainThreshold && moistureThreshold && duration && isAutomatic){
            try{
                const addSetting = await addValveSetting(rainThreshold, moistureThreshold, duration, isAutomatic, req.idValve, req.userId);
                if (addSetting.errorMsg) throw new Error (addSetting.errorMsg);
                res.status(200).json(addSetting)
            }catch(err){
                res.status(400).json({errorMsg:err})
            }
        }else res.status(400).json({errorMsg:"tous les champs doivent être remplis: rainThreshold, moistureThreshold, duration, isAutomatic"})
    })
    
    .get(authenticate,async (req,res) => {
        try{
            const getSetting= await getValveSetting(req.idValve,req.userId);
            res.status(200).json(getSetting)
        }catch(err){
            res.status(400).json({errorMsg:err})
        }
    })
    router.route('/:idSettings')
    .delete (authenticate,async (req,res) => {
         req.idSettings = parseInt (req.params.idSettings);
        try {
            //A faire!:
            //ajouter la suppression des schedules affiliés à ce setting!
            const deleteSettings = await deleteValveSetting(req.idValve,req.idSettings, req.userId);
            console.log("deleteSettings",deleteSettings)
            if(deleteSettings.errorMsg) throw new Error (deleteSettings.errorMsg);
            res.status(200).json(deleteSettings.msg)
        }catch (err) {
            res.status(400).json({errorMsg:err})
        }
    })
    .put (authenticate,async (req,res) => {
        req.idSettings = parseInt (req.params.idSettings);
        const {rainThreshold, moistureThreshold, duration, isAutomatic} = req.body;
        try{
            const updateValveSetting = await updateValveSetting(rainThreshold, moistureThreshold, duration, isAutomatic, req.idSettings, req.userId,req.idValve)
            if(updateValveSetting.errorMsg) throw new Error (updateValveSetting.errorMsg);
            res.status(200).json(updateValveSetting)
        }catch(err){
            res.status(400).json({errorMsg:err})
        }
    })

module.exports=router;