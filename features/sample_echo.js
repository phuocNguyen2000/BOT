/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */ 
const { BotkitConversation } = require('botkit');
const { response } = require('express');
const Cart = require('../dto/cart')
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
     };
   
     const firebaseApp = fire
     async function  getProduct(){
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
                          "type":"postback",
                          "title":"MUA NGAY",
                          "payload":"yes",
                          
                         },{
                           "type":"postback",
                           "title":"Start Chatting",
                           "payload":"no",
                           
                         }              
                       ]      
                     };
                     var data={
                      title:'',
                      subtitle:''

                     }

                     product.title = element.val().Title;
                     product.subtitle = element.val().Price;    
                     product.image_url = element.val().Avatar;
                     data.title=product.title
                     data.subtitle=product.subtitle
                     product.buttons[0].payload=JSON.stringify(data);
                     ProductList.push(product);
                     
                   
              
           });
           
                    
         });
         var re={   
          "attachment":{
              "type":"template",
              "payload":{
                "template_type":"generic",
                "elements":[], 
              }
            }
    
      } ;
      re.attachment.payload.elements=ProductList
      return  re    
        
    }
  const  creteOrder=async(product)=>{
      firebaseApp
      .database()
      .ref("/Order/"+product.phone+'/'+product.date+'/').ref.update(product).then((result)=>{
          return true;
      }).catch((error)=>{
          return false;
      })

  };
    const onboarding = new BotkitConversation('cate', controller);
    

    
  // collect a value with conditional actions
  onboarding.ask({text:'bạn muốn xem danh sách sản phẩm',quick_replies: [
    {
        title: "yes",
        payload: "yes",
    },
    {
        title: "no",
        payload: "no"
    }
]}, [
      {
          pattern: 'yes',
          handler: async function(answer, convo, bot) {
            await convo.gotoThread('f');
          }
      },
      {
          pattern: 'no',
          handler: async function(answer, convo, bot) {
              await convo.gotoThread('hates_life');
          }
      }
  ],{key: 'tacos'});
  


 ;(async(getProduct,onboarding)=>{ await getProduct().then(e=>{
 
    onboarding.addMessage(
      {action:'likes_tacos',} ,'f');
      
    onboarding.addQuestion(e, [{
      pattern:'MUA NGAY',
      handler: async function(answer, convo, bot) {
        console.log(answer)
        await bot.reply(answer,'eeeeeeeeeeeeeeeeeeee')
    }
      
    }],'likes', 'likes_tacos')
  })})(getProduct,onboarding); 
   
  controller.addDialog(onboarding);
  
  controller.hears(['cho xem danh sách sản phẩm'], 'message', async(bot, message) => {
    bot.beginDialog('cate');
});

 let conver= new BotkitConversation('convo',controller)

 const order=async(product,controller,bot)=>{
   

controller.addDialog(conver)

conver.addAction('ansadd');

 conver.addMessage({action:'ansaddress'},'ansadd');
 var syntax='"soluong":<soluong>,"sodienthoai":"<sodienthoai>","diachi":"<diachi>"';
 conver.addQuestion('Nhập thông tin mua hàng theo cú pháp '+syntax,async(response,convo,bot)=>{
  var x='{'+response+'}'
   try {
     if(x.search('soluong')!=-1||x.search('diachi')!=-1||x.search('sodienthoai')==-1)
     {
      var data= JSON.parse(x);
      var order={
        soluong:1,
        title:'',
        total:4234,
        price:34,
        address:'a',
        phone:'',
        date:''

      };
      var today = new Date();
      order.title=product.title;
      order.price=product.subtitle;
      order.total=product.subtitle*data.soluong
      order.soluong=data.soluong
      order.phone=data.sodienthoai
      order.address=data.diachi
      order.date=today.getFullYear()+'_'+(today.getMonth()+1)+'_'+today.getDate();
     await creteOrder(order).then(async (re)=>{
       
      let conEndOrder= new BotkitConversation('orderend',controller)
      conEndOrder.say('order thành công' +' đơn hàng ' + order.phone+ ' sản phẩm '+order.title+' số lượng ' +order.soluong +' thành tiền '+order.total)
      controller.addDialog(conEndOrder)
      bot.beginDialog('orderend')
     });

     }
    
   } catch (error) {
   
    console.log(error)
   }
  

 
 },'address','ansaddress');
//  conver.ask('nhập số lượng',async(response,convo,bot)=>{
//   return await convo.gotoThread('ansadd')
// },'soluong')

bot.beginDialog('convo')

 }
controller.on('facebook_postback', async(bot, message) => {
  var product=JSON.parse(message.text);
await  order(product,controller,bot) 
});      
};
