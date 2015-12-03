var Poll=require('../model/poll');
var Boom=require('boom');
var mongoose=require('mongoose');

exports.getPolls={

  handler:function(request,reply){
    Poll.find({},function(err,poll){
      if(err)
          return reply(Boom.badImplementation());

          reply.view('polls',{'polls':poll});
    });
  }
}
