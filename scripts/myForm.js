state = {}


router.onNavigate('index', () => {
  const form = document.querySelector('#form');
  console.log(form)
  form.addEventListener("submit", getData);
  function getData( event ) {
    event.preventDefault(); // отменяем действие события по умолчанию
    const data = Object.fromEntries(new FormData(form).entries())
    state.form = data;
    router.navigate('booking');
  }
})

router.onNavigate('booking', () => {
  console.log(state)
})