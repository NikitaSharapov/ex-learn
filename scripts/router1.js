
//класс роутинга
class Router {
  constructor(routes){
    //принимаем роут как параметр и присваеваем его полю класса 
    this.routes = routes
    // указываем функцию инит чтобы она вызвалась при создании экземпляра
    this.init()
  }
  // поле класса с пустым объектом страниц
  pages = {};

  pageListents = {};

  onNavigate(to, callback) {
    if (this.pageListents.hasOwnProperty(to)) {
      this.pageListents[to].push(callback);
    }
    else {
      this,this.pageListents[to] = [callback]
    }
  }

  init() {
    // получаем массив из знаений поля роутес
    const keys = Object.keys(this.routes);
    //перебираем массив
    for (let index =0; index < keys.length; index++) {
      const elem = keys[index];
      this.getPage(elem);
    }
  }
  // указываем элмент куда рендерить страницы 
  node = document.getElementById('router');
//получение нужной страницы и складываение в поле обеккта страниц
  getPage(route) {
    return fetch(`/pages/${this.routes[route]}`)
    .then(res => res.text())
    .then(res => {
      this.pages[route]=res
    })
  }

  navigateBroadcast(to) {
    if (this.pageListents[to]) {
      this.pageListents[to].forEach(callback => (callback()));
    }
  }

  // функция навигации
  async navigate(to) {
    // проверка на существования 
    if(this.pages.hasOwnProperty(to)) {
      //добавляет в урл нужный роут
      window.history.pushState({}, to, this.routes[to]);
      //рисует выбранную страницу в выбранный элемент нод
      this.node.innerHTML=this.pages[to];
    }
    else {
      // дожидаемся поля куда 
      await this.getPage(to);
      this.node.innerHTML=this.pages[to];
    }

    this.navigateBroadcast(to)
  }
  //метод который запрашивает ключ нужной страницы из ссылки для рендера начального роута
  getInitialRoute() {
    return window.location.pathname.split('/').pop().replace('.html' , '');
  }
}
() => {
  const form = document.querySelector('#form');
  console.log(form)
  form.addEventListener("submit", getData);
  function getData( event ) {
    event.preventDefault(); // отменяем действие события по умолчанию
    const data = Object.fromEntries(new FormData(form).entries())
    state.form = data;
    router.navigate('booking');
  }
}
//экземпляр класса с объектом страниц 
const router = new Router({
  index: "index.html",
  booking: "booking.html",
  seat: "seat.html",
  search: "search.html"
});
// вызов функции навигате у экз класса в него мы передаём метод у класса который запрашивает ключ нужной страницы из ссылки 
router.navigate(router.getInitialRoute());