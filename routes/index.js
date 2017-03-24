var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    req.db.collection('flowers').distinct('color', function (err, colorDocs) {
        if(err) {
            return next(err)
        }
        if(req.query.color_filter) {
        req.db.collection('flowers').find({"color":req.query.color_filter}).toArray(function (err, docs) {
            if (err) {
                return next(err);
            }
            return res.render('all_flowers', {'flowers': docs, 'colors': colorDocs, 'color_filter': req.query.color_filter});

        });

    }
    else {
        req.db.collection('flowers').find().toArray(function (err, docs) {
                if (err) {
                    return next(err)
                }
                return res.render('all_flowers', {'flowers': docs, 'colors': colorDocs})

            });
        }

    });
});
router.get('/details/:flower', function(req, res, next) {
    req.db.collection('flowers').findOne({'name':req.params.flower}, function (err, doc){
        if(err){
            return next(err); //500 error
        }
        if(!doc){
            return next(); // Creates 404 error
        }
        return res.render('flower_details', {'flower':doc});
    });
});
// handle a post request
router.post('/addFlower', function (req, res, next)
{
    // would go through the each flower in the list
    req.db.collection('flowers').find({'name':req.body.name}).toArray( function (err, doc)
        {
            console.log(doc);
            console.log(doc.length); // gives the number of duplicate entry
            //checks if the list for the flower name is 0;then add it else give an error message
            if(doc.length == 0)
            {
                req.db.collection('flowers').insertOne(req.body, function (err) {
                    if (err) {
                        return next(err);
                    }
                    return res.redirect('/'); // directs to home-page
                });
            }
            else {
                res.send("Duplicate Entry");

            }
        //req.body has all the form data
    });
});
//to update a database, use put method especially when you know the URL
router.put('/updateColor', function(req, res, next)
{

    var filter = { 'name' : req.body.name };
    var update = { $set : { 'color' : req.body.color }};

    req.db.collection('flowers').findOneAndUpdate(filter, update, function(err)
    {
        if (err) {
            return next(err);
        }
        return res.send({'color' : req.body.color})
    })
});

router.post('/deleteFlower', function (req, res, next)
{
    console.log(req.body);
    req.db.collection('flowers').deleteOne({'name':req.body.name},function (err)
    {
    if (err)
    {
        return next(err);
    }
    return res.render('delete_flower.hbs',{'Flowers': req.body} ); // directs to home-page
    });
    
});

module.exports = router;
