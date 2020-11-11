

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

        $('.updateScore').click(function() {
            console.log("clicked");
            setTimeout(function () {
                var formData = $('#vteForm').serializeArray();
                var score = calculateScore(formData);
                $('#scoreLabel').html(score);
            }, 50);
        });
        
        //on the form submit generate the opnote
        $('#vteForm').submit(function (e) {
            e.preventDefault();
            var formId = this.id;  // "this" is a reference to the submitted form

            var formData = $('#vteForm').serializeArray();

            console.log(formData);

            showWarning();

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

function calculateScore(formData) {

    //calculate score
    var score = 0;
    for(var i = 0; i < formData.length; i++) {

        if(formData[i].name.startsWith("score-"))
        {
            score += Number(formData[i].value);
        }
    }

    if(getFormDataElement(formData, "typeOfSurgery") == "minor")
    {
        //add the optime score which is dependent on the surgery type
        var optimeScore = getFormDataElement(formData, "optime");
        console.log(optimeScore);
        if(optimeScore) {
            score += parseInt(optimeScore);
        }
        
    }
    else if(getFormDataElement(formData, "typeOfSurgery") == "major")
    {
        //add a 2 for the "optime" score if over 45 mins (45 mins is a 0 score, above is 1 or 2 score) because this is OVV surgery
        
        var optimeScore = getFormDataElement(formData, "optime")
        if(optimeScore) {
            var optime = parseInt(optimeScore);
            if(optime > 0) {
                optime = 2;
            }
            score += optime;
        }
    }

    return score
}

function generateRecommendation(formData) {

    var minimalNote = "**Due to the lack of robust data, duration of prophylaxis in minimally invasive surgery is not known. University of Michigan uses 10 days as patients undergoing minimally invasive surgery recover faster."

    var generatedText = "";

    var score = calculateScore(formData);

    //console.log("SCORE: " + score);

    var subtext = "";
    if(getFormDataElement(formData, "typeOfSurgery") == "minor")
    {
        var recommendExt = false;

        // //add the optime score which is dependent on the surgery type
        // score += getFormDataElement(formData, "optime");

        if(getFormDataElement(formData, "score-unprovokedVTE") == "3")
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
            generatedText += "Minimally Invasive Surgery Duration of Prophylaxis is 10 days";
            generatedText += '\n';
            generatedText += "Extended Prophylaxis Recommended" + '\n';
        }
        else
        {
            generatedText += "No Extended Prophylaxis" + '\n';
        }

        generatedText += subtext;
    }
    else if(getFormDataElement(formData, "typeOfSurgery").startsWith("major"))
    {
        var recommendExt = false;

        // //add a 2 for the "optime" score if over 45 mins (45 mins is a 0 score, above is 1 or 2 score) because this is OVV surgery
        // var optime = getFormDataElement(formData, "optime");
        // if(optime > 0) {
        //     optime = 2;
        // }
        // score += optime;

        if(getFormDataElement(formData, "score-unprovokedVTE") == "1")
        {
            subtext += " Recommended due to:  Personal history of unprovoked VTE";
            recommendExt = true;
        }

        if(getFormDataElement(formData, "score-malignancy") == "2" && getFormDataElement(formData, "typeOfSurgery") == "major-open")
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
            if(getFormDataElement(formData, "typeOfSurgery") == "major-open") {
                generatedText += "Open Surgery Duration of Prolonged Prophylaxis is 28 days";
            }
            else if(getFormDataElement(formData, "typeOfSurgery") == "major-vv") {
                generatedText += "Vulvar/Vaginal Surgery Duration of Prolonged Prophylaxis is 28 days";
            }
            
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
        generatedText += "!!! ERROR: Select a Type of Surgery !!!";
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
            router.navigate("");
            window.location.reload();
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
                    window.location.href = "https://moqc.org/initiatives/gynecologic-oncology/";
                }
            },
        }
    }).find("div.modal-dialog").addClass("modal-xl");
}

