

HomeVTECalculatorView = Backbone.View.extend({
    el:'#mainpage',
    render: function() {
        var that = this;

        //render header
        var data = {
        };

        var vteHeaderTemplate = _.template($('#vte-header-template').html())(data);
        $('#header').html(vteHeaderTemplate);

        //render mainpage buttons
        var vteHomeTemplate = _.template($('#vte-home-template').html())({});
        $('#mainpage').html(vteHomeTemplate);

    }
});
var homeVTECalculatorView = new HomeVTECalculatorView();





function showWarning() {

    bootbox.dialog({
        message: function() {
            return _.template($('#vte-warning-template').html())({});
        },
        backdrop: true,
        closeButton: false,
        onEscape: function() {
            return true;
        },
        buttons: {
            ok: {
                label: 'I Agree',
                className: 'btn-primary',
                callback: function(){
                                    
                }
            },
            cancel: {
                label: 'I Disagree',
                className: 'btn-error',
                callback: function(){
                    window.location.replace("https://moqc.org/initiatives/gyn-onc/");
                }
            },
        }
    }).find("div.modal-dialog").addClass("modal-xl");
}


