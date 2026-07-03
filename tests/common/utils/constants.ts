export const SharedTestingConstants = {
  // Regex matchers for loading states
  loadingState: /loading/i,
  searchingState: /searching/i,

  // Regex matchers for error states
  errorState: /error/i,
  notFoundState: /not found/i,

  // Generic interactions
  searchButton: /search/i,
  loadMoreButton: /load more/i,

  // Roles
  buttonRole: "button",
  linkRole: "link",
  headingRole: "heading",

  // TMDB mock related constants
  mockMovieTitle: "Inception",
  mockTrendingTitle: "Dune: Part Two",
} as const;
