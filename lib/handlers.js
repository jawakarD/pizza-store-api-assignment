// to handle sone fuction for the server



//Dependencies
const _data = require('./data');
const helpers = require('./helpers');

var handlers = {};

handlers.ping = (data, callback) => callback(200) ;

handlers.notFound = (data,callback)=> callback(404) ;


handlers.users = (data,callback) =>{
  let acceptIfMethods = ['post','get','put','delete'];
  if(acceptIfMethods.indexOf(data.method) > -1){
    handlers._users[data.method](data,callback);
  }else{
    callback(405);
  }
};


handlers._users = {};

// User sign up with Name, Email and streetAddress (Required)
// optional -> nickname
handlers._users.post = (data, callback) => {

  //Check all required info provided
  const name = typeof(data.payload.name) == 'string' && data.payload.name.trim().length > 0 ? data.payload.name.trim() : false;
  const email = typeof(data.payload.email) == 'string' && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.payload.email.trim()) ? data.payload.email.trim(): false;
  const streetAddress = typeof(data.payload.address) == 'string' && data.payload.address.length > 0 ? data.payload.address : false;
  const phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
  const password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
  if(name && email && streetAddress && phone && password){

    //Check if user already exixts
    _data.read('users',email+phone,
    //callback
    (err,data) => {
      if(err){

        //hashing the password
        let hashedPassword = helpers.hash(password);

          if(hashedPassword){

            //Creating userObject
            let userObject = {
              'name' : name,
              'email' : email,
              'address' : streetAddress,
              'phone' : phone,
              'password' : hashedPassword
            };

            //Store the user to the files

            _data.create('users',email+phone,userObject,

            //callback
            (err)=>{
              if(!err){
                callback(200);
              }else{
                callback(500,{'error': 'Could not create user'});
              }
            }
          );
        }else {
          callback(500,{'error': 'Could not hash the password'});
        }
      }else {
        callback(400,{'error' : 'User email id already exixts'});
      }
    }
  );
  }else {
    callback({'error' : 'Missing required field'});
  }
};

//Get user data with Email and phone
//required->>>email and Phone .. optional->>none
// TODO: validate  the user to access the data with token
handlers._users.get = (data,callback) => {
  //Validate the email and get
  const email = typeof(data.queryStringObject.email) == 'string' && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.queryStringObject.email.trim()) ? data.queryStringObject.email.trim(): false;
  const phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
  //check for if email provided
  if(email && phone){

    //get the data
    _data.read('users',email+phone,
    //Callback
    (err,userDataObject)=>{
      if(!err){
        delete userDataObject.password;
        callback(200,userDataObject);
      } else {
        callback(400,{'error':'cannot find data for the given email and phone'});
      }
    }
  );
  } else {
    callback(400,{'error' : 'Missing email or phone to get the data'});
  }
};

//user put-> modify users data
//Required ->>phone & email and  atleast any one value that has to be modified in ( email, address, name, password');
handlers._users.put =(data, callback) => {
  //required
  const phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
  const email = typeof(data.payload.email) == 'string' && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.payload.email.trim()) ? data.payload.email.trim(): false;

  //optional
  const name = typeof(data.payload.name) == 'string' && data.payload.name.trim().length > 0 ? data.payload.name.trim() : false;
  const streetAddress = typeof(data.payload.address) == 'string' && data.payload.address.length > 0 ? data.payload.address : false;
  const password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
  if(email && phone){

    // TODO: validate the user with token to make a change
    _data.read('users',email+phone,
    //callback
    (err,userDataObject)=>{
      if(!err){

        //modify the userDataObject
        if(name){
          userDataObject.name = name;
        }
        if(streetAddress){
          userDataObject.streetAddress = streetAddress;
        }
        if(password){
          userDataObject.password = password;
        }

        //remove old data and modify the user files
        _data.update('users',email+phone,userDataObject,
        //callback
        (err)=>{
          if(!err){
            callback(200,userDataObject);
          }else {
            callback(500,{'error' : 'could no update the modified data'});
          }
        }
      );
      }else {
        callback(400,{'error' : 'wrong email or phone to modify the data'});
      }
    }
  );
  }else {
    callback(400,{'error' : 'Missing email or phone to modify the data'});
  }
};


//Delete the user data
//Required data - > phone and email
//optional -> none
handlers._users.delete = (data,callback)=>{
  //required
  const phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
  const email = typeof(data.payload.email) == 'string' && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.payload.email.trim()) ? data.payload.email.trim(): false;

  if(phone &&email){

    //verify if data exists
    _data.read('users',email+phone,(err, userDataObject)=>{
      if(!err && userDataObject){
        _data.delete('users',email+phone,()=>{
          if(!err){
            callback(200);
          }else {
            callback(500,{'error':''});
          }
        });
      }else {
        callback(400,{'error' : 'wrong email or phone to modify the data'});
      }
    });
  }else {
    callback(400,{'error' : 'Missing email or phone to modify the data'});
  }
};










module.exports = handlers;
