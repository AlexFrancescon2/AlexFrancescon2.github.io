// Create class Answer
class Answer {
    constructor(id, text) {
      this.id = id;
      this.text = text;
    }
  }

// Create class AnsweredQuestions
class AnsweredQuestions {
    constructor(answerId, amount) {
      this.answerId = answerId;
      this.amount = amount;
    }
  }

// Init variables
var title = '';
var answers = [];
var answerProgressiveId = 1;
var answeredQuestions = [];
var chart;
var chartIsActive = false;
var chartSteps = 1;
var chartStepTreshold = 10;


// Exec on document ready
$(function() {

    // Add listener to title
    $('#title').on('change keyup', function() {
        var value = $(this).val();
        handleTitle(value);
    });

    // Add listener to "addAnswer" input
    $('#addAnswer').on('change keyup', function(element) {
        var value = $(element.currentTarget).val();
        if(!value || value.length > 80) {
            // Disable button
            $('#addAnswerButton').attr('disabled', true).addClass('disabled');
        } else {
            // Enable button
            $('#addAnswerButton').attr('disabled', false).removeClass('disabled');
        }
    });

    // Add listener to "add new answer" button
    $('#addAnswerButton').on('click', function() {
        addNewAnswer();
    });

    // Add listener to "vote" button
    $('#vote').on('click', function() {
        vote();
    });

    // Add listener to "reset" button
    $('#reset').on('click', function() {
        reset();
    });

    // Add listener to "simulate" button
    $('#simulate').on('click', function() {
        simulate();
    });

});

// Handle poll title
function handleTitle(value) {
    if (!value) {
        // Clean input 
        title = '';
        $('#title').val('');
        $('.questionTitle').html('');
    } else {
        title = value;
        $('.questionTitle').html(title);
    }
    
    handleComponentsStatus();
}

// Add new answer to "answer" array
function addNewAnswer() {
    // Count answers - prevent DOM manipulation
    var answersCount = answers.length
    if (answersCount >= 10) {
        return false;
    }

    // get value and validate
    var value = $('#addAnswer').val();
    if (!value || value.length > 80) {
        var title = 'Invalid value';
        var content = 'The provided value is invalid.'
        popup(title, content, false);
        return false;
    }
    answers.push(new Answer(answerProgressiveId, value));
    answerProgressiveId++;

    // generate answers in the dom
    generateAnswersInDom();
    generateRadioAnswersInDom();

    // If answers are 10, disable add button.
    if (answersCount+1 === 10) {
        $('#addAnswerButton').attr('disabled', true).addClass('disabled');
    }

    // Clean input And focus
    $('#addAnswerButton').attr('disabled', true).addClass('disabled');
    $('#addAnswer').val('').focus();
    

    handleComponentsStatus();
}

// Generate answers in the DOM (first section)
function generateAnswersInDom() {
    $('.owner-questions').empty();
    var html = '';
    answers.forEach(
        (answer) => {
            html+= '<div class="col-12">' +
                         '<div class="input-group mt-3">' +
                            '<input type="text" data-id="' + answer.id + '" value="' + answer.text + '" class="form-control form-control-sm uploaded-answer" placeholder="Type an answer in here!" maxlength="80">' +
                            '<div class="input-group-append">' + 
                                '<button class="btn btn-outline-danger btn-sm d-flex justify-content-center align-items-center remove-answer" type="button" title="remove a question" data-id="' + answer.id + '">' +
                                    '<svg style="width:21px;height:21px" viewBox="0 0 24 24">' +
                                        '<path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />' +
                                    '</svg>' +
                                '</button>' + 
                            '</div> <!-- .input-group-append -->' +
                        '</div> <!-- .input-group -->' +
                        '<span class="error"></span>' + 
                    '</div> <!-- .col -->';
        }
    );

    $('.owner-questions').html(html);

    // add listener to the buttons
    $('.remove-answer').on('click', (element)=> {
        var id = $(element.currentTarget).attr('data-id');
        if (!id) {
            var title = 'Impossible to find the answer';
            var content = 'The answer that are you trying to remove has not be found. Try later and, if the problem persists, contact the technical support.'
            popup(title, content, false);
            return false;

        }
        removeAnswer(+id);
        generateAnswersInDom();
        generateRadioAnswersInDom();
        handleComponentsStatus();
    });

    // Add listener to the input
    $('.uploaded-answer').on('change keyup', (element)=> {
        var id = $(element.currentTarget).attr('data-id');
        var newValue = $(element.currentTarget).val();
        if (newValue && newValue !== '') {
            if (!id) {
                var title = 'Impossible to find the answer';
                var content = 'The answer that you are trying to modify has not be found. Try later and, if the problem persists, contact the technical support.'
                popup(title, content, false);
                return false;
            }
            // Update element with ID
            updateAnswer(id, newValue);
            generateRadioAnswersInDom();
            handleComponentsStatus();
            if (chartIsActive) {
                updatePoll();
            }
            $(element.currentTarget).parent().siblings('.error').empty();
        } else if (newValue === '') {
            // show the user that it's impossible to leave this input void
            $(element.currentTarget).parent().siblings('.error').html('Invalid data. Please insert a value.');
        }
    });
}

// Generate radio answers in the DOM (second section)
function generateRadioAnswersInDom() {
    $('.questions-radio-wrapper').empty();
    var html = '';
    answers.forEach(
        (answer) => {
            html+= '<div class="col-12">' +
                        '<div class="form-check">' +
                         ' <input class="form-check-input" type="radio" name="question" id="question-' +  answer.id + '" value="' + answer.id + '">' +
                            ' <label class="form-check-label" for="question-' +  answer.id + '">' +
                                answer.text + 
                            '</label>' +
                        '</div>' +
                    '</div>';
        }
    );

    // Paste HTML
    $('.questions-radio-wrapper').html(html);

    // attach listener 
    $('input[type="radio"]').on('change', function() {
        var checkedValue = $('input[name=question]:checked').val();
        if (checkedValue) {
            // Undisable button 
            $('#vote').attr('disabled', false).removeClass('disabled');
        } else {
            // Disable button 
            $('#vote').attr('disabled', true).addClass('disabled');
        }
    });


    handleComponentsStatus();
}

// Remove an element from the answer array
function removeAnswer(id) {
    // remove answer from answer array
    var newArray = answers.filter(answer => {
        return answer.id != id;
      })
    answers = newArray;

    // remove answer from answeredQuestions array
    var newArrayTwo = answeredQuestions.filter(answer => {
        return answer.answerId != id;
      })
      answeredQuestions = newArrayTwo;

      // Update poll 
      if (chartIsActive) {
        updatePoll();
      }

      handleComponentsStatus();
      

}

// Update element (answer) By give ID
function updateAnswer(id, newValue) {
    //Find index of specific object using findIndex method.    
    var answerIndex = answers.findIndex((answer => answer.id == id));
    answers[answerIndex].text = newValue;
    generateRadioAnswersInDom();
    handleComponentsStatus();
}

// init poll
function initPoll() {
    // Merge answers 
    var mergedAnswers = answers.map(answer => ({...answer, ...answeredQuestions.find(
        answeredQuestion => answeredQuestion.answerId === answer.id
        )}));

    // Create labels and data values. Take just voted answers (amount > 1)
    var labels = [];
    var data = [];
    mergedAnswers.forEach(
        element => {
            if (element.amount > 0) {
                labels.push(element.text.length > 25 ? element.text.slice(0, 22) + '...' : element.text);
                data.push(element.amount);
            }
        }
    );

    // create poll
    var ctx = document.getElementById('poll').getContext('2d');
    chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'bar',

        // The data for our dataset
        data: {
            labels: labels,
            datasets: [{
                label: 'votes',
                backgroundColor: '#36a8be',
                borderColor: '#36a8be',
                data: data
            }]
        },
        // Configuration options go here
        options: {
            legend: {
                display: false
            },
            tooltips: {
                callbacks: {
                   label: function(tooltipItem) {
                          return tooltipItem.yLabel;
                   }
                }
            },
            maintainAspectRatio: false,
            responsive: true,
            scales: {
                yAxes: [{
                    stacked: true,
                     ticks: {
                        min: 0,
                        stepSize: 1,
                    }
      
                }]
            }
        }
    });

    // Set chart active to true
    chartIsActive = true;
}

// update poll
function updatePoll() {

    // Merge answers 
    var mergedAnswers = answers.map(answer => ({...answer, ...answeredQuestions.find(
        answeredQuestion => answeredQuestion.answerId === answer.id
    )}));
    var increase = false;

    // Create labels and data values. Take just voted answers (amount > 1)
    var labels = [];
    var data = [];
    mergedAnswers.forEach(
        element => {
            if (element.amount > 0) {
                labels.push(element.text.length > 25 ? element.text.slice(0, 22) + '...' : element.text);
                data.push(element.amount);
                // Update dynamically chart steps.
                if (element.amount >= chartStepTreshold) {
                    increase = true;
                    chartSteps = chartStepTreshold;
                    chartStepTreshold = parseInt(chartStepTreshold * (0.5));
                }
            }
        }
    );

    chart.data.datasets[0].data = data; 
    chart.data.labels = labels; 
    if (increase) {
        chart.options.scales.yAxes[0].ticks.stepSize = chartSteps;
    }
    chart.update({
        duration: 800,
        easing: 'easeOutBounce'
    }); 

    handleComponentsStatus();
}

// vote
function vote() {
    var answerId = +$('input[name=question]:checked').val();
    if (!answerId) {
        var title = 'Impossible to find the answer';
        var content = 'The answer that you are trying to vote has not be found. Try later and, if the problem persists, contact the technical support.'
        popup(title, content, false);
        return false;
    }

    // Check if the answerId is already present in AnsweredQuestions.
    // If present, increment the count. Otherwise, create new AnsweredQuestions.
    const index = answeredQuestions.findIndex((answeredQuestion => +answeredQuestion.answerId === +answerId));
    if (index >= 0) {
        // Anwer exsits. Increment the value
        answeredQuestions[index].amount++;
    } else {
        // It's new. Let's add it into the array
        answeredQuestions.push(new AnsweredQuestions(+answerId, 1));
    }

    // If there is the first answer, init the poll. Otherwise, update poll.
    if (answeredQuestions.length === 1 && !chartIsActive) {
        initPoll();
    } else if (answeredQuestions.length > 0) {
        updatePoll();
    }

    // Clean all radio
    $('[type="radio"]').prop('checked', false);
    // Disable button 
    $('#vote').attr('disabled', true).addClass('disabled');

    handleComponentsStatus();

}

// Fire a popup
function popup(title, content, nextAction) {
    var html = '<div class="modal fade" id="modal" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">' +
    '<div class="modal-dialog" role="document">' +
      '<div class="modal-content">' + 
        '<div class="modal-header">' + 
          '<h5 class="modal-title" id="modalLabel">' + title + '</h5>' + 
          '<button type="button" class="close" data-dismiss="modal" aria-label="Close">' + 
            '<span aria-hidden="true">&times;</span>' + 
          '</button>' +
        '</div>' + 
        '<div class="modal-body">' +
        content + 
        '</div>' +
        '<div class="modal-footer">' + 
          '<button type="button" class="btn btn-custom-danger" data-dismiss="modal">Close</button>';
        if(nextAction) {
            html += '<button type="button" class="btn btn-custom" id="accept">Accept</button>';
        }
    html += '</div>' + 
      '</div>' + 
    '</div>' + 
  '</div>';

  $('#popup-container').html(html);
  $('#modal').modal('show');
}

// Reset everything
function reset () {
    var title = 'Reset APP';
    var content = 'By clicking on "Accept" button, you will restore the application to its initial state.<br>Are you sure you want to proceed? <br> This operation is irreversible.';
    popup(title, content, true);

    // Attach listener to "accept" button
    $('#accept').on('click', () => {
        // Clean everything.
        title = '';
        answers = [];
        answeredQuestions = [];
        if (chartIsActive) {
            chartIsActive = false;
            chartSteps = 1;
            chartStepTreshold = 10;
            chart.destroy();
        }
        handleTitle('');
        $('#addAnswer').val('');
        generateAnswersInDom();
        generateRadioAnswersInDom();
        $('#modal').modal('hide');
        handleComponentsStatus();
    });
}

// Check and handle the global status of all the components. It gets fired everytime something changes
function handleComponentsStatus() {
    
    // Handle status of the components
    if (!title) {
        // If the title is not set, I hide the poll and the questions.
        $('.dynamic-content').addClass('d-none');
        $('.content-not-ready').removeClass('d-none');
    } else if(answers.length < 2) {
        // If the answers (from owner) are not at least 2, hide the questions and the poll. 
        $('.dynamic-content').addClass('d-none');
        $('.content-not-ready').removeClass('d-none');
    } else if(answeredQuestions.length < 1) {
        // if the there is not any answered question, hide the poll
        $('.dynamic-content.answers').removeClass('d-none');
        $('.content-not-ready.answers').addClass('d-none');
        $('.dynamic-content.poll').addClass('d-none');
        $('.content-not-ready.poll').removeClass('d-none');
    } else {
        $('.dynamic-content').removeClass('d-none');
        $('.content-not-ready').addClass('d-none');
    }

    // Handle status of the "add-remove" question inputs and button
    if (answers.length >= 10) {
        // disable input and button
        $('#addAnswerButton').attr('disabled', true).addClass('disabled');
        $('#addAnswer').attr('disabled', true).addClass('disabled');
        $('#answersCounter').html(answers.length);
    } else {
        // Undisable input and button
        $('#addAnswer').attr('disabled', false).removeClass('disabled');
        $('#answersCounter').html(answers.length);
    } 
}

// simulate processes between component
function simulate() {
    title = 'What color was the white horse of Napoleon?'
    answers = [
        new Answer(1, 'White'),
        new Answer(2, 'Yellow'),
        new Answer(3, 'Red'),
        new Answer(4, 'Violet'),
        new Answer(5, 'Green'),
        new Answer(6, 'Gray'),
        new Answer(7, 'Brown'),
        new Answer(8, 'Transparent'),
        new Answer(9, 'Black'),
        new Answer(10, 'Blue'),
    ];
    answeredQuestions = [];

    $('#title').val(title);
    handleTitle(title);
    if (chartIsActive) {
        chartIsActive = false;
        chartSteps = 1;
        chartStepTreshold = 10;
        chart.destroy();
    }
    initPoll();
    generateAnswersInDom();
    generateRadioAnswersInDom();
    handleComponentsStatus();
}