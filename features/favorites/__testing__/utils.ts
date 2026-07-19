export const [
  // Not logged in or missing favorites
  WITH_NO_FAVORITES_TITLE = /No pinned Pairs yet/i,
  WITH_NO_FAVORITES_TEXT = /Pin a pair to track it's rate here. Tap the star icon on the conversion or comparison row/i,

  // Logged in and has some favorites
  WITH_FAVORITES_TITLE = /pin paired currencies/i,
  TOTAL_FAVORITES_COUNTS = /(Total count)(.*?)(favorites)/i,
  CLEAR_FAVORITES = /Clear all favorites/i,
] = [];
