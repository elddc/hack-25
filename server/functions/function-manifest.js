// create metadata for all the available functions to pass to completions API
const tools = [
    /*{
        type: "function",
        function: {
            name: "askDoctor",
            say: "Let me check in with your doctor.",
            description: "Contact a medical doctor for advice in handling a medical problem.",
            parameters: {
                type: "object",
                properties: {
                    query: {
                        type: "string",
                        description: "The user\'s description of the problem.",
                    },
                },
                required: ["question"]
            },
            returns: {
                type: "object",
                properties: {
                    response: {
                        type: "string",
                        description: "The doctor\'s advice." // Relay this verbatim to the user."
                    }
                }
            }
        },
    },*/
    {
        type: "function",
        function: {
            name: "logMood",
            description: "Record the user\'s mood.",
            parameters: {
                type: "object",
                properties: {
                    happiness: {
                        type: "integer",
                        description: "The user's happiness as a number between 0 and 10, where 0 is unhappy, 5 is neutral, and 10 is happy."
                    },
                    /*mood: {
                        type: "string",
                        "enum": ["calm", "happy", "sad", "suprised", "confused", "scared", "angry"]
                        description: "The mood of the user",
                    },*/
                    reason: {
                        type: "string",
                        description: "The reason or event that caused the user's mood." // optional
                    }
                },
                required: ["happiness"],
            },
            // returns: {
            //     type: "object",
            //     properties: {
            //         price: {
            //             type: "integer",
            //             description: "the price of the model"
            //         }
            //     }
            // }
        },
    },
    /*  {
    type: 'function',
    function: {
      name: 'checkInventory',
      say: 'Let me check our inventory right now.',
      description: 'Check the inventory of airpods, airpods pro or airpods max.',
      parameters: {
        type: 'object',
        properties: {
          model: {
            type: 'string',
            'enum': ['airpods', 'airpods pro', 'airpods max'],
            description: 'The model of airpods, either the airpods, airpods pro or airpods max',
          },
        },
        required: ['model'],
      },
      returns: {
        type: 'object',
        properties: {
          stock: {
            type: 'integer',
            description: 'An integer containing how many of the model are in currently in stock.'
          }
        }
      }
    },
  },
  {
        type: "function",
        function: {
            name: "checkPrice",
            say: "Let me check the price, one moment.",
            description: "Check the price of given model of airpods, airpods pro or airpods max.",
            parameters: {
                type: "object",
                properties: {
                    model: {
                        type: "string",
                        "enum": ["airpods", "airpods pro", "airpods max"],
                        description: "The model of airpods, either the airpods, airpods pro or airpods max",
                    },
                },
                required: ["model"],
            },
            returns: {
                type: "object",
                properties: {
                    price: {
                        type: "integer",
                        description: "the price of the model"
                    }
                }
            }
        },
    },
    {
        type: "function",
        function: {
            name: "placeOrder",
            say: "All right, I\'m just going to ring that up in our system.",
            description: "Places an order for a set of airpods.",
            parameters: {
                type: "object",
                properties: {
                    model: {
                        type: "string",
                        "enum": ["airpods", "airpods pro"],
                        description: "The model of airpods, either the regular or pro",
                    },
                    quantity: {
                        type: "integer",
                        description: "The number of airpods they want to order",
                    },
                },
                required: ["type", "quantity"],
            },
            returns: {
                type: "object",
                properties: {
                    price: {
                        type: "integer",
                        description: "The total price of the order including tax"
                    },
                    orderNumber: {
                        type: "integer",
                        description: "The order number associated with the order."
                    }
                }
            }
        },
    },
    {
        type: "function",
        function: {
            name: "transferCall",
            say: "One moment while I transfer your call.",
            description: "Transfers the customer to a live agent in case they request help from a real person.",
            parameters: {
                type: "object",
                properties: {
                    callSid: {
                        type: "string",
                        description: "The unique identifier for the active phone call.",
                    },
                },
                required: ["callSid"],
            },
            returns: {
                type: "object",
                properties: {
                    status: {
                        type: "string",
                        description: "Whether or not the customer call was successfully transfered"
                    },
                }
            }
        },
    },*/
];

module.exports = tools;
