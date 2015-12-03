var User = require('../model/user');
var Poll = require('../controllers/poll');
var UserCont=require('../controllers/user');
var Bcrypt=require('bcrypt');



module.exports.endpoints=[

  {method:'GET',path:'/',handler:function(request,reply){reply.view('index')}},

  {method:'GET',path:'/login',handler:function(request,reply){reply.view('login')}},



  {method:'GET',path:'/verifymail/{token?}',handler:UserCont.verifyMail},

  {
        method:  'POST',
        path: '/login',
        config: {
            handler: UserCont.login,
            auth: {
                mode: 'try',
                strategy: 'session'
            },
            plugins: {
                'hapi-auth-cookie': {
                    redirectTo: false
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/logout',
        config: {
            handler: UserCont.logout,
            auth: 'session'
        }
    },


  {method:'GET',path:'/signup',handler:function(request,reply){reply.view('signup');}},

  {method:'GET',path:'/admin',handler:function(request,reply){reply.view('admin/dashboard');}},

  {method:'POST',path:'/signup',config: UserCont.create},

  {method:'GET',path:'/profile',config:{auth:'session'},handler:UserCont.profile},

  {method:'GET',path:'/polls',config:Poll.getPolls},

  {
   method: 'POST',
   path: '/fileup',
   config: {
      payload:{
            maxBytes: 209715200,
            output:'stream',
            parse: true
      },
      handler: UserCont.picChange
}
},


{
    method: 'GET',
    path: '/uploads/{param1*}',
    handler: {
        directory: {
            path: 'uploads',
            listing:true
        }
    }
},


]
