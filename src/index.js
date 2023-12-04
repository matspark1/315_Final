// FIRE BASE
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBF1zJ1GlT5MNcwXnLR-fCTR6RYUKpv8E0",
  authDomain: "n315-matspark.firebaseapp.com",
  projectId: "n315-matspark",
  storageBucket: "n315-matspark.appspot.com",
  messagingSenderId: "433038809376",
  appId: "1:433038809376:web:a109d8e5e868db92231f45",
  measurementId: "G-K3YTHX4G28",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function initListeners() {
  $(window).on("hashchange", getPage);
  getPage();
  updateCartCount();
  getData();
  modalInjection();
}

$(document).on("click", "#signOut", function (e) {
  signOut(auth)
    .then(() => {
      e.preventDefault();
      $("#modal-inject .modal-wrapper3").hide();
      $("#modal-wrap1, #modal-wrap2").toggle();
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert("Error Message: " + errorMessage);
    });
});

$(document).on("click", "#signIn", function (e) {
  e.preventDefault();
  let email = $("#email").val();
  let pw = $("#pw").val();
  signInWithEmailAndPassword(auth, email, pw)
    .then((userCredential) => {
      // Signed In
      const user = userCredential.user;
      e.preventDefault();
      $("#modal-inject").css("display", "none");
      $("#modal-inject .modal-wrapper2").css("display", "none");
      $("#modal-inject .modal-wrapper1").css("display", "none");
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert("Error Message: " + errorMessage);
    });
});

$(document).on("click", "#createAcctBtn", function (e) {
  e.preventDefault();
  let emailSignUp = $("#emailSignUp").val();
  let pwSignUp = $("#pwSignUp").val();
  let fName = $("#fName").val();
  createUserWithEmailAndPassword(auth, emailSignUp, pwSignUp)
    .then((userCredential) => {
      // Signed up
      const user = userCredential.user;
      console.log(user);
      $("#modal-inject").css("display", "none");
      $("#modal-inject .modal-wrapper2").css("display", "none");
      $("#modal-inject .modal-wrapper1").css("display", "none");
      alert("Welcome! " + fName);
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert("Error Message: " + errorMessage);
    });
});
// FIRE BASE
//MVC URL LISTENER
function getPage() {
  let hash = window.location.hash;
  let pageID = hash.replace("#", "");

  if (pageID != "" && pageID != "home") {
    $.get(`pages/${pageID}.html`, function (data) {
      $("#app").html(data);
      loadCart();
    });
  } else {
    $.get(`pages/home.html`, function (data) {
      $("#app").html(data);
      loadItems();
    });
  }
}
//MVC URL LISTENER
// MOBILE MENU
$(".hamburger-icon").on("click", () => {
  $(".hamburger-icon").toggleClass("open");
  $("body").toggleClass("mobile-overflow");
});
// MOBILE MENU
function getData() {
  $.get(`/dist/data/data.json`, (data) => {
    productInfo = data;
    console.log(productInfo);
    loadItems();
    updateCartCount();
  }).fail(function (error) {
    alert("error " + error);
  });
}
getData();

var cartCount = 0;
var productInfo = {};

$(".checkout-button").on("click", function () {
  productInfo.Cart = [];
  cartCount = 0;
  updateCartCount();
});
$("form").on("submit", () => {
  e.preventDefault();
});
function loadCart() {
  $(".cart").html("");
  $.each(productInfo.Cart, (idx, cartItem) => {
    let item = productInfo.Products[cartItem.itemIdx];

    $(".cart").append(`      <div class="cart-box">
        <div class="x-btn">
          <a href="#">Save For Later</a>
          <p>X</p>
        </div>
        <div class="cart-main">
          <img src="images/Products/${item.image}" ${item.imagePosition}/>
          <div class="cart-name">
            <p>Keurig®</p>
            <h3 class="cart-title">${item.title}</h3>
          </div>
          <div class="points">
            <h2>Estimated Points: <span>0</span></h2>
            <p>i</p>
          </div>
        </div>
        <div class="qty">
          <p>$${item.realPrice} each</p>
          <select>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
          </select>
        </div>
        <p class="cart-subtotal">$${item.realPrice}</p>
      </div>`);
  });
}

function loadItems() {
  $(".all-items-container").html("");
  console.log("loadItems function called");
  console.log("productInfo:", productInfo);
  $.each(productInfo.Products, (idx, item) => [
    $(".all-items-container")
      .append(`<div class="item-box"><img src="images/Products/${item.image}" ${item.imagePosition} />
    <div class="colorbtns">
      ${item.colors}
    </div>
    <div class="item-title">${item.title}</div>
    <div class="item-price">
      <span>${item.price1}</span>
      <p>with Keurig® Starter Kit</p>
    </div>
    <div class="item-price">
      <span>${item.price2}</span>
      <p>Site deal: $${item.discnt} Off</p>
    </div>
    <div class="item-rating">
      <div class="stars">
        <i class="fa-solid fa-star"></i>
        <i class="fa-solid fa-star"></i>
        <i class="fa-solid fa-star"></i>
        <i class="fa-solid fa-star"></i>
        <i class="fa-solid fa-star starblank"></i>
      </div>
      <div class="rating">${item.rating1} | (${item.rating2})</div>
    </div>
    <div class="shipping">
      <i class="fa-solid fa-truck-fast fa-flip-horizontal"></i>Free shipping
    </div>
    <div class="compare">
      <input type="checkbox" />
      <p>Compare</p>
    </div>
    <div class="buy-now" id="${idx}")">BUY NOW</div></div>`),
  ]);

  $(".buy-now").on("click", (e) => {
    console.log("click");
    let productIdx = e.currentTarget.id;
    let obj = {
      itemIdx: productIdx,
    };

    productInfo.Cart.push(obj);
    console.log(productInfo.Cart);
    cartCount = productInfo.Cart.length;
    updateCartCount();
  });
}

function updateCartCount() {
  if (cartCount == 0) {
    $(".cartCounter").css("display", "none");
  } else if (cartCount >= 1) {
    $(".cartCounter").css("display", "flex");
    $(".cartCounter").html(cartCount);
  }
}
//MODAL INJECTION
function modalToggle() {
  $(".login").on("click", (e) => {
    $("#modal-inject").toggle();
    $("#modal-inject").css("display", "flex");
  });
  $(".close").on("click", (e) => {
    $("#modal-inject").toggle();
  });
}
function modalInjection() {
  $(".signupToggle").on("click", (e) => {
    e.preventDefault();
    $("#modal-inject #modal-wrap1").css("display", "none");
    $("#modal-inject #modal-wrap2").css("display", "flex");
  });
  $(".loginToggle").on("click", (e) => {
    e.preventDefault();
    $("#modal-inject #modal-wrap2").css("display", "none");
    $("#modal-inject #modal-wrap1").css("display", "flex");
  });
}
//MODAL INJECTION

$(document).on("click", ".login", function (e) {
  const user = auth.currentUser;
  hideAllModals();
  if (user) {
    $("#modal-wrap3").show();
  } else {
    $("#modal-wrap2, #modal-wrap1").toggle();
  }
});

function hideAllModals() {
  $(
    "#modal-inject .modal-wrapper, #modal-inject .modal-wrapper2, #modal-inject .modal-wrapper3"
  ).hide();
}

$(document).ready(function () {
  initListeners();
  getData();
  modalToggle();
});
