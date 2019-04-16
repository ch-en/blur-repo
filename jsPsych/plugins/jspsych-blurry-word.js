// parameters needed in timeline:
// add trial.attentionProbe (up or down), trial.attentionProbeDuration,
// trial.attentionProbeDelay, trial.targetBlur

//to the timeline (for each trial)


jsPsych.plugins['jspsych-blurry-word'] = (function(){

    var plugin = {};

    jsPsych.pluginAPI.registerPreload('image-slider-response', 'stimulus', 'image');


    plugin.info = {
        name: 'jspsych-blurry-word',
        description: '',
        parameters: {

            target_stimulus: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'Fixed Stimulus',
                default: undefined,
                description: 'The image to be displayed but not adjusted'
            },

            test_stimulus: {
                type: jsPsych.plugins.parameterType.IMAGE,
                pretty_name: 'Stimulus',
                default: undefined,
                description: 'The image to be displayed'
            },
            min: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Min slider',
                default: 0,
                description: 'Sets the minimum value of the slider.'
            },
            max: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Max slider',
                default: 10,
                description: 'Sets the maximum value of the slider',
            },
            start: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Slider starting value',
                default: 5,
                description: 'Sets the starting value of the slider',
            },
            step: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Step',
                default: .1,
                description: 'Sets the step of the slider'
            },
            labels: {
                type: jsPsych.plugins.parameterType.HTML_STRING,
                pretty_name:'Labels',
                default: ['', ''],
                array: true,
                description: 'Labels of the slider.',
            },
            button_label: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'Button label',
                default:  'Continue',
                array: false,
                description: 'Label of the button to advance.'
            },
            prompt: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'Prompt',
                default: null,
                description: 'Any content here will be displayed below the slider.'
            },
            stimulus_duration: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Stimulus duration',
                default: null,
                description: 'How long to hide the stimulus.'
            },
            trial_duration: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Trial duration',
                default: null,
                description: 'How long to show the trial.'
            },
            response_ends_trial: {
                type: jsPsych.plugins.parameterType.BOOL,
                pretty_name: 'Response ends trial',
                default: true,
                description: 'If true, trial will end when user makes a response.'
            },
            attention_response_ends_trial: {
                type: jsPsych.plugins.parameterType.BOOL,
                pretty_name: 'Attention response ends trial',
                default: false,
                description: 'If true, trial will end when user makes an attention response.'
            }
        }
    }

    plugin.trial = function(display_element, trial) {
        console.log(trial);

        var html = '<div id="jspsych-image-slider-response-wrapper" style="margin: 0px 0px; position: relative;">';

        var attn_left_offset = (Math.random() * (100 - 0) + 0);
        var attn_top_offset = (Math.random() * (100 - 0) + 0);
        console.log(attn_top_offset);
        console.log(attn_left_offset);

        // ATTENTION PROBE
        if(trial.attentionProbe == "up"){
            html += '<div id="probe-container" style = "position: absolute; left:33%; top:12%; height:60px; width: 34%; z-index:50">'
            html += '<div id="attnProbe" style="visibility: hidden; position: absolute; '
            // randomize percentage
            + "left: " + attn_left_offset
            + "%; top: " + attn_top_offset
            + '%; z-index:51;">';
        } else if(trial.attentionProbe == "down"){
            html += '<div id="probe-container" style = "position: absolute; left:33%; top:65%; height:60px; width: 34%; z-index:50">'
            html += '<div id="attnProbe" style="visibility: hidden; position: absolute; '
            // randomize percentage
            + "left: " + attn_left_offset
            + "%; top: " + attn_top_offset
            + '%; z-index:51;">';
        }
        if(trial.attentionProbe == "up" || trial.attentionProbe == "down"){
            html += '<img src = "attnProbe.png"></div>';
        }

        if(trial.attentionProbe == "up" || trial.attentionProbe == "down"){
            jsPsych.pluginAPI.setTimeout(function(){
                document.querySelector('#attnProbe').style.visibility = "visible";
                jsPsych.pluginAPI.setTimeout(function(){
                    document.querySelector('#attnProbe').style.visibility = "hidden";
                },  trial.attentionProbeDuration); // ATTN PROBE DURATION
            },  trial.attentionProbeDelay) // ATTN PROBE DELAY
        }
        html += '</div>'
        // end attention probe


        html += '<div id="jspsych-image-slider-response-target_stimulus"><img id="targetimg" src="' + trial.target_stimulus + '"></div>';

        html += '<button id="jspsych-image-slider-response-next" class="blur-button jspsych-btn" style = "border: none; z-index:102">'
        + '<div style="z-index:101"><img src = "fixationcrosses/fixsmaller.png"></div></button>'


        html += '<div id="jspsych-image-slider-response-stimulus"><img id="key" src="' + trial.test_stimulus + '" style="blur: 5px"></div>';
        html += '<div class="jspsych-image-slider-response-container" style="position:relative;">';
        html += '<input type="range" value="'+trial.start+'" min="'+trial.min+'" max="'+trial.max+'" step="'+trial.step+'" style="width: 100%;" id="jspsych-image-slider-response-response"></input>';
        html += '<div>'
        for(var j=0; j < trial.labels.length; j++){
            var width = 100/(trial.labels.length-1);
            var left_offset = (j * (100 /(trial.labels.length - 1))) - (width/2);
            html += '<div style="display: inline-block; position: absolute; left:'+left_offset+'%; text-align: center; width: '+width+'%;">';
            html += '<span style="text-align: center; font-size: 80%;">'+trial.labels[j]+'</span>';
            html += '</div>'

        }

        html += '</div>';


        display_element.innerHTML = html;
        html += '</div>';
        html += '</div>';


        html += '</div>';
        html += '</div>';

        if (trial.prompt !== null){
            html += trial.prompt;
        }

        var response = {
            rt: null,
            response: null
        };
        var response_history = [];
        // store attentionResponse
        var attentionResponse = {
            rt: null,
            key: null
        };


        // make the parameter in the timeline so you can store it

        // PASS IN THE TARGETBLUR PARAMETER FROM TIMELINE
        document.querySelector("#targetimg").style.filter = "blur(" + trial.targetBlur + "px)";
        document.querySelector("#key").style.filter = "blur(" + 5 + "px)";

        display_element.querySelector('#jspsych-image-slider-response-response').addEventListener('mousemove', function() {
            response.response = display_element.querySelector('#jspsych-image-slider-response-response').value;
            var last_response = null;
            if (response_history.length == 0) {
                response_history.push(response.response, performance.now());
                last_response = parseFloat(response_history[0][0]);
                console.log(last_response);
                console.log(response_history);
            }
            if (Math.abs(parseFloat(response.response) - last_response > 5)) {
                response_history.push([response.response, performance.now()]);
                last_response = parseFloat(response_history[response_history.length - 1][0]);
                console.log(last_response);
            }
            document.querySelector("#key").style.filter = "blur("+ response.response + "px)";
            // console.log(document.querySelector("#key"))
        });

        display_element.querySelector('#jspsych-image-slider-response-next').addEventListener('click', function() {
            // measure response time
            var endTime = performance.now();
            response.rt = endTime - startTime;
            response.response = display_element.querySelector('#jspsych-image-slider-response-response').value;

            if(trial.response_ends_trial){
                end_trial();
            } else {
                display_element.querySelector('#jspsych-image-slider-response-next').disabled = true;
            }
        });


        // function to handle responses by the subject
        var after_response = function(info) {
            // only record the first response
            if (attentionResponse.key == null) {
                attentionResponse = info;
            }

            if (trial.attention_response_ends_trial) {
                end_trial();
            }
        };

        // start the response listener
        if (trial.choices != jsPsych.NO_KEYS) {
            var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
                callback_function: after_response,
                valid_responses: trial.choices,
                rt_method: 'performance',
                persist: false,
                allow_held_key: false
            });
        };


        // FUNCTION TO END THE TRIAL WHEN IT IS TIME
        function end_trial(){
            jsPsych.pluginAPI.clearAllTimeouts();

            // kill keyboard listeners
            if (typeof keyboardListener !== 'undefined') {
                jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
            }

            // save data
            var trialdata = {
                "target_stimulus": trial.target_stimulus,
                "test_stimulus": trial.test_stimulus,
                "target_blur": trial.targetBlur,
                "blur_rt": response.rt,
                "blur_response": response.response,
                "attention_probe": trial.attentionProbe,
                "attention_delay": trial.attentionProbeDelay,
                "attention_duration" : trial.attentionProbeDuration,
                "attention_rt": attentionResponse.rt,
                "attention_response": attentionResponse.key,

            };

            display_element.innerHTML = '';

            // TESTING DATA COLLECTION
            // console.log(trialdata);
            // console.log(response.response);
            // console.log(attentionResponse.rt);
            // console.log(attentionResponse.key);

            // next trial
            jsPsych.finishTrial(trialdata);
        }

        if (trial.stimulus_duration !== null) {
            jsPsych.pluginAPI.setTimeout(function() {
                display_element.querySelector('#jspsych-image-slider-response-stimulus').style.visibility = 'hidden';
            }, trial.stimulus_duration);
        }

        // end trial if trial_duration is set
        if (trial.trial_duration !== null) {
            jsPsych.pluginAPI.setTimeout(function() {
                end_trial();
            }, trial.trial_duration);
        }

        var startTime = performance.now();
    };


    return plugin;

})();
