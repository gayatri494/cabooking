import random

# Cab Booking Chatbot - Task 02

cabs = {
    "1": ("Auto", 12),
    "2": ("Sedan", 18),
    "3": ("SUV", 25)
}

routes = {
    "1": ("Pune Station", "Shivajinagar", 5),
    "2": ("Swargate", "Kothrud", 8),
    "3": ("Hinjawadi", "Wakad", 10)
}

while True:
    print("\n===== CAB BOOKING CHATBOT =====")
    print("1. Book Ride")
    print("2. Exit")

    choice = input("Enter your choice: ").strip()

    if choice == "2":
        print("Thank you for using Cab Booking Chatbot!")
        print("Goodbye!")
        break

    elif choice == "1":
        print("\nChoose Cab Type:")
        print("1. Auto - Rs.12/km")
        print("2. Sedan - Rs.18/km")
        print("3. SUV - Rs.25/km")

        cab_choice = input("Enter cab choice: ").strip()

        if cab_choice not in cabs:
            print("Invalid cab choice! Please try again.")
            continue

        print("\nChoose Route:")
        for number, route in routes.items():
            source, destination, distance = route
            print(f"{number}. {source} to {destination} ({distance} km)")

        route_choice = input("Enter route number: ").strip()

        if route_choice not in routes:
            print("Invalid route choice! Please try again.")
            continue

        cab_name, rate = cabs[cab_choice]
        source, destination, distance = routes[route_choice]
        fare = rate * distance

        print("\n===== FARE DETAILS =====")
        print("Cab Type:", cab_name)
        print("Source:", source)
        print("Destination:", destination)
        print("Distance:", distance, "km")
        print("Rate: Rs.", rate, "/km")
        print("Total Fare: Rs.", fare)

        print("\n1. Confirm and Share OTP")
        print("2. Cancel Ride")

        confirm = input("Enter your choice: ").strip()

        if confirm == "2":
            print("Ride cancelled successfully.")
            print("No OTP has been shared.")
            continue

        elif confirm == "1":
            otp = random.randint(1000, 9999)
            print("\nBooking Confirmed!")
            print("Your 4-digit OTP is:", otp)
            print("OTP shared with the user (Demo).")
            print("Cancellation is now locked.")
            print("Thank you for booking with us!")

        else:
            print("Invalid choice! Booking cancelled.")
            print("No OTP has been shared.")
            continue

    else:
        print("Invalid menu choice! Please select 1 or 2.")