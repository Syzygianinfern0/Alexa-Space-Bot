/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');
const cookbook = require('./alexa-cookbook.js');

//=========================================================================================================================================
//TODO: The items below this comment need your attention.
//=========================================================================================================================================

const SKILL_NAME = 'Space Facts';
const GET_FACT_MESSAGE = 'Here\'s your fact: ';
const HELP_MESSAGE = 'You can say tell me a space fact, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const FALLBACK_MESSAGE = 'The Space Facts skill can\'t help you with that.  It can help you discover facts about space if you say tell me a space fact. What can I help you with?';
const FALLBACK_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';

//=========================================================================================================================================
//TODO: Replace this data with your own.  You can find translations of this data at http://github.com/alexa/skill-sample-nodejs-fact/tree/en-US/lambda/data
//=========================================================================================================================================

const data = [
  //'A year on Mercury is just 88 days long.',
  // 'Despite being farther from the Sun, Venus experiences higher temperatures than Mercury.',
  // 'Venus rotates counter-clockwise, possibly because of a collision in the past with an asteroid.',
  // 'On Mars, the Sun appears about half the size as it does on Earth.',
  // 'Earth is the only planet not named after a god.',
  // 'Jupiter has the shortest day of all the planets.',
  // 'The Milky Way galaxy will collide with the Andromeda Galaxy in about 5 billion years.',
  // 'The Sun contains 99.86% of the mass in the Solar System.',
  // 'The Sun is an almost perfect sphere.',
  // 'A total solar eclipse can happen once every 1 to 2 years. This makes them a rare event.',
  // 'Saturn radiates two and a half times more energy into space than it receives from the sun.',
  // 'The temperature inside the Sun can reach 15 million degrees Celsius.',
  // 'The Moon is moving approximately 3.8 cm away from our planet every year.',
  'One million Earths could fit inside the sun – and the sun is considered an average-size star.',
  'For years it was believed that Earth was the only planet in our solar system with liquid water. More recently, NASA revealed its strongest evidence yet that there is intermittent running water on Mars, too!',
  'Comets are leftovers from the creation of our solar system about 4.5 billion years ago – they consist of sand, ice and carbon dioxide.',
  'You wouldn’t be able to walk on Jupiter, Saturn, Uranus or Neptune because they have no solid surface!',
  'If you could fly a plane to Pluto, the trip would take more than 800 years!',
  'Space junk is any human-made object orbiting Earth that no longer serves a useful purpose. Scientists estimate there are about 500,000 pieces of space junk today, including fragments from rockets and satellites, and everyday items like spanners dropped during construction of the International Space Station!',
  'An asteroid about the size of a car enters Earth’s atmosphere roughly once a year – but it burns up before it reaches us. Phew!',
  'he highest mountain known to man is on an asteroid called Vesta. Measuring a whopping 22km in height, it is three times as tall as Mount Everest!',
  'There are more stars in the universe than grains of sand on all the beaches on Earth. That’s at least a billion trillion!',
  'The sunset on Mars appears blue.',
];

//=========================================================================================================================================
//Editing anything below this line might break your skill.
//=========================================================================================================================================

const GetNewFactHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest'
      || (request.type === 'IntentRequest'
        && request.intent.name === 'GetNewFactIntent');
  },
  handle(handlerInput) {
    const randomFact = cookbook.getRandomItem(data);
    const speechOutput = GET_FACT_MESSAGE + randomFact;

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .withSimpleCard(SKILL_NAME, randomFact)
      .getResponse();
  },
};

const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(HELP_MESSAGE)
      .reprompt(HELP_REPROMPT)
      .getResponse();
  },
};

const FallbackHandler = {
  // 2018-May-01: AMAZON.FallbackIntent is only currently available in en-US locale.
  //              This handler will not be triggered except in that locale, so it can be
  //              safely deployed for any locale.
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.FallbackIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(FALLBACK_MESSAGE)
      .reprompt(FALLBACK_REPROMPT)
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(STOP_MESSAGE)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, an error occurred.')
      .reprompt('Sorry, an error occurred.')
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    GetNewFactHandler,
    HelpHandler,
    ExitHandler,
    FallbackHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
