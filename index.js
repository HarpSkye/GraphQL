var { graphqlHTTP } = require("express-graphql");
var { buildSchema, assertInputType } = require("graphql");
var express = require("express");

// Construct a schema, using GraphQL schema language
var restaurants = [
  {
    id: 1,
    name: "WoodsHill ",
    description:
      "American cuisine, farm to table, with fresh produce every day",
    dishes: [
      {
        name: "Swordfish grill",
        price: 27,
      },
      {
        name: "Roasted Broccily ",
        price: 11,
      },
    ],
  },
  {
    id: 2,
    name: "Fiorellas",
    description:
      "Italian-American home cooked food with fresh pasta and sauces",
    dishes: [
      {
        name: "Flatbread",
        price: 14,
      },
      {
        name: "Carbonara",
        price: 18,
      },
      {
        name: "Spaghetti",
        price: 19,
      },
    ],
  },
  {
    id: 3,
    name: "Karma",
    description:
      "Malaysian-Chinese-Japanese fusion, with great bar and bartenders",
    dishes: [
      {
        name: "Dragon Roll",
        price: 12,
      },
      {
        name: "Pancake roll ",
        price: 11,
      },
      {
        name: "Cod cakes",
        price: 13,
      },
    ],
  },
];
var schema = buildSchema(`
type Query{
  getRestaurant(id: Int!): Restaurant
  restaurants: [Restaurant!]!
},
type Restaurant {
  id: Int
  name: String
  description: String
  dishes:[Dish]
}
type Dish{
  name: String
  price: Int
}
input RestaurantInput{
  name: String
  description: String
}
type DeleteResponse{
  ok: Boolean!
}
type Mutation{
  setRestaurant(input: RestaurantInput): Restaurant
  deleteRestaurant(id: Int!): DeleteResponse
  editRestaurant(id: Int!, name: String!): Restaurant
}
`);

class RestaurantInput {
  constructor(id, {name, description, dishes}) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.dishes = dishes;
  }
}
// The root provides a resolver function for each API endpoint

var root = {
  getRestaurant: ({ id }) => {
    // Your code goes here
    return restaurants.find(restaurant => restaurant.id === id);
  },
  restaurants: () => {
    // Your code goes here
    return restaurants;
  },
  setRestaurant: ({ input }) => {
    // Your code goes here
    const id = restaurants.length + 1;
    const restaurant = new RestaurantInput(id, input);
    restaurants.push(restaurant);
    return restaurant;
  },
  deleteRestaurant: ({ id }) => {
    // Your code goes here
    const ok=Boolean(restaurants[id]); // TODO update id lookup
    let delc = restaurants[id]; // TODO update id lookup
    restaurants = restaurants.filter((item) => item.id !== id);
    console.log(JSON.stringify(delc));
    return { ok }; 
  },
  editRestaurant: ({ id, ...restaurant }) => {
    //return restaurants.find(restaurant => restaurant.id === id)
    
    if (!restaurants[id]){
      throw new Error("restaurant doesn't exist");
    }
    restaurant[id] = {
      ...restaurants[id],
      ...restaurant,
    };
    return restaurants[id];
  },
};
var app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);
var port = 5500;
app.listen(5500, () => console.log("Running Graphql on Port:" + port));

//export default root;
