const Sequelize = require("sequelize");

const sequelize = new Sequelize("heroku_12f8cda74ec35fc","b784608b00f6ba","c7ebbebd",{
    host:"us-cdbr-east-03.cleardb.com",
    dialect:"mysql",
    raw:true,
    define:{
        timestamps:false
    }
})

module.exports = sequelize;