// Translation API: https://mymemory.translated.net

$(document).ready(()=>{
  console.log("Ready");
  // check if voice recognition is supported by browser
  try{
    // DOM elements
    const input = $("#input");
    const translation = $("#translation");
    const startBtn = $("#startTalking");

    let translationResult = "";
    
    // set default languages for voice recognition and translation
    let targetLang = "en";
    let sourceLang = "de";
    const dropdownSource = $("#dropdownSource");
    const dropdownTarget = $("#dropdownTarget")
    dropdownSource.html("Deutsch");
    dropdownTarget.html("English");
    
    // setup SpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.lang = sourceLang;
    
    // add list elements to the DOM
    for (let l of Object.keys(LANGUAGES)) {
      let newElement = `<li><a href='#'>${l}</a></li>`;
      $(".dropdown-menu").append(newElement);
    }

    // add event listeners to the list elements
    for (let language of $("#targetLanguage li")) {
      language.addEventListener("click", ()=>{
        let key = language.textContent;
        targetLang = LANGUAGES[key];
        dropdownTarget.html(key);
      });
    }
    for (let language of $("#sourceLanguage li")) {
      language.addEventListener("click", ()=>{
        let key = language.textContent;
        sourceLang = LANGUAGES[key];
        dropdownSource.html(key);
        recognition.lang = sourceLang;
      });
    }

    startBtn.on("click", ()=>{
      // start a new speech recognition
      console.log("Start talking", recognition.lang);
      input.html("");
      translation.html("");
      startBtn.addClass("blinking")
      try {
        // check if recognition is not running already
        recognition.start();
      } catch(error) {
        // if it is running, stop the current recognition
        recognition.stop();
      }

    });

    function readOutLoud(message, lang) {
      // read message in the specified language
      const speech = new SpeechSynthesisUtterance();
      speech.volume = 1;
      speech.rate = 1;
      speech.pitch = 1;
      speech.text = message;
      speech.lang = lang;

      window.speechSynthesis.speak(speech);
    }
    
    async function translate(message) {
      // pass the message to the mymemory API for translation
      // the free version of this API is limited to 1000 words per day
      // return the translated result
      console.log("Input: ", message)
      // query to the API is limited to 500 chars -> trim message before passing to API
      message = message.substr(0,500);
      if (message != "" && sourceLang!=targetLang) {
        let url = `https://api.mymemory.translated.net/get?q=${encodeURI(message)}&langpair=${sourceLang}|${targetLang}`;
        
        let response = await fetch(url);
        let json = await response.json();
        let result = json.responseData.translatedText;
        // check if max number of translations was reached
        if (response.ok) {
          console.log("Translation: ", result)
          return result;
        } else {
          let regex = /(\d\d)/g;
          let m = result.match(regex);
          $("#diagnostics").html(`You used all available free translations for today.<br/> Try again in ${m[0]} hours, ${m[1]} minutes, ${m[2]} seconds.`)
        }
        
      }
      return ""
    }


    recognition.onresult = async function(event) {
      // extract the recognized text from the event
      // display the text
      // pass the text to the translate function
      // display the translation
      // read out the translation
      const current = event.resultIndex;
      const text = event.results[current][0].transcript;
      input.text(text);
      if (event.results[0].isFinal) {
        startBtn.removeClass("blinking");
        let result = await translate(text);
        if (result) {
          translation.text(result);
          readOutLoud(result, targetLang);
        }
      }
    }

    recognition.onend = function() {
      startBtn.removeClass("blinking");
    }
    
  } catch(error) {
    // display error message if speech recognition is not supported by the browser
    console.log("Not supported");
    $("body").empty();
    let noSupportMessage = `
                            <h1>
                              Your Browser does not support speech recognition.<br/>
                              Please switch to Google Chrome.
                            </h1>
                            `
    $("body").append(noSupportMessage)
  }
});