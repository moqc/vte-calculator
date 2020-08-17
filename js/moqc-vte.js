

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

            var recommendation = generateRecommendation(formData);

            $('#copiedAlert').fadeOut(50);

            $('#generatedRecommendation').html(recommendation);
            $('#generatedRecommendation').slideDown(500);
            $('#copyToClipboardDiv').slideDown(500);
            
            $("body,html").animate(
                {
                  scrollTop: $("#generatedRecommendationDiv").offset().top
                },
                500 //speed
            );

            $('#copyToClipboardButton').click(function() {
                copyToClipboard(recommendation);
                $('#copiedAlert').fadeIn(200);
            });

        });

        $('#resetFormButton').click(function() {
            router.navigate("");
            window.location.reload();
        });


    }
});
var homeVTECalculatorView = new HomeVTECalculatorView();


function generateRecommendation(formData) {

    var minimalNote = "**Due to the lack of robust data, duration of prophylaxis in minimally invasive surgery is not known. University of Michigan uses 10 days as patients undergoing minimally invasive surgery recover faster."

    var generatedText = "";

    
    //calculate score
    var score = 0;
    for(var i = 0; i < formData.length; i++) {

        if(formData[i].name.startsWith("score-"))
        {
            score += Number(formData[i].value);
        }
    }

    //console.log("SCORE: " + score);

    var subtext = "";
    if(getFormDataElement(formData, "typeA") == "minor" || getFormDataElement(formData, "typeB") == "minor")
    {
        generatedText += "Minimally Invasive Surgery Duration of Prophylaxis is 10 days";
        generatedText += '\n';

        var recommendExt = false;

        if(getFormDataElement(formData, "score-unprovokedVTE") == "1")
        {
            subtext += " Recommended due to:  Personal history of unprovoked VTE";
            recommendExt = true;
        }

        if(score == 5 || score == 6)
        {
            if(getFormDataElement(formData, "histology") == "true" || getFormDataElement(formData, "stage") == "true")
            {
                subtext += " Recommended due to:  Histology/Stage AND caprini score 5-6";
                recommendExt = true;
            }
        }

        if(score >= 7)
        {
            subtext += " Recommended due to:  Caprini score 7 or more";
            recommendExt = true;
        }

        if(recommendExt)
        {
            generatedText += "Extended Prophylaxis Recommended" + '\n';
        }
        else
        {
            generatedText += "No Extended Prophylaxis" + '\n';
        }

        generatedText += subtext;
    }
    else if(getFormDataElement(formData, "typeA") == "major" || getFormDataElement(formData, "typeB") == "major")
    {
        generatedText += "Open/Vulvar/Vaginal Surgery Duration of Prolonged Prophylaxis is 28 days";
        generatedText += '\n';

        var recommendExt = false;

        if(getFormDataElement(formData, "score-unprovokedVTE") == "1")
        {
            subtext += " Recommended due to:  Personal history of unprovoked VTE";
            recommendExt = true;
        }

        if(getFormDataElement(formData, "score-malignancy") == "1")
        {
            subtext += " Recommended due to:  Patient with malignancy";
            recommendExt = true;
        }

        if(score >= 5)
        {
            subtext += " Recommended due to:  Caprini score 5 or more";
            recommendExt = true;
        }

        if(recommendExt)
        {
            generatedText += "Extended Prophylaxis Recommended" + '\n';
        }
        else
        {
            generatedText += "No Extended Prophylaxis" + '\n';
        }

        generatedText += subtext;
    }
    else
    {
        generatedText += "!!! ERROR: Select a surgery type !!!";
        return generatedText;
    }


    generatedText += '\n' + '\n';

    return generatedText;
}


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


