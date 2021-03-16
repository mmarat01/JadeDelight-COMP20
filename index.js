// address display toggle
const checkPickupOrDelivery = () => {
  const radioPDs = document.querySelectorAll(".radio-button");
  // spread NodeList returned by query into an array
  [...radioPDs].forEach((radio) => {
    // for each radiobutton, listen on change: started as inactive on pickup default
    radio.addEventListener("change", () => {
      const streetField = document.querySelector("#street");
      const cityField = document.querySelector("#city");
      streetField.classList.toggle("active");
      cityField.classList.toggle("active");
    });
  });
};

// item 'quan', individual cost, total cost field
class ItemInfo {
  constructor(quan, costEach, totalCost) {
    this.quan = quan;
    this.costEach = costEach;
    this.totalCost = totalCost;
  }
}

// build item info array
const buildItemInfoArr = () => {
  let itemInfoArr = [];
  for (let i = 0; i < menuItems.length; i++) {
    const quan = document.getElementsByName("quan" + i)[0];
    const totalCost = document.getElementsByName("cost")[i];
    totalCost.value = 0;
    const costEach = menuItems[i].cost;
    itemInfoArr.push(new ItemInfo(quan, costEach, totalCost));
  }
  return itemInfoArr;
};

// computations
const computeSubtotal = (items) => {
  let subtotal = 0;
  items.forEach((item) => {
    subtotal += Number(item.totalCost.value);
  });
  return subtotal.toFixed(2);
};

const computeTax = (subtotal) => {
  return (subtotal * 0.0625).toFixed(2);
};

const computeTotal = (subtotal, tax) => {
  return (subtotal + tax).toFixed(2);
};

const computeTime = (delivery) => {
  const orderTime = delivery ? 30 : 15;
  const currDate = new Date();
  const orderDate = new Date(currDate.getTime() + orderTime * 60000);
  return orderDate;
};

// dynamically change order values upon user selection
const setOrderValues = (items, subtotalField, taxField, totalField) => {
  items.forEach((item) => {
    const quan = item.quan;
    const costEach = item.costEach;
    const totalCost = item.totalCost;
    // listen on the <select> dropdown
    quan.addEventListener("change", () => {
      totalCost.value = Number(
        costEach * quan.options[quan.selectedIndex].text
      ).toFixed(2);
      subtotal.value = computeSubtotal(items);
      tax.value = computeTax(Number(subtotal.value));
      total.value = computeTotal(Number(subtotal.value), Number(tax.value));
    });
  });
};

// validators
const isEmpty = (str) => {
  return str == "";
};

const isValidPhone = (num) => {
  const pattern = /^\d{10}$/;
  return num.match(pattern);
};

// run
window.onload = () => {
  // address toggle
  checkPickupOrDelivery();

  // item infos
  let itemInfoArr = buildItemInfoArr();

  // run order value computations on each item: see selected quantity & do the math
  const subtotal = document.querySelector("#subtotal");
  const tax = document.querySelector("#tax");
  const total = document.querySelector("#total");

  setOrderValues(itemInfoArr, subtotal, tax, total);

  const summary = document.querySelector("#summary");
  const orderForm = document.querySelector("#order-form");

  // validation on submit
  orderForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let validOrder = true;
    summary.innerHTML = "";
    if (isEmpty(document.getElementsByName("lname")[0].value)) {
      summary.innerHTML += "<br /> Error: Please enter your last name";
      validOrder = false;
    }
    if (!isValidPhone(document.getElementsByName("phone")[0].value)) {
      summary.innerHTML += "<br /> Error: Please enter a valid phone number";
      validOrder = false;
    }
    if (
      document.querySelector("#delivery-radio").checked &&
      (isEmpty(document.getElementsByName("street")[0].value) ||
        isEmpty(document.getElementsByName("city")[0].value))
    ) {
      summary.innerHTML +=
        "<br /> Error: Please enter your full address for delivery";
      validOrder = false;
    }
    if (validOrder) {
      let orderDispatch = computeTime(
        document.querySelector("#delivery-radio").checked
      );
      alert(
        `Thanks for ordering from Jade Delight!\nYour total was $${total.value}.\n` +
          `Order dispatch: ${orderDispatch}`
      );
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  });
};
