const cart = () => {
  const cartBtn = document.querySelector('.button-cart'); // Кнопка для активации модального окна
  const cart = document.getElementById('modal-cart'); // Модальное окно
  const closeBtn = cart.querySelector('.modal-close'); // Кнопка закрытия модального окна
  const goodsContainer = document.querySelector('.long-goods-list'); // Окно с товаром
  const cartTable = document.querySelector('.cart-table__goods'); // Окно корзины
  const modalform = document.querySelector('.modal-form'); // Форма в модальном окне
  const totalPriceEl = document.querySelector('.card-table__total'); // Сумма всей корзины

  const formInputName = document.querySelector('[name="nameCustomer"]'); // input имени из модальной формы
  const formInputPhone = document.querySelector('[name="phoneCustomer"]'); // input телефона из модальной формы


  // функция удвления товара из корзины
  const deleteCartItem = (id) => {
    const cart = JSON.parse(localStorage.getItem('cart'));

    const newCart = cart.filter(good => {
      return good.id !== id;
    })

    localStorage.setItem('cart', JSON.stringify(newCart));
    renderCartGoods(JSON.parse(localStorage.getItem('cart')));
  };

  // Функция увеличения количества товаров в корзине
  const plusCartItem = (id) => {
    const cart = JSON.parse(localStorage.getItem('cart'));

    const newCart = cart.map((good) => {
      if (good.id === id) {
        good.count++;
      }
      return good;
    });

    localStorage.setItem('cart', JSON.stringify(newCart));
    renderCartGoods(JSON.parse(localStorage.getItem('cart')));
  };

  // Функция уменьшения колличества товаров в корзине
  const minusCartItem = (id) => {
    const cart = JSON.parse(localStorage.getItem('cart'));

    const newCart = cart.map((good) => {
      if (good.id === id) {
        if (good.count > 0) {
          good.count--;
        }
      }
      return good;
    });

    localStorage.setItem('cart', JSON.stringify(newCart));
    renderCartGoods(JSON.parse(localStorage.getItem('cart')));
  };

  // Сохранения товара в localStorage
  const addToCart = (id) => {
    const goods = JSON.parse(localStorage.getItem('goods'));
    const clickedGood = goods.find(good => good.id === id);
    const cart = localStorage.getItem('cart') ?
      JSON.parse(localStorage.getItem('cart')) : [];

    if (cart.some(good => good.id === clickedGood.id)) {
      cart.map(good => {
        if (good.id === clickedGood.id) {
          good.count++
        }
        return good;
      });
    } else {
      clickedGood.count = 1;
      cart.push(clickedGood);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
  }

  // Отрисовка товара в корзине
  const renderCartGoods = (goods) => {
    cartTable.innerHTML = ''

    goods.forEach(good => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${good.name}</td>
        <td>${good.price}$</td>
        <td><button class="cart-btn-minus"">-</button></td>
        <td>${good.count}</td>
        <td><button class=" cart-btn-plus"">+</button></td>
        <td>${+good.price * +good.count}$</td>
        <td><button class="cart-btn-delete"">x</button></td>
      `
      cartTable.append(tr);

      tr.addEventListener('click', (event) => {
        if (event.target.classList.contains('cart-btn-minus')) {
          minusCartItem(good.id);
        } else if (event.target.classList.contains('cart-btn-plus')) {
          plusCartItem(good.id);
        } else if (event.target.classList.contains('cart-btn-delete')) {
          deleteCartItem(good.id);
        }
      });
    });

    // Функция подсчета суммы корзины
    let totalPrice = 0;
    goods.forEach((item) => {
      const priceEl = item.price * item.count;
      totalPrice += priceEl;
    });
    totalPriceEl.innerText = totalPrice + '$';
  };

  const sandForm = (nameInput, phoneInput) => {
    const cartArray = localStorage.getItem('cart')
      ? JSON.parse(localStorage.getItem('cart'))
      : [];

    fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify({
        cart: cartArray,
        name: nameInput,
        phone: phoneInput,
      }),
    }).then(() => {
      formInputName.value = "";
      formInputPhone.value = "";
      localStorage.removeItem("cart");
      cart.style.display = "";
    });
  };

  modalform.addEventListener("submit", (e) => {
    e.preventDefault();

    const nameInput = formInputName.value;
    const phoneInput = formInputPhone.value;

    sandForm(nameInput, phoneInput);
  });

  // Функция вызова модального окна
  cartBtn.addEventListener('click', () => {
    const cartArray = localStorage.getItem('cart') ?
      JSON.parse(localStorage.getItem('cart')) : [];

    renderCartGoods(cartArray);

    cart.style.display = 'flex';
  })

  // Функция закрытия модального окна
  closeBtn.addEventListener('click', () => {
    cart.style.display = '';
  })

  // Функция закрытия окна по нажатию вне его
  cart.addEventListener("click", (e) => {
    if (!e.target.closest(".modal") && e.target.classList.contains("overlay")) {
      cart.style.display = "";
    }
  });

  // Функция закрытия окна при нажатии на Esc
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      cart.style.display = "";
    }
  });

  // Функция добавления товара в корзину при нажатии на кнопку с ценой
  if (goodsContainer) {
    goodsContainer.addEventListener('click', (event) => {
      if (event.target.closest('.add-to-cart')) {
        const buttonToCart = event.target.closest('.add-to-cart')
        const goodId = buttonToCart.dataset.id;

        addToCart(goodId);
      }
    });
  }
};

cart();