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
  const input = document.getElementById("question");
  const answer = document.getElementById("answer");
  const question = input.value.trim().toLowerCase();

  if (question === "") {
    answer.textContent = "Please type your question!";
    return;
  }

  if (
    question.includes("hello") ||
    question.includes("hi") ||
    question.includes("नमस्कार")
  ) {
    answer.textContent =
      "👋 Hello! Welcome to CabGo. How can I help you?";
  }

  else if (
    question.includes("fare") ||
    question.includes("price") ||
    question.includes("भाडे")
  ) {
    answer.textContent =
      "🚕 Auto ₹12/km, Sedan ₹18/km, SUV ₹25/km. Select cab and route to calculate fare.";
  }

  else if (
    question.includes("cheapest") ||
    question.includes("cheap") ||
    question.includes("स्वस्त")
  ) {
    answer.textContent =
      "💰 Auto is the cheapest cab at ₹12/km.";
  }

  else if (
    question.includes("book") ||
    question.includes("booking") ||
    question.includes("बुक")
  ) {
    answer.textContent =
      "📍 Select cab and route, enter pickup, calculate fare, then click Confirm Booking.";
  }

  else if (
    question.includes("cancel") ||
    question.includes("रद्द")
  ) {
    answer.textContent =
      "❌ You can cancel before sharing OTP. After sharing OTP, cancellation is locked.";
  }

  else if (question.includes("otp")) {
    answer.textContent =
      "🔐 Your demo OTP appears after confirming your booking. It is not sent by SMS.";
  }

  else if (
    question.includes("promo") ||
    question.includes("coupon") ||
    question.includes("discount")
  ) {
    answer.textContent =
      "🎟️ Try CAB10 for 10% off or CAB20 for 20% off.";
  }

  else if (
    question.includes("payment") ||
    question.includes("upi") ||
    question.includes("पैसे")
  ) {
    answer.textContent =
      "💳 Cash, UPI and Card options are available in demo mode. No real payment is processed.";
  }

  else if (
    question.includes("location") ||
    question.includes("pickup") ||
    question.includes("लोकेशन")
  ) {
    answer.textContent =
      "📍 Enter your pickup location or click Use My Current Location and allow permission.";
  }

  else if (
    question.includes("route") ||
    question.includes("distance") ||
    question.includes("मार्ग")
  ) {
    answer.textContent =
      "🗺️ Available routes: Pune Station–Shivajinagar (5 km), Swargate–Kothrud (8 km), Hinjawadi–Wakad (10 km).";
  }

  else if (
    question.includes("driver") ||
    question.includes("track")
  ) {
    answer.textContent =
      "🚕 Confirm your booking, then click Track Driver. Tracking is a demo, not real-time.";
  }

  else {
    answer.textContent =
      "🤖 Sorry, I don't know that yet. Ask me about fare, booking, OTP, payment, promo codes or routes.";
  }

  input.value = "";
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
document.addEventListener("DOMContentLoaded", function () {
  const button = document.getElementById("loginOpen");
  const dialog = document.getElementById("loginDialog");

  if (button && dialog) {
    button.addEventListener("click", function () {
      dialog.showModal();
    });
  }
});
// CabGo Dark Mode
document.addEventListener("DOMContentLoaded", function () {
  const themeButton = document.getElementById("themeToggle");

  if (!themeButton) {
    console.log("Dark Mode button not found in HTML.");
    return;
  }

  themeButton.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");

    const darkModeOn = document.body.classList.contains("dark-mode");

    themeButton.textContent = darkModeOn
      ? "☀️ Light Mode"
      : "🌙 Dark Mode";
  });
});
/* Smart Ride Buddy */
(function () {
  const contactName = document.getElementById("trustedContact");
  const contactPhone = document.getElementById("trustedPhone");
  const saveBtn = document.getElementById("saveContactBtn");
  const timerText = document.getElementById("safetyTimer");
  const startBtn = document.getElementById("startSafetyBtn");
  const stopBtn = document.getElementById("stopSafetyBtn");
  const shareBtn = document.getElementById("shareTripBtn");
  const message = document.getElementById("buddyMessage");

  if (
    !contactName || !contactPhone || !saveBtn ||
    !timerText || !startBtn || !stopBtn ||
    !shareBtn || !message
  ) return;

  let timerInterval = null;
  let elapsedSeconds = 0;

  // Load saved contact from this browser
  try {
    const saved = JSON.parse(
      localStorage.getItem("cabGoTrustedContact") || "{}"
    );
    contactName.value = saved.name || "";
    contactPhone.value = saved.phone || "";
  } catch (error) {
    console.log("Could not load saved contact.");
  }

  saveBtn.addEventListener("click", function () {
    const name = contactName.value.trim();
    const phone = contactPhone.value.trim();

    if (!name || !/^[0-9+\-\s()]{7,18}$/.test(phone)) {
      message.textContent = "Please enter a name and valid phone number.";
      return;
    }

    localStorage.setItem("cabGoTrustedContact", JSON.stringify({
      name: name,
      phone: phone
    }));

    message.textContent = "Trusted contact saved on this device.";
  });

  function displayTime() {
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;
    timerText.textContent =
      "Ride timer: " + minutes + " min " +
      String(seconds).padStart(2, "0") + " sec";
  }

  startBtn.addEventListener("click", function () {
  if (timerInterval !== null) return;

  elapsedSeconds = 0;
  displayTime();
  message.textContent = "Safety timer started!";

  timerInterval = setInterval(function () {
    elapsedSeconds++;
    displayTime();
  }, 1000);
});

  stopBtn.addEventListener("click", function () {
    if (timerInterval !== null) {
      clearInterval(timerInterval);
      timerInterval = null;
    }

    message.textContent = "Safety timer stopped.";
  });

  shareBtn.addEventListener("click", async function () {
    const name = contactName.value.trim();
    const phone = contactPhone.value.trim();

    const tripDetails =
      "CabGo Trip Details\n" +
      "Trusted Contact: " + (name || "Not entered") + "\n" +
      "Contact Number: " + (phone || "Not entered") + "\n" +
      "Please check on me during my ride.";

    if (navigator.share) {
      try {
        await navigator.share({
          title: "CabGo Trip Details",
          text: tripDetails
        });
        message.textContent = "Share menu opened.";
      } catch (error) {
        if (error.name !== "AbortError") {
          message.textContent = "Sharing failed. Please try again.";
        }
      }
    } else if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(tripDetails);
        message.textContent = "Trip details copied. You can paste and send them.";
      } catch (error) {
        message.textContent = "Sharing is not supported in this browser.";
      }
    } else {
      message.textContent = "Sharing is not supported in this browser.";
    }
  });
})();
/* Smart Fare Splitter */
(function () {
  const fareInput = document.getElementById("splitFare");
  const peopleSelect = document.getElementById("friendCount");
  const calculateBtn = document.getElementById("calculateSplitBtn");
  const copyBtn = document.getElementById("copySplitBtn");
  const result = document.getElementById("splitResult");

  if (!fareInput || !peopleSelect || !calculateBtn || !copyBtn || !result) {
    return;
  }

  let splitDetails = "";

  calculateBtn.addEventListener("click", function () {
    const fare = Number(fareInput.value);
    const people = Number(peopleSelect.value);

    if (!Number.isFinite(fare) || fare <= 0) {
      result.textContent = "Please enter a valid fare amount.";
      splitDetails = "";
      return;
    }

    const totalPaise = Math.round(fare * 100);
    const basePaise = Math.floor(totalPaise / people);
    const extraPaise = totalPaise % people;

    const amounts = Array.from({ length: people }, function (_, index) {
      return (basePaise + (index < extraPaise ? 1 : 0)) / 100;
    });

    splitDetails = "CabGo Fare Split\nTotal Fare: ₹" +
      (totalPaise / 100).toFixed(2) +
      "\nPeople: " + people +
      "\n" + amounts.map(function (amount, index) {
        return "Person " + (index + 1) + ": ₹" + amount.toFixed(2);
      }).join("\n");

    result.textContent = amounts.map(function (amount, index) {
      return "Person " + (index + 1) + ": ₹" + amount.toFixed(2);
    }).join(" | ");
  });

  copyBtn.addEventListener("click", async function () {
    if (!splitDetails) {
      result.textContent = "Calculate the split first.";
      return;
    }

    try {
      await navigator.clipboard.writeText(splitDetails);
      result.textContent += " — Split details copied!";
    } catch (error) {
      result.textContent = splitDetails;
    }
  });
})();
/* Lost & Found Functionality */
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("lostFoundForm");
  const message = document.getElementById("lostFoundMessage");
  const history = document.getElementById("lostFoundHistory");

  if (!form || !message || !history) return;

  function showReports() {
    const reports = JSON.parse(
      localStorage.getItem("cabLostReports") || "[]"
    );

    history.replaceChildren();

    reports.forEach(function (report) {
      const card = document.createElement("div");
      card.className = "lost-report";

      const title = document.createElement("strong");
      title.textContent = "🔎 " + report.item;

      const details = document.createElement("p");
      details.textContent =
        "Route: " + report.route +
        " | Description: " + report.description;

      const date = document.createElement("small");
      date.textContent = "Reported: " + report.date;

      card.append(title, details, date);
      history.appendChild(card);
    });
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const report = {
      item: document.getElementById("lostItem").value,
      route: document.getElementById("lostRide").value.trim(),
      description: document.getElementById("lostDescription").value.trim(),
      contact: document.getElementById("lostContact").value.trim(),
      date: new Date().toLocaleString()
    };

    const reports = JSON.parse(
      localStorage.getItem("cabLostReports") || "[]"
    );

    reports.unshift(report);

    try {
      localStorage.setItem(
        "cabLostReports",
        JSON.stringify(reports.slice(0, 20))
      );
    } catch (error) {
      message.textContent = "Could not save the report. Please try again.";
      return;
    }

    message.textContent =
      "✅ Lost item report saved! Please contact CabGo support for help.";

    form.reset();
    showReports();
  });

  showReports();
});