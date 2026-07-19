export const [
  CONVERTER_TITLE = /Check the rate/i,
  SEND_HEADER = /Send rate/i,
  RECEIVE_HEADER = /Receive Rate/i,
  SWAPPER_TEXT = /(Swap send)(.*?)(and receive)(.*?)(currencies)/i,
  AMOUNT_LABEL = /Exchange amount/i,
  CHANGE_SEND_TRIGGER = /Change send currency/i,
  CHANGE_RECEIVE_TRIGGER = /Change receive currency/i,
  CURRENT_RATE = /Current rate for/i,
  ADD_FAVORITE_BUTTON = /Add to favorite/i,
  LOG_BUTTON = /Log conversion/i,

  // Initial phase
  INITIAL_SEND_USD = /Send rate \(USD\)/i,
  INITIAL_RECEIVE_EUR = /Receive rate \(EUR\)/i,
  INITIAL_SWAP_TEXT = /Swap send \(USD\) and receive \(EUR\) currencies/i,

  SEND_EUR_HEADING = /Send rate \(EUR\)/i,
  RECEIVE_USD_HEADING = /Receive rate \(USD\)/i,
  EUR_USD_SWAP_TEXT = /Swap send \(EUR\) and receive \(USD\) currencies/i,
] = [];
