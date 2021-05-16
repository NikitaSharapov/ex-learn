class Router {
  constructor(routes) {
    this.routes = routes
    this.init()
  }

  pages = {};

  init() {
    const keys = Object.keys(this.routes);
    for (let index = 0; index < keys.length; index++) {
      const element = keys[index];
      this.getPage(element);
    }
  }

  node = document.getElementById("router");

  getPage(route) {
    return fetch(`/pages/${this.routes[route]}`)
    .then(res => res.text())
    .then(res => {
      this.pages[route]=res
    })
  }

  async navigate(to) {
    if(this.pages.hasOwnProperty(to)) {
      window.history.pushState({}, to, this.routes[to]);
      this.node.innerHTML=this.pages[to];
    }
    else {
      await this.getPage(to);
      this.node.innerHTML=this.pages[to];
    }
  }
  getInitialRoute() {
    return window.location.pathname.split('/').pop().replace('.html', '');
  }
}

const router = new Router({
  index: "index.html",
  booking: "booking.html",
  seat: "seat.html",
  search: "search.html"
});

router.navigate(router.getInitialRoute());
