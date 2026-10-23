let fare = 0;
let booking = false;
let otpShared = false;
let rideOTP = "";
let rides = JSON.parse(localStorage.getItem("cabRides") || "[]");

function calculateFare() {
  const rate = Number(document.getElementById("cab").value);
  const distance = Number(document.getElementById("route").value);

  let total = rate * distance;
  let discount = 0;

  const code = document.getElementById("promo").value
    .trim()
    .toUpperCase();

  if (code === "CAB10") {
    discount = Math.min(Math.round(total * 0.10), 100);
  } else if (code === "CAB20") {
    discount = Math.min(Math.round(total * 0.20), 200);
  }

  total -= discount;
  fare = total;

  document.getElementById("fare").textContent =
    "Total Fare: ₹" + fare;

  document.getElementById("discount").textContent =
    "Discount: ₹" + discount;

  document.getElementById("message").textContent =
    "Distance: " + distance + " km | Rate: ₹" + rate + "/km";

  document.getElementById("confirm").disabled = false;
  document.getElementById("cancel").disabled = false;

  booking = false;
  otpShared = false;
  rideOTP = "";
  document.getElementById("otp").textContent = "";
}
function confirmRide() {
  if (fare <= 0) {
    document.getElementById("message").textContent =
      "Please calculate fare first.";
    return;
  }

  booking = true;
  showNotification("✅ Your cab booking is confirmed!");
  otpShared = false;
  rideOTP = String(Math.floor(1000 + Math.random() * 9000));

  document.getElementById("otp").textContent =
    "Demo OTP: " + rideOTP + " (not sent by SMS)";

  document.getElementById("message").textContent =
    "Booking confirmed! OTP sharing will lock cancellation.";

  document.getElementById("confirm").disabled = true;
  document.getElementById("cancel").disabled = false;

  saveRide("Booking Confirmed");
  
  const shareButton = document.getElementById("shareOTP");
  if (shareButton) shareButton.remove();
  const button = document.createElement("button");
  button.id = "shareOTP";
  button.textContent = "Share Demo OTP";
  button.onclick = shareOtp;
  document.getElementById("otp").after(button);
}

function shareOtp() {
  if (!booking || otpShared) return;

  otpShared = true;
  document.getElementById("cancel").disabled = true;
  document.getElementById("shareOTP").disabled = true;

  document.getElementById("message").textContent =
    "OTP shared. Cancellation is now locked.";

  saveRide("OTP Shared - Cancellation Locked");
}

function cancelRide() {
  if (!booking) {
    document.getElementById("message").textContent =
      "No confirmed ride to cancel.";
    return;
  }

  if (otpShared) {
    document.getElementById("message").textContent =
      "Cancellation is locked after OTP sharing.";
    return;
  }

  booking = false;
  showNotification("❌ Your ride has been cancelled.");
  document.getElementById("message").textContent =
    "Ride cancelled before OTP sharing.";

  document.getElementById("confirm").disabled = true;
  document.getElementById("cancel").disabled = true;

  saveRide("Cancelled");
}

function saveRide(status) {
  const ride = {
    fare: fare,
    pickup: document.getElementById("pickup").value,
    payment: document.getElementById("payment").value,
    status: status,
    time: new Date().toLocaleString()
  };

  rides.unshift(ride);
  rides = rides.slice(0, 20);
  localStorage.setItem("cabRides", JSON.stringify(rides));
  showHistory();
}

function showHistory() {
  const history = document.getElementById("history");

  if (!rides || rides.length === 0) {
    history.textContent = "No rides yet.";
    return;
  }

  history.innerHTML = "";

  rides.forEach((ride) => {
    const item = document.createElement("p");

    item.textContent =
      "🚕 " + ride.status +
      " | ₹" + ride.fare +
      " | " + ride.payment +
      " | " + ride.time;

    history.appendChild(item);
  });
}

function login() {
  const name = document.getElementById("username").value.trim();

  document.getElementById("loginMessage").textContent =
    name ? "Welcome, " + name + "! Demo login only." :
    "Please enter your name.";
}

function chat() {
  const question =
    document.getElementById("question").value.toLowerCase();

  let answer = "Please ask about fare, route, payment, OTP or cancellation.";

  if (question.includes("fare") || question.includes("price")) {
    answer = "Fare = distance × rate. Auto ₹12/km, Sedan ₹18/km, SUV ₹25/km.";
  } else if (question.includes("route") || question.includes("distance")) {
    answer = "Pune Station-Shivajinagar 5 km; Swargate-Kothrud 8 km; Hinjawadi-Wakad 10 km.";
  } else if (question.includes("otp")) {
    answer = "OTP appears after booking confirmation. Sharing OTP locks cancellation.";
  } else if (question.includes("cancel")) {
    answer = "You can cancel before sharing OTP. After sharing OTP, cancellation is locked.";
  } else if (question.includes("payment") || question.includes("upi")) {
    answer = "Cash, UPI Demo and Card Demo are available. No real payment is processed.";
  }

  document.getElementById("answer").textContent = answer;
}

showHistory();
function getLocation() {
  const message = document.getElementById("locationMessage");
  const pickup = document.getElementById("pickup");
  const mapLink = document.getElementById("mapLink");

  if (!navigator.geolocation) {
    message.textContent = "Location is not supported.";
    return;
  }

  message.textContent = "Getting your location...";

  navigator.geolocation.getCurrentPosition(
    function (position) {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      pickup.value = `${lat}, ${lon}`;
      message.textContent = "Current location found!";

      mapLink.href =
        `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=16/${lat}/${lon}`;
    },
    function () {
      message.textContent =
        "Location permission denied. Please allow location access.";
    }
  );
}
function showPaymentInfo() {
  const method = document.getElementById("payment").value;
  const info = document.getElementById("paymentInfo");

  if (method === "Cash") {
    info.textContent = "💵 Pay cash to the driver after the ride.";
  } else if (method === "UPI") {
    info.textContent = "📱 UPI selected. Demo only — no money will be transferred.";
  } else {
    info.textContent = "💳 Card selected. Demo only — no payment will be charged.";
  }
}
function applyPromo() {
  const code = document.getElementById("promo").value
    .trim().toUpperCase();

  const message = document.getElementById("promoMessage");

  if (code === "CAB10") {
    message.textContent = "✅ 10% discount applied!";
  } else if (code === "CAB20") {
    message.textContent = "✅ 20% discount applied!";
  } else {
    message.textContent = "❌ Invalid promo code.";
  }
}
function trackDriver() {
  if (!booking) {
    document.getElementById("driverStatus").textContent =
      "Please confirm your booking first.";
    return;
  }

  document.getElementById("driverStatus").textContent =
    "🚕 Driver Rahul is on the way! (Demo)";

  document.getElementById("driverETA").textContent =
    "Estimated arrival: 5 minutes (Demo)";

  document.getElementById("driverMap").href =
    "https://www.openstreetmap.org/";

  document.getElementById("message").textContent =
    "Demo driver tracking started!";
}
function downloadReceipt() {
  if (!booking) {
    alert("Please confirm your ride first!");
    return;
  }

  const receipt = `
===== CABGO BOOKING RECEIPT =====

Driver: Rahul Patil (Demo)
Pickup: ${document.getElementById("pickup").value}
Cab: ${document.getElementById("cab").selectedOptions[0].text}
Route: ${document.getElementById("route").selectedOptions[0].text}
Payment: ${document.getElementById("payment").value}
${document.getElementById("discount").textContent}
${document.getElementById("fare").textContent}

Status: Booking Confirmed
Date: ${new Date().toLocaleString()}

Thank you for choosing CabGo!
`;

  const blob = new Blob([receipt], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "CabGo_Receipt.txt";
  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function submitFeedback() {
  const rating = document.getElementById("driverRating").value;
  const feedback = document.getElementById("driverFeedback").value.trim();

  if (!booking) {
    document.getElementById("feedbackMessage").textContent =
      "Please confirm a booking first.";
    return;
  }

  const item = document.createElement("p");
  item.textContent = "⭐ " + rating + "/5 - " +
    (feedback || "No written feedback");

  document.getElementById("feedbackHistory").appendChild(item);

  document.getElementById("feedbackMessage").textContent =
    "Thank you! Your feedback was submitted.";

  document.getElementById("driverFeedback").value = "";
}
function clearHistory() {
  if (!confirm("Delete all booking history?")) {
    return;
  }

  rides = [];
  localStorage.removeItem("cabRides");

  showHistory();

  document.getElementById("message").textContent =
    "Booking history cleared!";
}
function copyReferral() {
  const code = "CABFRIEND";

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(code)
      .then(() => {
        document.getElementById("referralMessage").textContent =
          "✅ Referral code copied!";
      })
      .catch(() => showReferralCode(code));
  } else {
    showReferralCode(code);
  }
}

function showReferralCode(code) {
  document.getElementById("referralMessage").textContent =
    "Your referral code is: " + code;
}
function showNotification(message) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.style.display = "block";
}
let marathiMode = false;

function changeLanguage() {
  marathiMode = !marathiMode;

  document.getElementById("mainHeading").textContent =
    marathiMode
      ? "कॅब बुकिंग चॅटबॉट"
      : "Cab Booking Chatbot";
}
function saveFavoriteRoute() {
  const route = document.getElementById("route").value;

  localStorage.setItem("favoriteRoute", route);

  document.getElementById("favoriteMessage").textContent =
    "❤️ Favorite route saved!";
}

function useFavoriteRoute() {
  const route = localStorage.getItem("favoriteRoute");

  if (!route) {
    document.getElementById("favoriteMessage").textContent =
      "Please save a favorite route first.";
    return;
  }

  document.getElementById("route").value = route;

  document.getElementById("favoriteMessage").textContent =
    "⭐ Favorite route selected!";
}