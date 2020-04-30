/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    json: async function (req, res) {

        var rers = await User.find();

        return res.json(rers);
    },

    login: async function (req, res) {

        if (req.method == "GET") return res.view('user/login');

        if (!req.body.username || !req.body.password) return res.badRequest();

        var user = await User.findOne({ username: req.body.username });

        if (!user) return res.status(401).send("User not found");

        const match = await sails.bcrypt.compare(req.body.password, user.password);

        if (!match) return res.status(401).send("Wrong Password");
        req.session.regenerate(function (err) {

            if (err) return res.serverError(err);

            req.session.username = req.body.username;
            req.session.role = user.role;
            req.session.userid = user.id;
            sails.log("[Session] ", req.session);
            return res.redirect("/");
            // return res.ok("Login successfully.");

        });

    },
    logout: async function (req, res) {

        req.session.destroy(function (err) {

            if (err) return res.serverError(err);

            //return res.ok("Log out successfully.");
            return res.redirect("/");

        });
    },
    index: async function (req, res) {
        var op = "on";
        var models = await RERS.find({
            where: { hp: { contains: op } },
            limit: 4,
            sort: 'createdAt'
        });
        return res.view('RERS/index', { RERS: models });

    },

    add: async function (req, res) {

        if (!await User.findOne(req.params.id)) 
            return res.notFound();

        var model = await RERS.findOne(req.params.fk).populate("worksFor");
        const thatPerson = await RERS.findOne(req.params.fk).populate("worksFor", { id: req.params.id });

        if (!thatPerson) return res.notFound();
        if (thatPerson.ET < model.worksFor.length + 1)
            return res.status(409).send("FULL!!!");
        if (thatPerson.worksFor.length)
            return res.status(409).send("Already added.");   // conflict
        await User.addToCollection(req.params.id, "supervises").members(req.params.fk);
         return res.ok('Operation completed.');

    },
    remove: async function (req, res) {

        if (!await User.findOne(req.params.id)) return res.notFound();
        
        const thatPerson = await RERS.findOne(req.params.fk).populate("worksFor", {id: req.params.id});
        
        if (!thatPerson) return res.notFound();
    
        if (!thatPerson.worksFor.length)
            return res.status(409).send("Nothing to delete.");    // conflict
    
        await User.removeFromCollection(req.params.id, "supervises").members(req.params.fk);
    
        return res.ok('Operation completed.');
    
    },
    populate: async function (req, res){
   //     sails.log("[req]",req.params);
     var model = await User.findOne(req.params.id).populate("supervises");
 
     if (!model) return res.notFound();
    //return res.ok("haha");
     return res.view('RERS/myR', { RERS: model.supervises });
    }

};

