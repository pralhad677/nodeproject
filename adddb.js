const mongoose =require('mongoose');
const fs =require('fs');
const dotenv = require('dotenv');
const User = require('./model/model')



dotenv.config({path:'./config.env'})

// const DB = process.env.DB.replace(
//     '<password>',
//     process.env.DB_PASSWORD
// );
// console.log(DB)
// mongoose.connect('mongodb://localhost/index',{useNewUrlParser: true,useUnifiedTopology: true ,useCreateIndex:true,useFindAndModify:false}).then(() => {
//     // app.listen(process.env.PORT,() => {
//     //     console.log(`server is connected at port ${process.env.PORT}`);
//     // })
// })

mongoose.connect('mongodb://localhost/project',{ useNewUrlParser: true,useUnifiedTopology: true  })
// }).catch(err => {
//     console.log(err);
// })
// mongoose.connection
// .once('open',() => {
//     console.log('Good to go');
// })
// .on('error',(err) => {
//     console.warn('Warning',err);
// })





    const data = JSON.parse(fs.readFileSync('./a.json','utf-8'));
    console.log(data)

    const addDb = async ()=>{
        try{
        await User.create(data);
        console.log('data created successfully')
        process.exit();
        }catch(err){
            console.log(err);
        }
    }

    const deleteData = async () => {
        try{
        await User.deleteMany();
        console.log('data deleted successfully');
        process.exit();
        }catch(err){
            console.group(err);
        }
    }

    if(process.argv[2] === '--import'){
        addDb()
    }else if(process.argv[2] === '--delete'){
        deleteData()
    }