// parameters needed:
// add attentionProbe, attentionProbeDuration, attentionProbeDelay to the timeline (for each trial)


jsPsych.plugins['jspsych-blurry-word'] = (function(){

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('image-slider-response', 'stimulus', 'image');


  plugin.info = {
    name: 'jspsych-blurry-word',
    description: '',
    parameters: {

    fixed_stimulus: {
          type: jsPsych.plugins.parameterType.STRING,
          pretty_name: 'Fixed Stimulus',
          default: undefined,
          description: 'The image to be displayed but not adjusted'
    },

      stimulus: {
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
    }
  }

  plugin.trial = function(display_element, trial) {

    var html = '<div id="jspsych-image-slider-response-wrapper" style="margin: 100px 0px;">';
    html += '<div id="jspsych-image-slider-response-fixed_stimulus"><img id="promptimg" src="' + trial.fixed_stimulus + '"></div>';

    html += '<img src = "fixationcrosses/fixsmaller.png" >'

    html += '<div id="jspsych-image-slider-response-stimulus"><img id="key" src="' + trial.stimulus + '" style="blur: 5px"></div>';
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
    html += '</div>';
    html += '</div>';

    if (trial.prompt !== null){
      html += trial.prompt;
    }

    // add submit button
    html += '<button id="jspsych-image-slider-response-next" class="jspsych-btn">'+trial.button_label+'</button>';

    // adding attention probe
    if(trial.attentionProbe == "up"){
        html += '<div id="attnProbe" style="visibility: hidden; position: absolute; z-index:100;">'
    } else if(trial.attentionProve == "down"){
        html += '<div id="attnProbe" style="visibility: hidden; position: absolute; z-index:100;">'
    }
    if(trial.attentionProbe == "up" || trial.attentionProbe == "down"){
        html += '<img src = "attnProbe.png"></div>';
        html += '</div>'
    }

    display_element.innerHTML = html;

    if(trial.attentionProbe == "up" || trial.attentionProbe == "down"){
        setTimeout(function(){
            document.querySelector('#attnProbe').style.visibility = "visible";
            setTimeout(function(){
                document.querySelector('#attnProbe').style.visibility = "hidden";
            }, trial.attentionProbeDuration);
        }, trial.attentionProbeDelay)
    }

    var response = {
      rt: null,
      response: null
    };

    // make the parameter in the timeline so you can store it

    // PASS IN THE PROMPTBLUR PARAMETER FROM TIMELINE
    document.querySelector("#promptimg").style.filter = "blur(" + "5" + "px)";
    display_element.querySelector('#jspsych-image-slider-response-response').addEventListener('mousemove', function() {
      response.response = display_element.querySelector('#jspsych-image-slider-response-response').value;

      // console.log(response.response)
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

    function end_trial(){

      jsPsych.pluginAPI.clearAllTimeouts();

      // save data
      var trialdata = {
        "rt": response.rt,
        "response": response.response
      };

      display_element.innerHTML = '';

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
