var express = require('express');
var schemas = require('../models/schemas');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/:id', async(req, res)=>{
    let sess = req.session;

    if(!sess.loggedIn){
        res.render('menu', {title:'Edit', loggedIn:false, error:'Invalid Request'});
    }else{
        let id = req.params.id;
        let err = '';

        let menu = schemas.menu;
        let qry = {_id:id};

        let itemResult = await menu.find(qry).then((itemData)=>{
            if(itemData == null){
                err = "Invalid ID";
            }

            res.render('menu', {title:'Edit Menu', item:itemData, loggedIn:sess.loggedIn, error: err});
        });
    }
})

router.get('/delete/:id', async(req, res)=>{
    let sess = req.session;
    if(!sess.loggedIn){
        res.redirect('/login');
    }else{
        let menu = schemas.menu;
        let menuId = req.params.id;
        let qry = {_id:menuId};
        let deleteResult = await menu.deleteOne(qry);
        res.redirect('/');
    }
})

router.post('/save', async(req, res)=>{
    let sess = req.session;

    if(!sess.loggedIn){
        res.redirect('/login');
    }else{
        let menuId = req.body.menuId;
        let menuName = req.body.menuName;
        let menuIcon = req.body.menuIcon;
        let menuUrl = req.body.menuUrl;
        let menu = schemas.menu;

        let qry = {_id:menuId};

        let saveData = {
            $set:{
                name: menuName,
                icon: menuIcon,
                menuUrl: menuUrl
            }
        }

        let updateResult = await menu.updateOne(qry, saveData);
        res.redirect('/');
    }
});

router.post('/new', async(req, res)=>{
    let sess  = req.session;
    if(!sess.loggedIn){
        res.redirect('/login');
    }else{
    let menuName = req.body.menuName;
    let menuIcon = req.body.menuIcon;
    let menuUrl = req.body.menuUrl;
    let menu = schemas.menu;

    let qry = {name:menuName};

    let searchResults = await menu.findOne(qry).then(async(userData)=>{
        if(!userData){
            let newMenu = new schemas.menu({
                name : menuName,
                icon : menuIcon,
                menuUrl : menuUrl
            });

            let saveMenu = await newMenu.save();
        }
    });

    res.redirect('/');
}
});

module.exports = router;