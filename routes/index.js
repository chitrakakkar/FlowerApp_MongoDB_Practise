var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next)
{
    //finds the distinct value for flower with specified color
    req.db.collection('flowers').distinct('color', function (err, colorDocs) {
        if(err) {
            return next(err)
        }
        //color_filter gives the text of color chosen in all_flower select box
        if(req.query.color_filter)
        {
            // finds flower with this color
        req.db.collection('flowers').find({"color":req.query.color_filter}).toArray(function (err, docs) {
            if (err) {
                return next(err);
            }
            // displays all_flower.html with data from docs and colorDocs
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
// shows individual flower's details as docs contains the info and goes to flower_details page
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
// handle a post request , finds a flower and if the size is 0;adds a new flower
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
// picks the name and deletes the flower.
router.post('/deleteFlower', function (req, res, next)
{
    console.log(req.body);// reg.body has all the data
    req.db.collection('flowers').deleteOne({'name':req.body.name},function (err)
    {
    if (err)
    {
        return next(err);
    }
    return res.render('delete_flower.hbs',{'Flowers': req.body} ); // directs to delete-page
    });
    
});

module.exports = router;
