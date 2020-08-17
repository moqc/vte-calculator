
AppRouter = Backbone.Router.extend({
    routes: {
        "": "home"
    }
    
});

var router = new AppRouter;


router.on('route:home', function(){
    
    homeVTECalculatorView.render();
    
});


Backbone.history.start();


