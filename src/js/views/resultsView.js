import view from './view.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';
class ResultsView extends view {
  _parentElement = document.querySelector('.results');
  _errorMessage = `No recipies found for your query! Please try again :)`;
  _message = ``;

  _generateMarkUp() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultsView();
