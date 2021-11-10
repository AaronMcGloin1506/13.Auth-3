const bcrypt = require('bcrypt');

bcrypt.genSalt(10, (err, salt) => {

    //$2b$10$2Bj24JYShPhHHQ.RpIeGne

    if(err)return false
    
    bcrypt.hash('password123',salt,(err,hash)=>{
        if(err) return false
        console.log(hash)
    })
})

