var mongoose = require('mongoose');
var User = require('./model.js');


module.exports = function(app){
  app.get('/users', function(req, res){
    var query = User.find({});
    query.exec(function(err, users){
      if(err) res.send(err);
      res.json(users);
    });
  });

  app.post('/users', function(req, res){
    console.log(req.body);
    var newuser = new User(req.body);
    newuser.save(function(err){
      if(err) res.send(err);
      res.json(req.body);
    });
  });

  app.post('/query', function(req, res){
    var lat = req.body.latitude;
    var lng = req.body.longitude;
    var distance = req.body.distance;
    var male            = req.body.male;
    var female          = req.body.female;
    var other           = req.body.other;
    var minAge          = req.body.minAge;
    var maxAge          = req.body.maxAge;
    var favLang         = req.body.favlang;
    var reqVerified     = req.body.reqVerified;

    var query = User.find({});

    if(distance){
      query = query.where('location').near({
                            center: {
                              type: 'Point',
                              coordinates:[lng, lat]
                            },
                            maxDistance: distance * 1609.34,
                            spherical: true
                          });
    }

    if(male || female || other){
      query.or([{ 'gender': male }, { 'gender': female }, {'gender': other}]);
    }

    if(minAge){
        query = query.where('age').gte(minAge);
    }

    // ...include filter by Max Age
    if(maxAge){
        query = query.where('age').lte(maxAge);
    }

    // ...include filter by Favorite Language
    if(favLang){
        query = query.where('favlang').equals(favLang);
    }

    // ...include filter for HTML5 Verified Locations
    if(reqVerified){
        query = query.where('htmlverified').equals("Yep (Thanks for giving us real data!)");
    }

    query.exec(function(err, users){
      if(err) res.send(err);

      res.json(users);
    })
  })
};
