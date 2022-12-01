const User = require('../models/User');

exports.getMyMatchedUsers = (req, res) => {
    //const me = await User.findById(req.auth.userId);
    var Query = User.findById(req.auth.userId);
    console.log("hello there, ");
    Query = Query.lean().populate({
        path:"Matches",
        model: "User",
        select: { 
            '_id': 1,
            'pseudo':1, 
            'fullname': 1,
            'gender': 1, 
            'Photo': 1},
        });
    Query = Query.select('Matches');
    // Query = Query.execPopulate();
    Query = Query.exec(function (err, matches) {
        if (!err) {
            console.log("success");
            return res.send({ 'statusCode': 200, 'statusText': 'OK', 'data': matches });
        } else {
            console.log("fail");
            return res.send(500);
        }
    });
}