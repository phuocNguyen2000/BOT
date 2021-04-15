
 
    async function  getCart(firebaseApp){
        var ProductList = [];
        firebaseApp
           .database()
           .ref("/Shop/")
           .on("value",(data) => {
             data.child("Product").forEach((element) => {
                 
                     var product=  {
                         "title":"Welcome!",
                         "image_url":"https://petersfancybrownhats.com/company_image.png",
                         "subtitle":"We have the right hat for everyone.",
                         "default_action": {
                           "type": "web_url",
                           "url": "https://www.google.com.vn/",
                           "webview_height_ratio": "tall"
                         },
                         "buttons":[
                           {
                             "type":"web_url",
                             "url":"https://www.google.com.vn/",
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
                       
                     
                
             });
             
                      
           });
           return ProductList     
           
          
      }
    

