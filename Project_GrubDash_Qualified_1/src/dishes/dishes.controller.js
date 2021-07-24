const { Console } = require("console");
const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass
function dishExists(req, res, next) {
    const { dishId } = req.params;
    const foundDish = dishes.find((dish) => dish.id === dishId); 
   if (foundDish) {
      res.locals.dish = foundDish;
      return next();
    } 
    next({
      status: 404,
      message: `Dish id not found: ${dishId}`,
    });
    
  }


function hasName(req, res, next) {
    const { data: { name } = {} } = req.body;
 
    if (name && name !== undefined) {
      return next();
    } 
    
    next({ status: 400, message: "name" });
    
  }

/*function nameHasText(req, res, next) {
    const { data: { name } = {} } = req.body;
    if (name === "") {
      next({ status: 400, message: "Dish must include a name" });
    }
    next();
  }
*/
function hasDescription(req, res, next) {
    const { data: { description } = {} } = req.body;
 
    if (description) {
      return next();
    }
    next({ status: 400, message: "description" });
  }

function hasURL(req, res, next) {
    const { data: { image_url } = {} } = req.body;
 
    if (image_url) {
      return next();
    }
    next({ status: 400, message: "image_url" });
  }

function hasPrice(req, res, next) {
    const { data: { price } = {} } = req.body;
 
    if (price && price > 0 && typeof price === 'number') {
      return next();
    }
    next({ status: 400, message: "price" });
  }
function matchingId(req, res, next){
    const { dishId } = req.params;
    const { data: { id } = {} } = req.body;

    if(dishId === id || !id){
        return next()
    }
    next({status: 400, message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`})
}
function list(req, res) {
    res.json({ data: dishes });
  }

function read(req, res) {
    res.json({ data: res.locals.dish });
  }

function create(req, res) {
    const { data: { name, description, image_url, price } = {} } = req.body;
    const newDish = {
      id: new nextId(),
      name,
      description,
      image_url
    };

    dishes.push(newDish);
    res.status(201).json({ data: newDish });
  }

  function update(req, res) {
    const dish = res.locals.dish;
    const { data: { name, description, image_url, price } = {} } = req.body;

    dish.name = name;
    dish.description = description;
    dish.image_url = image_url;
    dish.price = price;
  
    res.json({ data: dish});
  }

module.exports = {
    list,
    read: [dishExists, read],
    create: [hasName, hasDescription, hasURL, hasPrice, create],
    update: [dishExists, hasName, hasDescription, hasURL, hasPrice, matchingId, update]
}