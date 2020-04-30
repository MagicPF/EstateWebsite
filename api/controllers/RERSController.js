/**
 * RERSController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    create: async function (req, res) {

        if (req.method == "GET")
            return res.view('RERS/create');

        if (!req.body.RERS)
            return res.badRequest("Form-data not received.");

        await RERS.create(req.body.RERS);

        return res.redirect("/");
    },
    json: async function (req, res) {

        var rers = await RERS.find();

        return res.json(rers);
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
    detail: async function (req, res) {

        var model = await RERS.findOne(req.params.id).populate("worksFor",{id:req.session.userid});

        if (!model) return res.notFound();

        return res.view('RERS/detail', { RERS: model});
    },
    admin: async function (req, res) {
        var models = await RERS.find();
        return res.view('RERS/admin', { RERS: models });
    },

    edit: async function (req, res) {

        if (req.method == "GET") {

            var model = await RERS.findOne(req.params.id);

            if (!model) return res.notFound();

            return res.view('RERS/edit', { RERS: model });

        }
        else {

            if (!req.body.RERS)
                return res.badRequest("Form-data not received.");
            var models = await RERS.update(req.params.id).set({
                pptt: req.body.RERS.pptt,
                rent: req.body.RERS.rent,
                est: req.body.RERS.est,
                hp: req.body.RERS.hp || "",
                url: req.body.RERS.url,
                bdr: req.body.RERS.bdr,
                gro: req.body.RERS.gro,
                ET: req.body.RERS.ET
            }).fetch();

            if (models.length == 0) return res.notFound();

            return res.redirect("/");

        }
    },

    delete: async function (req, res) {

        if (req.method == "GET") return res.forbidden();

        var models = await RERS.destroy(req.params.id).fetch();

        if (models.length == 0) return res.notFound();

        return res.redirect("/");

    },
    search: async function (req, res) {

        const qPage = Math.max(req.query.page - 1, 0) || 0;
        const numOfItemsPerPage = 2, qmin = parseInt(req.query.amin), qmax = parseInt(req.query.amax);
        const qbdr = parseInt(req.query.bdr), r_min = parseInt(req.query.rmin), r_max = parseInt(req.query.rmax);
        const qest = req.query.est || "";
        if (isNaN(qbdr) || isNaN(r_min) || isNaN(qmin)) {
            var models = await RERS.find({
                where: { est: { contains: qest } },
                limit: numOfItemsPerPage,
                skip: numOfItemsPerPage * qPage,
                sort: 'rent'
            });
        }
        else {
            var models = await RERS.find({
                where: { bdr: qbdr, est: { contains: qest }, rent: { '>=': r_min, '<=': r_max }, gro: { '>=': qmin, '<=': qmax } },
                limit: numOfItemsPerPage,
                skip: numOfItemsPerPage * qPage,
                sort: 'rent'
            });
        }
        var numOfPage = Math.ceil(await RERS.count() / numOfItemsPerPage);

        return res.view('RERS/search', { RERS: models, count: numOfPage });
    },

    populate: async function (req, res) {

        var model = await RERS.findOne(req.params.id).populate("worksFor");

        if (!model) return res.notFound();
        sails.log("[model] ", model);
        return res.view('RERS/occupants', { User: model.worksFor });
        
   },
};

