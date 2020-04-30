/**
 * Seed Function
 * (sails.config.bootstrap)
 *
 * A function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also create a hook.
 *
 * For more information on seeding your app with fake data, check out:
 * https://sailsjs.com/config/bootstrap
 */

module.exports.bootstrap = async function () {

  sails.bcrypt = require('bcryptjs');
  const saltRounds = 10;

  if (await RERS.count() == 0) {

    await RERS.createEach([
      { pptt: "汤臣一品", est: "Shanghai City", bdr: 4, url: "http://img1.imgtn.bdimg.com/it/u=659128221,1784325424&fm=26&gp=0.jpg", rent: 80000, hp: "on", gro: 4 ,ET:2},
      { pptt: "中远两湾城", est: "Shanghai City", bdr: 3, url: "http://images.shobserver.com/news/news/2018/12/31/333880ba-53c0-430c-ae7a-446df7c1b116.jpg", rent: 60000, hp: "on", gro: 4 ,ET:1},
      { pptt: "德福花园", est: "HongKong City", bdr: 4, url: "http://i1.28hse.com/2018/06/612131_2018063682.jpg", rent: 6000, hp: "on", gro: 3 ,ET:5},
      { pptt: "淘大花园", est: "HAHA City", bdr: 4, url: "http://i1.28hse.com/2016/04/280120_2016044938.jpg", rent: 5000, hp: "on", gro: 4 ,ET:1}

      // etc.
    ]);
  }
  if (await RERS.count() > 0) {
    return generateUsers();
  }


  return generateUsers();

  async function generateUsers() {

    if (await User.count() > 0) {
      return;
    }

    const hash = await sails.bcrypt.hash('1', saltRounds);

    await User.createEach([
      { username: "a", password: hash, role: "admin" },
      { username: "admin", password: hash, role: "admin" },
      { username: "client", password: hash, role: "client" },
      { username: "c", password: hash, role: "client" },
      { username: "e", password: hash, role: "everyone" },

      // etc.
    ]);

    const martin = await RERS.findOne({ pptt: "汤臣一品" });
    const kenny = await RERS.findOne({ pptt: "中远两湾城" });
    const admin = await User.findOne({ username: "a" });
    const boss = await User.findOne({ username: "c" });

    await User.addToCollection(admin.id, 'supervises').members(kenny.id);
    await User.addToCollection(boss.id, 'supervises').members([martin.id, kenny.id]);

  }

};
