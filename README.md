# Finance Tracker

This is a simple application that allows users to create an account, input their investments, and check the live value of each part of their portfolio. It provides tools to update as well based on interest earned and salary earned.

## 🚀 Specification Deliverable

### Elevator pitch

Everyone in the world wants to use their money better, to better understand how their investments are performing and how their money is being used. There are countless separate sources where people invest or choose to store their money, but that's where this simple finance tracker comes in. It serves as a simple home base for people to track their money across all sources, analyze how it's growing, and receive an overall financial report on a weekly, monthly, and yearly basis. The tool is simple but powerful because of it's broad scope--it provides a bird's eye view of your personal finances. It also provides the ability to share an individual investment with another individual, which allows you to compare investment strategy with friends and family.

### Design

![Design image](screenshot.png)
![Design image](screenshot2.png)

One page provides login information, while the next page provides information about each amount of money you have invested in different sources, each with an optional button to share with other users. Underneath there is a totals section that provides information about the total amount of money invested, while there is also a shared values section in the lower-right hand side of the second page.

![Design image](screenshot3.png)

### Key features

- Secure personal login
- Ability to select investment options
- Ability to input investment amount
- Shared investments displayed in realtime
- Investment value updated via web-sourced values
- Total investment values provided
- Value consistently stored in server

### Technologies

I am going to use the required technologies in the following ways.

- **HTML** - Provides skeleton-like structure of first page, login page. Also provides structure and content for second page with information on investments and hyperlink at the bottom for Github.
- **CSS** - Aesthetic design that can appear on many devices. Most importantly easily visible investment totals and well selected colors for contrast/simple design.
- **React** - Uses React for simple login and routing of shared investment totals between accounts.
- **Service** - Backend service saves login information and shared information, with third-party access for investment information (i.e. stock or coin value).
- **DB/Login** - Secure credentials stored, can't access financial information without credentials.
- **WebSocket** - Broadcasts shared information inputs to other users.

## 🚀 AWS deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **Server deployed and accessible with custom domain name** - [My server link](https://yourdomainnamehere.click).

## 🚀 HTML deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **HTML pages** - I did not complete this part of the deliverable.
- [ ] **Proper HTML element usage** - I did not complete this part of the deliverable.
- [ ] **Links** - I did not complete this part of the deliverable.
- [ ] **Text** - I did not complete this part of the deliverable.
- [ ] **3rd party API placeholder** - I did not complete this part of the deliverable.
- [ ] **Images** - I did not complete this part of the deliverable.
- [ ] **Login placeholder** - I did not complete this part of the deliverable.
- [ ] **DB data placeholder** - I did not complete this part of the deliverable.
- [ ] **WebSocket placeholder** - I did not complete this part of the deliverable.

## 🚀 CSS deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **Header, footer, and main content body** - I did not complete this part of the deliverable.
- [ ] **Navigation elements** - I did not complete this part of the deliverable.
- [ ] **Responsive to window resizing** - I did not complete this part of the deliverable.
- [ ] **Application elements** - I did not complete this part of the deliverable.
- [ ] **Application text content** - I did not complete this part of the deliverable.
- [ ] **Application images** - I did not complete this part of the deliverable.

## 🚀 React part 1: Routing deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **Bundled using Vite** - I did not complete this part of the deliverable.
- [ ] **Components** - I did not complete this part of the deliverable.
- [ ] **Router** - Routing between login and voting components.

## 🚀 React part 2: Reactivity

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **All functionality implemented or mocked out** - I did not complete this part of the deliverable.
- [ ] **Hooks** - I did not complete this part of the deliverable.

## 🚀 Service deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **Node.js/Express HTTP service** - I did not complete this part of the deliverable.
- [ ] **Static middleware for frontend** - I did not complete this part of the deliverable.
- [ ] **Calls to third party endpoints** - I did not complete this part of the deliverable.
- [ ] **Backend service endpoints** - I did not complete this part of the deliverable.
- [ ] **Frontend calls service endpoints** - I did not complete this part of the deliverable.

## 🚀 DB/Login deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **User registration** - I did not complete this part of the deliverable.
- [ ] **User login and logout** - I did not complete this part of the deliverable.
- [ ] **Stores data in MongoDB** - I did not complete this part of the deliverable.
- [ ] **Stores credentials in MongoDB** - I did not complete this part of the deliverable.
- [ ] **Restricts functionality based on authentication** - I did not complete this part of the deliverable.

## 🚀 WebSocket deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **Backend listens for WebSocket connection** - I did not complete this part of the deliverable.
- [ ] **Frontend makes WebSocket connection** - I did not complete this part of the deliverable.
- [ ] **Data sent over WebSocket connection** - I did not complete this part of the deliverable.
- [ ] **WebSocket data displayed** - I did not complete this part of the deliverable.
- [ ] **Application is fully functional** - I did not complete this part of the deliverable.
