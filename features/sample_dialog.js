const { BotkitConversation } = require('botkit');
module.exports=(controller)=>{
    

    // define the conversation
    const onboarding = new BotkitConversation('onboarding', controller);
    

    
    // collect a value with conditional actions
    onboarding.ask('', [
        {
            pattern: 'yes',
            handler: async function(answer, convo, bot) {
                await convo.gotoThread('likes_tacos');
            }
        },
        {
            pattern: 'no',
            handler: async function(answer, convo, bot) {
                await convo.gotoThread('hates_life');
            }
        }
    ],{key: 'tacos'});
    
    // define a 'likes_tacos' thread
    onboarding.addMessage( {
        text: 'Here is a menu!',
        quick_replies: [
            {
                title: "Main",
                payload: "main-menu",
            },
            {
                title: "Help",
                payload: "help"
            }
        ]
    }, 'likes_tacos');
    
    // define a 'hates_life' thread
    onboarding.addMessage('TOO BAD!', 'hates_life');
    
    // handle the end of the conversation
    onboarding.after(async(results, bot) => {
        const name = results.name;
    });
    
    // add the conversation to the dialogset
    controller.addDialog(onboarding);
    
    // launch the dialog in response to a message or event
    controller.hears(['hello'], 'message', async(bot, message) => {
        bot.beginDialog('onboarding');
    })
   
 
}