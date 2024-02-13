## Form Validations 
Most of the forms from my app will display front-end errors as inline errors.
If there's a specific request from the specification, like:
> When the submit button is pressed, if the two passwords don't match the user should receive an error popup.

Then, the error will be displayed as a pop-up modal (all back-end errors as well).

### Sign Up & Update User Profile
Strict name, email, and password format restriction.
Name must match `^[A-Z][a-z]+( [A-Z][a-z]+)?( [A-Z][a-z]+)?$`.
Email must match `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`.
Password must be 8-32 characters and include a number, an uppercase letter, and a lowercase letter.

## Real-time Chatting
The refresh interval is 3 seconds (not actually refreshing the page).
Everything on the chat page will be updated automatically, including reactions.
If the channel member leaves, you will not see an immediate update for their old chat messages. After re-entering the channel, you will see their old messages marked as "Unknown User", and you will not be able to check their profile. Similarly, if the channel member updates their profile, you will not see an immediate update for their old chat messages (if you don't click the channel again). But, if the channel member sends a new message, their name and profile will be updated for all the more recent message entries (if you keep staying on the chat screen).

## Offline Mode
You will see a notification at the top of the chat window indicating you are disconnected (if you are at the chat window when the backend server stops, the notification will pop up automatically). All requests made during offline mode will get an error from the pop-up modal.

## UI & UX
This app is visually close to Discord; I believe the UX should be very pleasing.

### Invite User
The invite function at the top right of the screen has an indicator to show the user who has been selected. Additional Information like the profile picture and email will also be visible during selection. Be aware the list will only show users who are outside the channel.