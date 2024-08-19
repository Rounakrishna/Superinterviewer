document.addEventListener('DOMContentLoaded', function () {
  let recognition;
  let chosenTopic = "";
  let questionIndex = 0;
  let questions = [
    "Tell me about yourself.",
    "What are your strengths?",
    "Why do you want to work here?",
    "Where do you see yourself in 5 years?"
  ];

  // Start voice recognition
  document.getElementById('startButton').addEventListener('click', function() {
    document.getElementById('videoElement').play();
    this.disabled = true;
    document.getElementById('endButton').disabled = false;
    askNextQuestion();
  });

  // End voice recognition
  document.getElementById('endButton').addEventListener('click', function() {
    document.getElementById('videoElement').pause();
    stopRecognition();
    this.disabled = true;
    document.getElementById('startButton').disabled = false;
  });

  // Choose topic
  document.querySelector('.dropdown-toggle').addEventListener('click', function() {
    const topic = prompt("Please enter the topic for AI feedback:");
    if (topic) {
      chosenTopic = topic;
      document.querySelector('.dropdown-menu').innerHTML = `<a href="#">${chosenTopic}</a>`;
      document.getElementById('feedbackText').textContent = `Topic chosen: ${chosenTopic}`;
    }
  });

  function askNextQuestion() {
    if (questionIndex < questions.length) {
      speakText(questions[questionIndex], function() {
        startRecognition();
      });
    } else {
      document.getElementById('feedbackText').textContent += "<p>Interview completed!</p>";
    }
  }

  function startRecognition() {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = processRecognitionResult;
    recognition.start();
  }

  function stopRecognition() {
    if (recognition) {
      recognition.stop();
    }
  }

  function processRecognitionResult(event) {
    let transcript = event.results[0][0].transcript;
    sendTextToServer(transcript);
    stopRecognition();
  }

  function sendTextToServer(text) {
    fetch('/interview/ask-question/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken') // Adjust if you have a different way to handle CSRF tokens
      },
      body: JSON.stringify({ user_answer: text, topic: chosenTopic })
    })
    .then(response => response.json())
    .then(data => {
      displayFeedback(data.corrected_answer, data.feedback_points);
      questionIndex++;
      askNextQuestion();
    })
    .catch(error => {
      displayFeedback(`Error: ${error}`);
    });
  }

  function displayFeedback(correctedAnswer, feedbackPoints) {
    document.getElementById('feedbackText').innerHTML += `<p><strong>Corrected Answer:</strong> ${correctedAnswer}</p>`;
    document.getElementById('feedbackText').innerHTML += `<p><strong>Feedback:</strong> ${feedbackPoints}</p>`;
  }

  function speakText(text, callback) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.onend = function() {
      if (callback) callback();
    };
    window.speechSynthesis.speak(speech);
  }

  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }
});
