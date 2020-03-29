// Rental Class: Represents a rental
class Rental {
  constructor(name, item, date) {
    this.name = name;
    this.item = item;
    this.date = date;
  }
}

// UI Class: Handle UI tasks
class UI {
  static displayRental() {
    const rentals = Store.getRentals();

    rentals.forEach(rentals => UI.addRentalToList(rentals));
  }

  static addRentalToList(rental) {
    const list = document.querySelector("#rental-list");

    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${rental.name}</td>
        <td>${rental.item}</td>
        <td>${rental.date}</td>
        <td><a href='#' class='btn btn-danger btn-sm delete'>X</a></td>
        `;

    list.appendChild(row);
  }

  static deleteRental(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.querySelector("#rental-form");
    container.insertBefore(div, form);

    // Vanish in 3 sec
    setTimeout(() => document.querySelector(".alert").remove(), 3000);
  }

  static clearFields() {
    document.querySelector("#name").value = " ";
    document.querySelector("#item").value = " ";
    document.querySelector("#date").value = " ";
  }
}

// Storage Class: Handles storage

class Store {
  static getRentals() {
    let rentals;
    if (localStorage.getItem("rentals") === null) {
      rentals = [];
    } else {
      rentals = JSON.parse(localStorage.getItem("rentals"));
    }

    return rentals;
  }

  static addRental(rental) {
    const rentals = Store.getRentals();
    rentals.push(rental);
    localStorage.setItem("rentals", JSON.stringify(rentals));
  }

  static removeRental(name) {
    const rentals = Store.getRentals();

    rentals.forEach((rental, index) => {
      if (rental.name === name) {
        rentals.splice(index, 1);
      }
    });

    localStorage.setItem("rentals", JSON.stringify(rentals));
  }
}

// Event: Display rentals
document.addEventListener("DOMContentLoaded", UI.displayRental);

// Event: Add a rental
document.querySelector("#rental-form").addEventListener("submit", e => {
  // Prevent the default form action.
  e.preventDefault();

  //Get form values
  const name = document.querySelector("#name").value;
  const item = document.querySelector("#item").value;
  const date = document.querySelector("#date").value;

  //Validate a Rental
  if (name === " " || item === " " || date === " ") {
    UI.showAlert("Please Fill in all fields", "danger");
  } else {
    //Instantiate a rental
    const rental = new Rental(name, item, date);

    //Add rental to UI
    UI.addRentalToList(rental);

    //Add rental to store
    Store.addRental(rental);

    //Show success message
    UI.showAlert("Rental added!", "success");

    //Clear fields
    UI.clearFields();
  }
});

// Event: Remove a rental
document.querySelector("#rental-list").addEventListener("click", e => {
  UI.deleteRental(e.target);

  //Remove rental from Store
  Store.removeRental(
    e.target.parentElement.previousElementSibling.previousElementSibling
      .previousElementSibling.textContent
  );

  //Rental removal alert
  UI.showAlert("Rental deleted", "success");
});
