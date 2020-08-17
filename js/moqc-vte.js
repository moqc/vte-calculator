

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


        
        //on the form submit generate the opnote
        $('#vteForm').submit(function (e) {
            e.preventDefault();
            var formId = this.id;  // "this" is a reference to the submitted form

            var formData = $('#vteForm').serializeArray();

            console.log(formData);

            //showWarning();

            //var opnote = generateOpnote(formData);

            //$('#copiedAlert').fadeOut(50);

            //$('#generatedOpnote').html(opnote);
            //$('#generatedOpnote').slideDown(500);
            //$('#copyToClipboardDiv').slideDown(500);
            
            // $("body,html").animate(
            //     {
            //       scrollTop: $("#generatedOpnoteDiv").offset().top
            //     },
            //     500 //speed
            // );

            // $('#copyToClipboardButton').click(function() {
            //     copyToClipboard(opnote);
            //     $('#copiedAlert').fadeIn(200);
            // });

        });

        $('#resetFormButton').click(function() {
            router.navigate("home");
            window.location.reload();
        });


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


