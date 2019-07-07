# VoiceRecgnitionTranslator

Select a language that should be used for the voice recognition and a language that you want to translate into. Press the microphone button and start talking. The app will record your voice and attempt to translate the recorded message into the specified target language.

## Translation API
* This app uses the free version of the [mymemory API](https://mymemory.translated.net) to carry out translations. The API limits the translations to 1000 words per day. If you hit that limit, a message will be displayed, informing you how long you will have to wait.

## Browser Support
* At the time of development, the SpeechRecognition functionality of the Webspeech API is only supported by Chrome. Therefore, this app will not work in other browsers such as Firefox or Edge. For more information, check out the [documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) and the [examples](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API) on MDN.
