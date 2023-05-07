const {addElectrovalveInDb,getElectrovalveInDb,updateElectrovalveInDb, deleteElectrovalveInDb} = require ('../models/ElectrovalveModel');

const giveValvePostion = async (userId, idElectrovalve) => {
    const electrovalves = await getElectrovalve(userId);
    console.log("electrovalves",electrovalves)
    const valve = electrovalves.find(e => e.id == idElectrovalve);
    console.log("valve",valve)
    //console.log('giveValve', getElectrovalves.find(e => e.id == idElectrovalve))
    if (valve) {
        return ({
            exists: true,
            position: valve.position,
            errmsg: ""
        })
    }else{
        return ({
            exists:false,
            position:null,
            errmsg:`Electrovalve with id ${idElectrovalve} does not exist or does not belong this user with id ${userId}`
        });
    }
}

const isValveNotInDb = async (userId, pinPosition) => {
    //send true if valve is not in DB
    const getElectrovalves = await getElectrovalve(userId);
    if(getElectrovalves.find(e => e.position == pinPosition)){
        return false
    }else return true
}
const addElectrovalve = async (userId, pinPosition, name) => {
    if(await isValveNotInDb(userId, pinPosition)){
        try{
            const addValveInDb = await addElectrovalveInDb(userId,pinPosition,name);
            console.log("addValveInDb ",addValveInDb )
            if (addValveInDb) { // vérifie si l'ajout a réussi
                let response={
                    id:addValveInDb.insertId,
                    name:name,
                    position:pinPosition,
                    userId:userId
                };
            return response;
            }else throw new Error ("Unable to add electrovalve.")
        }catch(err){
            throw new Error(err);
        }
    }
}
const deleteElectrovalve = async (idElectrovalve, userId) => {
    try {
        const deleteValveInDb = await deleteElectrovalveInDb(idElectrovalve, userId);

        if (deleteValveInDb.affectedRows) {
            return {msg: `L'éléctrovalve  qui a pour ID: ${idElectrovalve} a été supprimée avec succès`,
            errMsg:""}
        } else {
            return {errMsg: 'electrovalve not found'}
        }
    }catch(e){
        throw new Error(e)
    }
}
const getElectrovalve = (userId) => {
    try{
        return getElectrovalveInDb(userId);
    }catch(e){
        throw new Error("Unable to get electrovalves.Errormsg:"+e)
    }
}
const updateElectrovalve = (name,userId,idElectrovalve) => {
    try{
        return updateElectrovalveInDb(name,userId, idElectrovalve);
    }catch(e){
        throw new Error("Unable to rename electrovalve."+e)
    }
}

module.exports={addElectrovalve,deleteElectrovalve, getElectrovalve,updateElectrovalve, isValveNotInDb, giveValvePostion}