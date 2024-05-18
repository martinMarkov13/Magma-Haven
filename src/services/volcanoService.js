const Volcano = require('../models/Volcano')

exports.getAll = () => Volcano.find().lean()

exports.createVolcano = (volcanoData) => Volcano.create(volcanoData)

exports.getOne = (volcanoId) => Volcano.findById(volcanoId).populate("owner");

exports.deleteVolcano = (volcanoId) => Volcano.findByIdAndDelete(volcanoId)

exports.updateVolcano = (volcano, updateData) => Volcano.updateOne(volcano, updateData, { runValidators: true })

exports.vote = async (volcanoId, user) => {
    const volcano = await Volcano.findById(volcanoId);
   
    const hasVoted = volcano.voteList.includes(user)

    if(!hasVoted){
        volcano.voteList.push(user)

        volcano.save()
    }else{
        return
    }
}

exports.getSearchResult = async (name, type) => {
    const volcanoes = await Volcano.find().lean()
    
    let result = []
  
    if (name) {
     result = volcanoes.filter((v) => v.name.toLowerCase().includes(name.toLowerCase()));
    }else if (type) {
      result = volcanoes.filter((v) => v.type == type);
    }
  
    return result;
}