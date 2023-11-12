# Build a Voting App

A Free Code Camp Dynamic Web Application Project. A Full Stack Javascript App using Node, Express, Passport, MongoDB, React/Redux and Semantic UI with Google Material theme.

This is the API server side of the Fullstack App. The client side can be found at https://github.com/minhkashyu/nightlife-coordination-frontend.

You can run the App at https://mks-nightlife-coordination-app.herokuapp.com/.

NOTE: This app on heroku has a web dyno, and if the web dyno receives no traffic in a 30 minute period, the web dyno will sleep. If you access the app when the web dyno is sleeping, you will experience a short delay. After that, the web dyno will become active and the app will run normally. Also the api of the app has another web dyno, and as a result, the first data loading will have a delay as well.

## User Stories

* As an unauthenticated user, I can view all bars in my area.

* As an authenticated user, I can add myself to a bar to indicate I am going there tonight.

* As an authenticated user, I can remove myself from a bar if I no longer want to go there.

* As an unauthenticated user, when I login I should not have to search again.

