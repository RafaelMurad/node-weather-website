const path = require("path");
const express = require("express");
const hbs = require("hbs");
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

const app = express();

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

//Setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather",
    name: "Rafael Murad"
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About me",
    name: "Rafael Murad"
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    message: "May the Force be with you!",
    title: "Help",
    name: "Rafael Murad"
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send("Please, provide a valid address.");
  }

  geocode(
    req.query.address,
    (error, { location, latitude, longitude } = {}) => {
      if (error) {
        return res.send({ error });
      }

      forecast(latitude, longitude, (error, forecast) => {
        if (error) {
          return console.log(error);
        }
        res.send({
          forecast: forecast,
          location,
          address: req.query.address
        });
      });
    }
  );
});

app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send("Please, provide search term.");
  }

  res.send({
    product: []
  });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Rafael Murad",
    errorMessage: "Help article not found"
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Rafael Murad",
    errorMessage: "Page not found"
  });
});

app.listen(3000, () => {
  console.log("server is up on port 3000");
});
