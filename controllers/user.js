var Joi       =   require('joi');
var Boom      =   require('boom');
var User      =   require('../model/user').User;
var Mongoose  =   require('mongoose');
var bcrypt    =   require('bcrypt');
var sendMail  =   require('./verifymail');
var fs=require('fs');
var path=require('path');


exports.create    =   {
  validate:{
    payload:{
      email:Joi.string().required(),
      password:Joi.string().required(),
      name:Joi.string().required()
    }
  },
    handler:function(request,reply){
              var salt = bcrypt.genSaltSync(10);
              request.payload.password=bcrypt.hashSync(request.payload.password, salt);
              request.payload.token=bcrypt.hashSync(request.payload.email,10);
              var user=new User(request.payload);
              user.save(function(err,user){
                if(!err){
                  //console.log(request.server.info.uri);
                 sendMail(user.email,user.token,request.server.info.uri);


                  return reply.redirect('/login',{message:"Please check your mail for email-verification link"});

                }
                if(err.code===11000 || err.code===11001 )
                    return reply(Boom.forbidden("Please provide another user id, it already exists."));
                return reply(Boom.badImplementation());
              });

    }

  }

exports.login = function(request,reply){
    if(request.auth.isAuthenticated){
       return reply.redirect('/profile')
    }
    var message='';
    var account=null;

    User.findOne({'email':request.payload.email},function(err,user){
        if(err)
          return reply(Boom.badImplementation());
          if(!user)
          return reply(Boom.forbidden("There is no account by this email ID"));

      bcrypt.compare(request.payload.password, user.password, function(err, isValid){

       if(err) return reply(Boom.forbidden(err));

       if(!isValid) return reply(Boom.forbidden("Incorrect email or password"));

       request.auth.session.set(user);
       return reply.redirect('/profile');

   });


    });
  };

exports.verifyMail=function(request,reply){
  var token = request.params.token || encodeURIComponent(request.params.token);


  User.findOne({'token':token},function(err,token){
     if(err)
        return Boom.badImplementation();
        if(!token)
        return Boom.forbidden("Invalid token.");

        token.verified=1;
        token.save(function(err,token){
          if(token){
          return   reply.redirect('/login');
          }
        });
   });

};

exports.picChange=function (request, reply) {
  var dirName=new Date().getTime();

    fs.mkdirSync(path.resolve('./uploads')+'/'+dirName);
    uploadDir=path.resolve('./uploads/')+'/'+dirName;

    var avatarUrl=request.server.info.uri+'/uploads/'+dirName+'/'+request.payload['profilepic'].hapi.filename;
    var uploadPath=fs.createWriteStream(uploadDir+'/'+request.payload['profilepic'].hapi.filename);

    request.payload["profilepic"].pipe(uploadPath);
      request.payload["profilepic"].on('end',function(){
          request.payload["profilepic"].unpipe(uploadPath);

          User.findOne({'email':request.payload.email},function(err,user){
            if(err)
            return Boom.badImplementation("There was some error while uploading the profile pic");
                if(user){

                  user.avatar=avatarUrl;
                  user.save(function(err,user){
                    if(err){
                      return Boom.badImplementation("There was some error while uploading the profile pic");
                    }
                    return reply.redirect('/profile');
                  });
                }
                 return Boom.badImplementation("There was some error while uploading the profile pic");
          });

      });

};

exports.profile = function(request,reply){

  var userId=request.auth.credentials.email;
  User.findOne({'email':userId},function(err,userdata){
    if(err)
    return Boom.forbidden("You are not authorized to access this page!!");

      return reply.view('profile',{user:userdata});
  });



};

exports.logout =function(request,reply){
    request.auth.session.clear();
    reply.redirect('/login');
  };
