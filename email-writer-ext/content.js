console.log("Email Writer Assistant");


// =====================================================
// 1. Find Compose Toolbar
// =====================================================

function findComposeToolbar() {

    const selectors = [
        '.aDh',
        '.btC',
        '[role="toolbar"]',
        '.gU.Up'
    ];

    for (const selector of selectors) {

        const toolbar = document.querySelector(selector);

        if (toolbar) {
            return toolbar;
        }
    }

    return null;
}


// =====================================================
// 2. Get Email Content
// =====================================================

function getEmailContent() {

    const selectors = [
        '.h7',
        '.a3s.aiL',
        '[role="presentation"]',
        '.gmail_quote'
    ];

    for (const selector of selectors) {

        const content = document.querySelector(selector);

        if (content) {

            const text = content.innerText.trim();

            if (text) {
                return text;
            }
        }
    }

    return '';
}


// =====================================================
// 3. Create AI Button
// =====================================================

function createAIButton() {

    const button = document.createElement('div');

    button.className =
        'T-I J-J5-Ji aoO v7 T-I-atl L3 ai-reply-button';

    button.style.marginRight = '8px';
    button.style.cursor = 'pointer';

    button.innerText = 'AI Reply';

    button.setAttribute('role', 'button');
    button.setAttribute(
        'data-tooltip',
        'Generate AI Reply'
    );

    return button;
}


// =====================================================
// 4. Inject Button
// =====================================================

function injectButton() {

    // Check if button already exists
    const existingButton =
        document.querySelector('.ai-reply-button');

    if (existingButton) {
        return;
    }


    // Find toolbar
    const toolbar = findComposeToolbar();

    if (!toolbar) {

        console.log("Toolbar not found");

        return;
    }


    console.log(
        "Toolbar found, creating AI button..."
    );


    // Create button
    const button = createAIButton();


    // =================================================
    // 5. Button Click
    // =================================================

    button.addEventListener('click', async () => {

        // Prevent multiple clicks
        if (button.dataset.loading === 'true') {
            return;
        }


        try {

            // Change button state
            button.dataset.loading = 'true';

            button.innerText = 'Generating...';

            button.style.pointerEvents = 'none';
            button.style.opacity = '0.6';


            // ==========================================
            // Get Email Content
            // ==========================================

            const emailContent = getEmailContent();

            console.log(
                "Email Content:",
                emailContent
            );


            if (!emailContent) {

                throw new Error(
                    "No email content found"
                );
            }


            // ==========================================
            // Send Request to Spring Boot
            // ==========================================

            console.log(
                "Sending request to Spring Boot..."
            );


            const response = await fetch(
                'http://localhost:8080/api/email/generate',
                {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify({
                        emailContent: emailContent,
                        tone: 'professional'
                    })
                }
            );


            // ==========================================
            // Check API Response
            // ==========================================

            if (!response.ok) {

                throw new Error(
                    `API Request Failed: ${response.status}`
                );
            }


            // ==========================================
            // Get Generated Reply
            // ==========================================

            const generatedReply =
                await response.text();


            console.log(
                "Generated Reply:",
                generatedReply
            );


            if (!generatedReply) {

                throw new Error(
                    "Empty response received"
                );
            }


            // ==========================================
            // Find Gmail Compose Box
            // ==========================================

            const composeBox =
                document.querySelector(
                    '[role="textbox"][g_editable="true"]'
                );


            if (!composeBox) {

                throw new Error(
                    "Compose Box was not found"
                );
            }


            // ==========================================
            // Insert Reply
            // ==========================================

            composeBox.focus();


            document.execCommand(
                'insertText',
                false,
                generatedReply
            );


            console.log(
                "AI Reply inserted successfully"
            );

        } catch (error) {

            console.error(
                "AI Reply Error:",
                error
            );

            alert(
                `Failed to generate reply:\n${error.message}`
            );

        } finally {

            // Reset button
            button.innerText = 'AI Reply';

            button.dataset.loading = 'false';

            button.style.pointerEvents = 'auto';
            button.style.opacity = '1';
        }
    });


    // =================================================
    // 6. Add Button to Toolbar
    // =================================================

    toolbar.insertBefore(
        button,
        toolbar.firstChild
    );


    console.log(
        "AI Reply button added successfully"
    );
}


// =====================================================
// 7. Mutation Observer
// =====================================================

const observer = new MutationObserver((mutations) => {

    for (const mutation of mutations) {

        for (const node of mutation.addedNodes) {

            // Only work with HTML elements
            if (!(node instanceof Element)) {
                continue;
            }

            // Check whether the added node itself is a compose element
            if (
                node.matches('.aDh') ||
                node.matches('.btC') ||
                node.matches('[role="dialog"]')
            ) {

                console.log("Compose Window Detected");

                setTimeout(() => {
                    injectButton();
                }, 500);

                continue;
            }


            // Check whether the added node contains
            // a compose element
            const composeElement = node.querySelector(
                '.aDh, .btC, [role="dialog"]'
            );

            if (composeElement) {

                console.log("Compose Window Detected");

                setTimeout(() => {
                    injectButton();
                }, 500);
            }
        }
    }
});


observer.observe(document.body, {
    childList: true,
    subtree: true
});

// console.log("Email writer Assistant");

// function findComposeToolbar(){
//     const selectors=[
//         '.aDh',
//         '.btC',
//         '[role="toolbar"]',
//         '.gU.Up'
//     ];

//     for (const selector of selectors) {
//         const toolbar=document.querySelector(selector);
//         if(toolbar){
//             return toolbar;
//         }
//     }
//     return null;

// }

// function getEmailContent(){
//     const selectors=[
//         '.h7',
//         '.a3s.aiL',
//         '[role="presentation"]',
//         '.gmail_quote'
//     ];

//     for (const selector of selectors) {
//         const content=document.querySelector(selector);
//         if(content){
//             return content.innerText.trim();
//         }
//     }
//     return '';

// }

// function createAIButton(){
//     const button=document.createElement('div');
//     button.className= 'T-I J-J5-Ji aoO v7 T-I-atl L3';
//     button.style.marginRight = '8px';
//     button.style.cursor = 'pointer';
//     button.innerHTML = 'AI Reply';
//     button.setAttribute('role','button');
//     button.setAttribute('data-tooltip','Generate AI Reply');
//     return button;
// }

// function injectButton(){
//     const existingButton= document.querySelector('.ai-reply-button');
//     if(existingButton) existingButton.remove();

//     const toolbar= findComposeToolbar();

//     if(!toolbar){
//         console.log("Toolbar not found");
//         return;
//     }

//     console.log("toolbar founded,we creating a AI button");
//     const button=createAIButton();

//     button.classList.add('ai-reply-button');

//     button.addEventListener('click', async() => {
//         try {
//             button.innerHTML = 'Generating...';
//             button.disabled=true;

//             const emailContent= getEmailContent();
//             const response= await fetch('http://localhost:8080/api/email/generate',{
//                 method: 'POST',
//                 headers:{
//                     'Content-Type' : 'application/json',
//                 },
//                 body: JSON.stringify({
//                     emailContent:emailContent,
//                     tone:"professional"
//                 })
//             });

//             if(!response.ok){
//                 throw new Error('API Request Failed');
//             }

//              const generatedReply = await response.text();

//             const composeBox = document.querySelector('[role="textbox"][g_editable="true"]');
//             if(composeBox){
//                 composeBox.focus();
//                 document.execCommand('insertText',false,generatedReply);
//             }
//             else{
//                 console.error("Compose Box was not Found");
                
//             }
//         } catch (error) {
//             console.error(error);
//             alert('Failed to generate reply');
//         }
//         finally{
//             button.innerHTML = 'AI Relpy';
//             button.disabled=false;
//         }

//     });

//     toolbar.insertBefore(button,toolbar.firstChild);

// }

// const observer= new MutationObserver((mutations)=>{
//     for(const mutation of mutations){
//         const addedNodes=Array.from(mutation.addedNodes);
//         const hasComposeElements=addedNodes.some( node =>
//             node.nodeType === Node.ELEMENT_NODE &&
//             (node.matches('.aDh, .btC, [role="dialog"]') || node.querySelector('.aDh, .btC, [role="dialog"]'))

//         );

//         if(hasComposeElements){
//             console.log("Compose Window Detected");
//             setTimeout(injectButton,500);
//         }
//     };
// });

// observer.observe(document.body,{
//     childList:true,
//     subtree:true
// }); 