// Predefined passwords for user and admin
const userPassword = "user123";
const adminPassword = "admin123";
let buses = JSON.parse(localStorage.getItem("buses")) || [];
let ticket = null;

// Login function for user
function login(event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        window.location.href = "search.html";
    } else {
        alert("Invalid username or password!");
    }
}

function registerUser(event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.some(user => user.username === username)) {
        alert("Username already exists. Please choose a different one.");
        return;
    }

    users.push({ username, password });
    localStorage.setItem("users", JSON.stringify(users));
    alert("Registration successful! Redirecting to login page...");
    window.location.href = "login.html";
}

// Admin login function
function adminLogin() {
    const password = prompt("Enter Admin Password:");
    if (password === adminPassword) {
        window.location.href = "admin.html";
    } else {
        alert("Incorrect admin password!");
    }
}

// Logout function
function logout() {
    window.location.href = "index.html";
}

// Add a new bus (Admin)
function addBus(event) {
    event.preventDefault();
    const busId = document.getElementById("bus-id").value.trim();
    const start = document.getElementById("start").value.trim();
    const end = document.getElementById("end").value.trim();
    const date = document.getElementById("date").value.trim();
    const seats = parseInt(document.getElementById("seats").value);
    const cost = parseFloat(document.getElementById("cost").value);

    if (!busId || !start || !end || !date || isNaN(seats) || isNaN(cost)) {
        alert("Please fill out all fields correctly!");
        return;
    }

    buses.push({ busId, start, end, date, seats, cost, assignedSeats: [] });
    localStorage.setItem("buses", JSON.stringify(buses));
    alert("Bus added successfully!");
    window.location.href = "admin.html";
}

// Delete a bus (Admin)
function deleteBus(event) {
    event.preventDefault();
    const busId = document.getElementById("delete-bus-id").value.trim();
    const index = buses.findIndex(bus => bus.busId === busId);

    if (index !== -1) {
        buses.splice(index, 1);
        localStorage.setItem("buses", JSON.stringify(buses));
        alert("Bus deleted successfully!");
    } else {
        alert("Bus ID not found!");
    }
    window.location.href = "admin.html";
}

// View all added buses (Admin)
function viewBuses() {
    console.log("viewBuses function invoked.");

    const busList = document.getElementById("bus-list");
    if (!busList) {
        console.error("Error: Element with id 'bus-list' not found in the DOM.");
        return;
    }

    buses = JSON.parse(localStorage.getItem("buses")) || [];
    console.log("Buses from localStorage:", buses);

    // Clear the existing list (if any)
    busList.innerHTML = "";

    if (buses.length > 0) {
        buses.forEach(bus => {
            const busItem = document.createElement("div");
            busItem.innerHTML = `
                <p><strong>Bus ID:</strong> ${bus.busId}</p>
                <p><strong>Route:</strong> ${bus.start} - ${bus.end}</p>
                <p><strong>Date:</strong> ${bus.date}</p>
                <p><strong>Available Seats:</strong> ${bus.seats}</p>
                <p><strong>Cost of Ticket:</strong> ₹${bus.cost}</p>
                <hr>
            `;
            busList.appendChild(busItem);
        });
    } else {
        busList.innerHTML = "<p>No buses added yet.</p>";
    }
}


// Search for available buses (User)
function searchBuses(event) {
    event.preventDefault();
    const source = document.getElementById("source").value.trim();
    const destination = document.getElementById("destination").value.trim();
    const journeyDate = document.getElementById("journey-date").value.trim();

    if (!source || !destination || !journeyDate) {
        alert("Please fill out all fields!");
        return;
    }

    const allBuses = JSON.parse(localStorage.getItem("buses")) || [];
    console.log("All Buses:", allBuses);

    const availableBuses = allBuses.filter(bus => 
        bus.start.toLowerCase() === source.toLowerCase() &&
        bus.end.toLowerCase() === destination.toLowerCase() &&
        bus.date === journeyDate
    );

    console.log("Available Buses:", availableBuses);

    localStorage.setItem("availableBuses", JSON.stringify(availableBuses));
    window.location.href = "results.html";
}

// Display available buses for users
// Display available buses on the results page
function displayAvailableBuses() {
    const busResults = document.getElementById("bus-results");
    const availableBuses = JSON.parse(localStorage.getItem("availableBuses")) || [];

    // Clear the existing bus results
    busResults.innerHTML = "";

    if (availableBuses.length > 0) {
        availableBuses.forEach((bus, index) => {
            const busItem = document.createElement("div");
            busItem.innerHTML = `
                <p>Bus ID: ${bus.busId}</p>
                <p>Route: ${bus.start} - ${bus.end}</p>
                <p>Date: ${bus.date}</p>
                <p>Seats Available: ${bus.seats}</p>
                <p>Cost of Ticket: ₹${bus.cost}</p>
                <button onclick="selectSeats(${index})">Select Seats</button>
            `;
            busResults.appendChild(busItem);
        });
    } else {
        busResults.innerHTML = "<p>No buses available for the selected route and date.</p>";
    }
}

// Function to handle selecting seats
function selectSeats(index) {
    const availableBuses = JSON.parse(localStorage.getItem("availableBuses"));
    const selectedBus = availableBuses[index];

    // Validate if selected bus exists
    if (!selectedBus) {
        alert("Selected bus not found.");
        return;
    }

    const passengerCount = parseInt(prompt("Enter number of passengers:"));

    // Validate passenger count
    if (passengerCount < 1 || passengerCount > selectedBus.seats) {
        alert(`Please enter a valid number of passengers (1-${selectedBus.seats}).`);
        return;
    }

    // Prompt for passenger names
    const passengerNames = [];
    for (let i = 0; i < passengerCount; i++) {
        const name = prompt(`Enter name for passenger ${i + 1}:`);
        passengerNames.push(name);
    }

    // Save the selected bus details, passenger names, and passenger count to localStorage
    localStorage.setItem("selectedBusIndex", index);
    localStorage.setItem("maxPassengers", passengerCount);
    localStorage.setItem("passengerNames", JSON.stringify(passengerNames));

    // Redirect to seat-selection page
    window.location.href = "seat-selection.html";
}

// Call displayAvailableBuses on page load to show buses in the results page
if (document.getElementById("bus-results")) {
    displayAvailableBuses();
} 

// Display ticket summary after successful booking
function displayTicketSummary() {
    const ticketSummary = document.getElementById("ticket-summary");

    if (!ticketSummary) {
        console.error("Error: Element with ID 'ticket-summary' not found.");
        return;
    }

    const ticket = JSON.parse(localStorage.getItem("ticket"));

    if (ticket) {
        // Get selected seats from localStorage
        const selectedSeats = JSON.parse(localStorage.getItem("selectedSeats")) || [];
        const passengerNames = JSON.parse(localStorage.getItem("passengerNames")) || [];
        
        ticketSummary.innerHTML = `
            <p><strong>Bus ID:</strong> ${ticket.busId}</p>
            <p><strong>Route:</strong> ${ticket.start} - ${ticket.end}</p>
            <p><strong>Date:</strong> ${ticket.date}</p>
            <p><strong>Passengers:</strong> ${passengerNames.join(", ")}</p>
            <p><strong>Assigned Seat Numbers:</strong> ${selectedSeats.join(", ")}</p>
            <p><strong>Total Cost:</strong> ₹${ticket.totalCost}</p>
        `;
    } else {
        ticketSummary.innerHTML = "<p>No ticket found.</p>";
        console.error("Error: No ticket data found in localStorage.");
    }
}



// Display ticket details on the ticket page
function displayTicket() {
    const ticketDetails = document.getElementById("ticket-details");
    const ticket = JSON.parse(localStorage.getItem("ticket"));

    if (ticket) {
        const selectedSeats = ticket.assignedSeats || [];
        const passengerNames = ticket.passengers || [];

        let seatDetails = "";
        selectedSeats.forEach((seat, index) => {
            seatDetails += `<p>Seat ${seat}: ${passengerNames[index]}</p>`;
        });

        ticketDetails.innerHTML = `
            <p><strong>Bus ID:</strong> ${ticket.busId}</p>
            <p><strong>Route:</strong> ${ticket.start} - ${ticket.end}</p>
            <p><strong>Date:</strong> ${ticket.date}</p>
            <p><strong>Passengers:</strong> ${passengerNames.join(", ")}</p>
            ${seatDetails}
            <p><strong>Total Cost:</strong> ₹${ticket.totalCost}</p>
        `;
    } else {
        ticketDetails.innerHTML = "<p>No ticket found.</p>";
    }
}

// Predefined demo card credentials
const demoCardDetails = {
    cardNumber: "1234123412341234",
    cardName: "Demo User",
    expiryDate: "12/25",
    cvv: "123"
};

// Process payment by validating entered card details
function processPayment(event) {
    event.preventDefault();
    const cardNumber = document.getElementById("cardNumber").value;
    const cardName = document.getElementById("cardName").value;
    const expiryDate = document.getElementById("expiryDate").value;
    const cvv = document.getElementById("cvv").value;

    // Validate card details against demo card
    if (
        cardNumber === demoCardDetails.cardNumber &&
        cardName === demoCardDetails.cardName &&
        expiryDate === demoCardDetails.expiryDate &&
        cvv === demoCardDetails.cvv
    ) {
        alert("Payment successful! Your booking is confirmed.");

        // Redirect to ticket page
        window.location.href = "ticket.html";
    } else {
        alert("Payment failed! Invalid card details.");
    }
}

window.onload = displayTicketSummary;

document.addEventListener('DOMContentLoaded', () => {
    const seatChart = document.getElementById('seat-chart');
    const rows = 5; // Example number of rows
    const cols = 4; // Example number of columns
    const selectedSeats = new Set();
    const maxPassengers = parseInt(localStorage.getItem('maxPassengers'), 10) || 1; // Example, replace as needed

    // Example of unavailable seats, replace with actual data if applicable
    const unavailableSeats = new Set(JSON.parse(localStorage.getItem('unavailableSeats')) || []);

    // Create seat grid
    for (let row = 0; row < rows; row++) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'seat-row';
        for (let col = 0; col < cols; col++) {
            const seatNumber = `R${row + 1}C${col + 1}`;
            const seat = document.createElement('div');
            seat.className = 'seat';

            if (unavailableSeats.has(seatNumber)) {
                seat.className += ' unavailable';
                seat.title = 'This seat is already booked';
            } else {
                seat.className += ' available';
                seat.addEventListener('click', () => toggleSeatSelection(seat));
            }

            seat.dataset.seatNumber = seatNumber;
            rowDiv.appendChild(seat);
        }
        seatChart.appendChild(rowDiv);
    }

    function toggleSeatSelection(seat) {
        const seatNumber = seat.dataset.seatNumber;
        if (selectedSeats.has(seatNumber)) {
            selectedSeats.delete(seatNumber);
            seat.classList.remove('selected');
        } else {
            if (selectedSeats.size >= maxPassengers) {
                alert(`Maximum number of seats (${maxPassengers}) reached.`);
                return;
            }
            selectedSeats.add(seatNumber);
            seat.classList.add('selected');
        }
        console.log('Selected seats:', Array.from(selectedSeats));
    }

   window.confirmSeatSelection = function() {
    if (selectedSeats.size === 0) {
        alert('Please select at least one seat.');
        return;
    }

    const passengerNames = [];
    for (let i = 0; i < selectedSeats.size; i++) {
        const name = prompt(`Enter the name for passenger ${i + 1}:`);
        passengerNames.push(name);
    }

    // Get the selected bus data
    const availableBuses = JSON.parse(localStorage.getItem("availableBuses"));
    const selectedBusIndex = parseInt(localStorage.getItem("selectedBusIndex"));
    const selectedBus = availableBuses[selectedBusIndex];

    // Calculate the total cost for the selected seats
    const totalCost = selectedSeats.size * selectedBus.cost;

    // Create ticket object and store all the details
    const ticket = {
        busId: selectedBus.busId,
        start: selectedBus.start,
        end: selectedBus.end,
        date: selectedBus.date,
        totalCost: totalCost,
        passengers: passengerNames,
        assignedSeats: Array.from(selectedSeats),
    };

    // Store ticket in localStorage
    localStorage.setItem("ticket", JSON.stringify(ticket));
    localStorage.setItem('selectedSeats', JSON.stringify(Array.from(selectedSeats)));
    localStorage.setItem('passengerNames', JSON.stringify(passengerNames));

    // Mark selected seats as unavailable in the selected bus
    const unavailableSeats = JSON.parse(localStorage.getItem('unavailableSeats')) || [];
    unavailableSeats.push(...Array.from(selectedSeats)); // Add booked seats to unavailable list
    localStorage.setItem('unavailableSeats', JSON.stringify(unavailableSeats));

    // Update the available buses to reflect the changes
    selectedBus.assignedSeats.push(...Array.from(selectedSeats)); // Update the assigned seats
    localStorage.setItem("buses", JSON.stringify(availableBuses));

    alert('Seats confirmed: ' + Array.from(selectedSeats).join(', ') + '. Proceeding to payment...');
    window.location.href = 'payment.html'; // Redirect to payment page
};
;
    ;
    ;
});