// import icons from `../img/icons.svg` //! parcel 1
// import icons from 'url:../img/icons.svg'; //! parcel 2
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';
// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    //* 0) Update results view to mark selected search result

    resultsView.update(model.getSearchResultsPage(1));

    //* 1) Updating the bookmarks
    bookmarksView.update(model.state.bookmarks);

    //* 2) Render Spinner
    recipeView.renderSpinner();

    //* 3) Loading recipe
    await model.loadRecipe(id);

    //* 4) Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    //* 1) Get search results
    const query = searchView.getQuery();
    if (!query) return;

    //* 2) Load search results
    await model.loadSearchResults(query);

    //* 3) Render Serach results
    // resultsView.render(model.state.search.results); //* all results
    resultsView.render(model.getSearchResultsPage(1)); //* This makes sure that everytime a new seach is made the page starts from 1

    //* 4) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(`${err} 💥`);
    // throw err;
  }
};

const controlPagination = function (goToPage) {
  //* Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  //* Render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServing = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);
  // Update the recipe view

  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddNewBookmark = function () {
  //* 1) Add or remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  //
  else model.deleteBookmark(model.state.recipe.id);

  //* 2) Update recipe view
  recipeView.update(model.state.recipe);

  //* 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newReceipe) {
  try {
    //Show loading spinner
    addRecipeView.renderSpinner();

    //Upload the new recipe data
    await model.uploadRecipe(newReceipe);
    console.log(model.state.recipe);

    //Render recipe
    recipeView.render(model.state.recipe);

    //Success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL

    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //Close form window
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(`💥`, err);
    addRecipeView.renderError(err.message);
  }
};

//* IFFE
(function () {
  bookmarksView.addHanlderRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServing);
  recipeView.addHandlerAddBookMark(controlAddNewBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  console.log(`Welcome!`);
})();

// fetch(`https://forkify-api.jonas.io/api/v2/recipes/5ed6604591c37cdc054bc886`)
