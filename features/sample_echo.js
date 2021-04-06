/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */ 
const { BotkitConversation } = require('botkit');

module.exports = (controller)=> {
    var firebase = require('firebase');
    const firebaseConfig = {
        apiKey: "AIzaSyB5Wn3jau6R6DZTNP_unJOeBviffLPXtl4",
        authDomain: "haruko-37c48.firebaseapp.com",
        databaseURL: "https://haruko-37c48-default-rtdb.firebaseio.com",
        projectId: "haruko-37c48",
        storageBucket: "haruko-37c48.appspot.com",
        messagingSenderId: "682365635087",
        appId: "1:682365635087:web:3bd5070eebaba0dbb1f17a",
        measurementId: "G-FJC09KPQBH"
      };
      var fire;
      if (!firebase.apps.length) {
        fire= firebase.initializeApp(firebaseConfig);
     }
   
     const firebaseApp = fire


      controller.hears('hello','message',async(bot, message) => {
        // do something!
      
        var re={   
            "attachment":{
                "type":"template",
                "payload":{
                  "template_type":"generic",
                  "elements":await(async function(){
                        var ProductList = [];
                       await firebaseApp
                          .database()
                          .ref("/Shop/")
                          .on("value", async(data) => {
                            data.child("Product").forEach(async(element) => {
                                try {
                                    var product=  {
                                        "title":"Welcome!",
                                        "image_url":"https://petersfancybrownhats.com/company_image.png",
                                        "subtitle":"We have the right hat for everyone.",
                                        "default_action": {
                                          "type": "web_url",
                                          "url": "https://petersfancybrownhats.com/view?item=103",
                                          "webview_height_ratio": "tall"
                                        },
                                        "buttons":[
                                          {
                                            "type":"web_url",
                                            "url":"https://petersfancybrownhats.com",
                                            "title":"View Website"
                                          },{
                                            "type":"postback",
                                            "title":"Start Chatting",
                                            "payload":"DEVELOPER_DEFINED_PAYLOAD"
                                          }              
                                        ]      
                                      };
                                      product.title = element.val().Title;
                                      product.subtitle = element.val().Price;    
                                      product.image_url = element.val().Avatar;
                                      ProductList.push(product);
                                    
                                } catch (error) {
                                    
                                }
                             
                              
                            });               
                          });
                          return ProductList
                         
                      
                  })(), 
                }
              }
            
        } 
     await bot.reply(message,re)   
       
    });
};
