const Users = require('./models/Users');
const Medicine = require('./models/medicine-model')
const logger = require('./services/logger');

module.exports = {
    async validateEmailAccessibility(email)
    {
        var isEmailExits = false;
        await Users.findOne({email: email}).then(function(result){
            if(result != null)
            {
                isEmailExits = true;
            }
        });

        return isEmailExits;
    },

    async validateMedicineName(medicine)
    {
        var isMedExist = false;
        await Medicine.findOne({medicineName: medicine}).then(function(result){
            if(result != null)
            {
                isMedExist = true;
            }
        });

        return isMedExist;
    },

    async findUser(email)
    {
        var user = await Users.findOne({email: email});
        if(user)
        {
            return user.id;
        }
    },

    async updateUserVerification(userId)
    {
        try{
            var user = await Users.findOne({_id: userId});

            const result = await Users.updateOne({ name: 'abc'}, {$set: {verified: false}})
            console.log(result);
                   
        }
        catch
        {

        }
        
    },

    //Need to update user --->>> properly
    // async updateUser(id) {
    //     var user = await Users.findOne({_id: id});
    //     if(user) {
    //         const userId = id;
    //         const user =  { "verified": true  } 
    //         Users.findByIdAndUpdate(userId , user, 
    //             function (err, docs) { 
    //             if (err){ 
    //                 console.log(err) 
    //             } 
    //             else{ 
    //                 console.log("Updated User : ", docs); 
    //             } 
    //         }); 
                
    //     }

    // }



}