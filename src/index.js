import Api from "./author/Api"
window.indieauthor = { api: new Api(document.getElementById('palette'), document.getElementById('main-container'), () => {}) };
console.log(window.indieauthor);