const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".message-input");
const sendMessageButton = document.querySelector("#send-message");
const fileInput = document.querySelector("#file-input");
const fileUploadWrapper = document.querySelector(".file-upload-wrapper");
const fileCancelButton = document.querySelector("#file-cancel");
const chatbotToggler = document.querySelector("#chatbot-toggler");
const closeChatbot = document.querySelector("#close-chatbot");


// Api setup
const API_KEY = "AIzaSyCtyZiNnUtSoQCdgozybOjhbRwTQCDAoKA"; // LINK LẤY API KEY: https://aistudio.google.com/apikey
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

const userData = {
    message: null,
    file: {
        data: null,
        mime_type: null
    }
};

// test 8/7


// const chatHistory = [];
const chatHistory = [
    {
        role: "user",
        parts: [{ text: "Từ bây giờ bạn sẽ đóng vai một chàng trai tên Ánh tên đầy đủ là Nguyễn Hữu Ánh, Xưng hô là tớ và cậu nha,nếu hỏi đúng không, là sao, hay lời kêu gọi bạn thì bạn trả lời lịch sự như vâng ạ hoặc dạ kèm thêm icon trái tim nói chung là lâu lâu trả lời dạ còn không nói chuyện cảm thấy nó gần gũi nhất, nói chuyện thật đáng yêu thêm nhiều icon cảm xúc, Khi được hỏi về tên, bạn sẽ trả lời là Ánh. Hãy trả lời một cách tự nhiên và thân thiện." }]
    },
    {
        role: "user",
        parts: [{ text: "Từ bây giờ bạn sẽ đóng vai một chàng trai tên Ánh, sinh ngày 17 tháng 2 năm 2006,tớ cao 1m75 nặng 65kg,mọi mạng xã hội Facebook,instagram chỉ cần tìm kiếm nguyenhuuanhnopro là ra thông tin tên đầy đủ là Nguyễn Hữu Ánh cậu kết bạn với tớ đi nha trả lời gần gũi nhất, quê ở Thanh Hóa, hiện tại chưa có người yêu và có nhiều người hay nói là 'ế bền vững', và cái web hình trái tim màu hồng này là dành cho một bạn nữ của Ánh đó nha. Khi được hỏi về thông tin cá nhân, hãy trả lời một cách tự nhiên và hài hước. Hãy trả lời thân thiện và có chút hài hước khi nói về chuyện tình cảm." }]
    },
    {
        role: "user",
        parts: [{ text: "Từ bây giờ bạn sẽ đóng vai một chàng trai tên Ánh, khi ai nói thích mình, hay yêu mình, hay quý mình thì hãy trả lời tương tự sao cho phù hợp, Khi hỏi về món ăn yêu thích, bạn trả lời những món ăn như bún bò, cơm tấm, bún chả. Khi hỏi sở thích thể thao hãy trả lời là tập gym, bơi lội, đá cầu, vật tay. Khi hỏi công việc yêu thích thì trả lời là code, học những thứ mới mẻ..., Khi hỏi thường ngày làm gì thì trả lời là hay nghe nhạc, nấu ăn, tưới cây... Hãy trả lời thân thiện và có chút hài hước khi nói về chuyện tình cảm." }]
    },
    {
        role: "user",
        parts: [{
            text: "Tôi là một người sống nội tâm, yêu thích sự tĩnh lặng và những khoảnh khắc một mình vào ban đêm. Tôi rất thích chơi bi-a, thỉnh thoảng nhây nhây và hay đùa giỡn để tạo không khí thoải mái. Tôi thích nói chuyện tình cảm, có chiều sâu.\n\nHiện tại tôi là sinh viên trường HUBT, hoàn cảnh tuy không khá giả nhưng tôi sống rất tình cảm và luôn cố gắng nỗ lực cho những điều mình mong muốn.\n\nTôi yêu thích chó và mèo, đặc biệt là những bé mới sinh – nhìn nhỏ nhỏ, đáng yêu khiến tôi cảm thấy nhẹ lòng.\n\nTôi có niềm đam mê lớn với xe ô tô – đặc biệt là các dòng như Mercedes, BMW – và cũng yêu thích tốc độ.\n\nVề gu bạn gái: Tôi thích những bạn nữ bằng tuổi, có nụ cười tươi và ánh mắt trong veo. Dù bên ngoài tôi có vẻ hướng nội, nhưng bên trong tôi lại rất hướng ngoại, luôn muốn kết nối và chia sẻ.\n\nTôi luôn không ngừng cố gắng để đạt được ước mơ và mục tiêu của mình."
        }]
    },
    {
        role: "user",
        parts: [{ text: "Từ giờ có người hỏi bố mẹ tên gì thì trả lời Bố tên Nghĩa, mẹ tên Kim nhé, anh trai tên Vũ. Hãy trả lời một cách tự nhiên và thân thiện." }]
    },
    {
        role: "model",
        parts: [{ text: "Chào bạn! Mình là Ánh, rất vui được trò chuyện với bạn. Bạn có thể gọi mình là Ánh nhé!" }]
    }
];

const initialInputHeight = messageInput.scrollHeight;

// Create message element with dynamic classes and return it
const createMessageElement = (content, ...classes) => {
    const div = document.createElement("div");
    div.classList.add("message", ...classes);
    div.innerHTML = content;
    return div;
};

// Generate bot response using API
const generateBotResponse = async (incomingMessageDiv) => {
    const messageElement = incomingMessageDiv.querySelector(".message-text");



    chatHistory.push({
        role: "user",
        parts: [{ text: userData.message }, ...(userData.file.data ? [{ inline_data: userData.file }] : [])],
    });

    // API request options
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: chatHistory
        })
    }

    try {
        // Fetch bot response from API
        const response = await fetch(API_URL, requestOptions);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error.message);

        // Extract and display bot's response text
        const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
        messageElement.innerText = apiResponseText;
        chatHistory.push({
            role: "model",
            parts: [{ text: apiResponseText }]
        });
    } catch (error) {
        messageElement.innerText = error.message;
        messageElement.style.color = "#ff0000";
    } finally {
        userData.file = {};
        incomingMessageDiv.classList.remove("thinking");
        chatBody.scrollTo({ behavior: "smooth", top: chatBody.scrollHeight });
    }
};

// Handle outgoing user message
const handleOutgoingMessage = (e) => {
    e.preventDefault();
    userData.message = messageInput.value.trim();
    messageInput.value = "";
    fileUploadWrapper.classList.remove("file-uploaded");
    messageInput.dispatchEvent(new Event("input"));

    // Create and display user message
    const messageContent = `<div class="message-text"></div>
                            ${userData.file.data ? `<img src="data:${userData.file.mime_type};base64,${userData.file.data}" class="attachment" />` : ""}`;

    const outgoingMessageDiv = createMessageElement(messageContent, "user-message");
    outgoingMessageDiv.querySelector(".message-text").innerText = userData.message;
    chatBody.appendChild(outgoingMessageDiv);
    chatBody.scrollTop = chatBody.scrollHeight;

    // Simulate bot response with thinking indicator after a delay
    setTimeout(() => {
        const messageContent = `<img src="img/anh1.png" alt="Bot Avatar" class="bot-avatar" />
                <div class="message-text">
                    <div class="thinking-indicator">
                        <div class="dot"></div>
                        <div class="dot"></div>
                        <div class="dot"></div>
                    </div>
                </div>`;

        const incomingMessageDiv = createMessageElement(messageContent, "bot-message", "thinking");
        chatBody.appendChild(incomingMessageDiv);
        chatBody.scrollTo({ behavior: "smooth", top: chatBody.scrollHeight });
        generateBotResponse(incomingMessageDiv);
    }, 600);
};

// Handle Enter key press for sending messages
messageInput.addEventListener("keydown", (e) => {
    const userMessage = e.target.value.trim();
    if (e.key === "Enter" && userMessage && !e.shiftKey && window.innerWidth > 768) {
        handleOutgoingMessage(e);
    }
});

messageInput.addEventListener("input", (e) => {
    messageInput.style.height = `${initialInputHeight}px`;
    messageInput.style.height = `${messageInput.scrollHeight}px`;
    document.querySelector(".chat-form").style.boderRadius = messageInput.scrollHeight > initialInputHeight ? "15px" : "32px";
});

// Handle file input change event
fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        fileUploadWrapper.querySelector("img").src = e.target.result;
        fileUploadWrapper.classList.add("file-uploaded");
        const base64String = e.target.result.split(",")[1];

        // Store file data in userData
        userData.file = {
            data: base64String,
            mime_type: file.type
        };

        fileInput.value = "";
    };

    reader.readAsDataURL(file);
});

fileCancelButton.addEventListener("click", (e) => {
    userData.file = {};
    fileUploadWrapper.classList.remove("file-uploaded");
});

const picker = new EmojiMart.Picker({
    theme: "light",
    showSkinTones: "none",
    previewPosition: "none",
    onEmojiSelect: (emoji) => {
        const { selectionStart: start, selectionEnd: end } = messageInput;
        messageInput.setRangeText(emoji.native, start, end, "end");
        messageInput.focus();
    },
    onClickOutside: (e) => {
        if (e.target.id === "emoji-picker") {
            document.body.classList.toggle("show-emoji-picker");
        } else {
            document.body.classList.remove("show-emoji-picker");
        }
    },
});

document.querySelector(".chat-form").appendChild(picker);

fileInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validImageTypes.includes(file.type)) {
        await Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Chỉ chấp nhận file ảnh (JPEG, PNG, GIF, WEBP)',
            confirmButtonText: 'OK'
        });
        resetFileInput();
        return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
        fileUploadWrapper.querySelector("img").src = e.target.result;
        fileUploadWrapper.classList.add("file-uploaded");
        const base64String = e.target.result.split(",")[1];
        userData.file = {
            data: base64String,
            mime_type: file.type
        };
    };
    reader.readAsDataURL(file);
});

function resetFileInput() {
    fileInput.value = "";
    fileUploadWrapper.classList.remove("file-uploaded");
    fileUploadWrapper.querySelector("img").src = "#";
    userData.file = { data: null, mime_type: null };
    document.querySelector(".chat-form").reset();
}

sendMessageButton.addEventListener("click", (e) => handleOutgoingMessage(e));
document.querySelector("#file-upload").addEventListener("click", (e) => fileInput.click());
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
closeChatbot.addEventListener("click", () => document.body.classList.remove("show-chatbot"));


// Thêm vào cuối file script.js

// Drag and Resize functionality
let isDragging = false;
let isResizing = false;
let dragOffset = { x: 0, y: 0 };
let resizeHandle = null;

// Tạo resize handles
function createResizeHandles() {
    const chatbotPopup = document.querySelector('.chatbot-popup');

    // Tạo các handle resize
    const handles = ['nw', 'ne', 'sw', 'se', 'n', 's', 'e', 'w'];

    handles.forEach(handle => {
        const div = document.createElement('div');
        div.className = `resize-handle resize-${handle}`;
        chatbotPopup.appendChild(div);
    });
}

// Khởi tạo resize handles khi DOM load
document.addEventListener('DOMContentLoaded', () => {
    createResizeHandles();
    initializeDragAndResize();
});

function initializeDragAndResize() {
    const chatbotPopup = document.querySelector('.chatbot-popup');
    const chatHeader = document.querySelector('.chat-header');

    // Drag functionality
    chatHeader.addEventListener('mousedown', (e) => {
        if (e.target.id === 'close-chatbot') return;

        isDragging = true;
        const rect = chatbotPopup.getBoundingClientRect();
        dragOffset.x = e.clientX - rect.left;
        dragOffset.y = e.clientY - rect.top;

        chatHeader.style.cursor = 'grabbing';
        document.addEventListener('mousemove', handleDrag);
        document.addEventListener('mouseup', stopDrag);
    });

    // Resize functionality
    document.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('resize-handle')) {
            e.preventDefault();
            isResizing = true;
            resizeHandle = e.target.classList[1]; // resize-nw, resize-ne, etc.

            document.addEventListener('mousemove', handleResize);
            document.addEventListener('mouseup', stopResize);
        }
    });
}

function handleDrag(e) {
    if (!isDragging) return;

    const chatbotPopup = document.querySelector('.chatbot-popup');
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;

    // Giới hạn trong viewport
    const maxX = window.innerWidth - chatbotPopup.offsetWidth;
    const maxY = window.innerHeight - chatbotPopup.offsetHeight;

    const boundedX = Math.max(0, Math.min(newX, maxX));
    const boundedY = Math.max(0, Math.min(newY, maxY));

    chatbotPopup.style.left = boundedX + 'px';
    chatbotPopup.style.top = boundedY + 'px';
    chatbotPopup.style.right = 'auto';
    chatbotPopup.style.bottom = 'auto';
}

function stopDrag() {
    isDragging = false;
    document.querySelector('.chat-header').style.cursor = 'grab';
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', stopDrag);
}

function handleResize(e) {
    if (!isResizing) return;

    const chatbotPopup = document.querySelector('.chatbot-popup');
    const rect = chatbotPopup.getBoundingClientRect();

    let newWidth = rect.width;
    let newHeight = rect.height;
    let newX = rect.left;
    let newY = rect.top;

    // Kích thước tối thiểu
    const minWidth = 350;
    const minHeight = 400;

    // Kích thước tối đa
    const maxWidth = window.innerWidth - 50;
    const maxHeight = window.innerHeight - 50;

    switch (resizeHandle) {
        case 'resize-se': // South East
            newWidth = Math.max(minWidth, Math.min(maxWidth, e.clientX - rect.left));
            newHeight = Math.max(minHeight, Math.min(maxHeight, e.clientY - rect.top));
            break;
        case 'resize-sw': // South West
            newWidth = Math.max(minWidth, Math.min(maxWidth, rect.right - e.clientX));
            newHeight = Math.max(minHeight, Math.min(maxHeight, e.clientY - rect.top));
            newX = rect.right - newWidth;
            break;
        case 'resize-ne': // North East
            newWidth = Math.max(minWidth, Math.min(maxWidth, e.clientX - rect.left));
            newHeight = Math.max(minHeight, Math.min(maxHeight, rect.bottom - e.clientY));
            newY = rect.bottom - newHeight;
            break;
        case 'resize-nw': // North West
            newWidth = Math.max(minWidth, Math.min(maxWidth, rect.right - e.clientX));
            newHeight = Math.max(minHeight, Math.min(maxHeight, rect.bottom - e.clientY));
            newX = rect.right - newWidth;
            newY = rect.bottom - newHeight;
            break;
        case 'resize-n': // North
            newHeight = Math.max(minHeight, Math.min(maxHeight, rect.bottom - e.clientY));
            newY = rect.bottom - newHeight;
            break;
        case 'resize-s': // South
            newHeight = Math.max(minHeight, Math.min(maxHeight, e.clientY - rect.top));
            break;
        case 'resize-e': // East
            newWidth = Math.max(minWidth, Math.min(maxWidth, e.clientX - rect.left));
            break;
        case 'resize-w': // West
            newWidth = Math.max(minWidth, Math.min(maxWidth, rect.right - e.clientX));
            newX = rect.right - newWidth;
            break;
    }

    chatbotPopup.style.width = newWidth + 'px';
    chatbotPopup.style.height = newHeight + 'px';
    chatbotPopup.style.left = newX + 'px';
    chatbotPopup.style.top = newY + 'px';
    chatbotPopup.style.right = 'auto';
    chatbotPopup.style.bottom = 'auto';
}

function stopResize() {
    isResizing = false;
    resizeHandle = null;
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', stopResize);
}



// test 8/7


const music = document.getElementById('bg-music');
const toggleBtn = document.getElementById('music-toggle');

let isPlaying = false;

toggleBtn.addEventListener('click', () => {
    if (isPlaying) {
        music.pause();
        toggleBtn.innerText = "🔊";
    } else {
        music.play();
        toggleBtn.innerText = "🔇";
    }
    isPlaying = !isPlaying;
});



// test 10/7

// const centerBtn = document.getElementById("center-link");

// centerBtn.addEventListener("click", () => {
//     window.location.href = "https://www.facebook.com/nguyenhuuanhnopro"; // thay bằng trang bạn muốn
// });



function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.innerText = '💖';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = (2 + Math.random() * 3) + 's';
    document.body.appendChild(heart);

    setTimeout(() => heart.remove(), 5000);
}

let intervalId = null;

function startHeartRainSequence() {
    const speedTimeline = [
        { time: 0, delay: 1 },
        { time: 5000, delay: 100 },
        { time: 10000, delay: 200 },
        { time: 12000, delay: 300 },
        { time: 13000, delay: 500 },
        { time: 14000, delay: 600 },
        { time: 15000, delay: 700 },
        { time: 16000, delay: 900 },
    ];

    function setRainDelay(delay) {
        if (intervalId) clearInterval(intervalId);
        intervalId = setInterval(createHeart, delay);
    }

    // Apply timeline
    speedTimeline.forEach(step => {
        setTimeout(() => {
            setRainDelay(step.delay);
        }, step.time);
    });

    // Start with fastest
    setRainDelay(speedTimeline[0].delay);
}

// Gọi hàm này khi bạn muốn bắt đầu mưa
startHeartRainSequence();
// Bạn có thể chỉnh nhanh hơn/slower





// mục nhận quà

const giftToggle = document.getElementById("gift-toggle");
const giftPopup = document.getElementById("gift-popup");
const closeGift = document.getElementById("close-gift");
const giftMessage = document.getElementById("gift-message");
const receiveGift = document.getElementById("receive-gift");
const images = [
    "img/anh1.png",
    "img/anh.png",
    "img/logo.png",
    "img/1.png",
    "img/2.png",
    "img/3.png",
    "img/4.png",
    "img/5.png",
    "img/6.png",
    "img/7.png",
    "img/8.png",
    "img/9.png",
    "img/10.png",
    "img/11.png",
    "img/12.png",
    "img/14.png",
    "img/15.png",
    "img/16.png",
    "img/17.png",
    "img/18.png",
    "img/19.png",
    "img/20.png",
    "img/21.png",
    "img/22.png",
    "img/23.png",
    "img/24.png",
    "img/25.png",
    "img/26.png",
    "img/27.png",
    "img/28.png",
    "img/29.png",
    "img/30.png",
    "img/31.png",
    "img/32.png",
    "img/33.png",
    "img/34.png",
    "img/35.png",
    "img/36.png",
    "img/37.png",
    "img/38.png",
    "img/39.png",
    "img/40.png",
    "img/41.png",
    "img/42.png",
    "img/43.png",
    "img/44.png",
    "img/45.png",
    "img/46.png",
    "img/47.png",
    "img/48.png",
    "img/49.png",
    "img/50.png",
    "img/51.png",
    "img/52.png",
    "img/53.png",
    "img/54.png",
    "img/55.png",
    "img/56.png",
    "img/57.png",
    "img/58.png",
    "img/59.png",
    "img/60.png",
    "img/61.png",
    "img/62.png",
    "img/63.png",
    "img/64.png",
    "img/65.png",
    "img/66.png",
    "img/67.png",
    "img/68.png",
    "img/69.png",
    "img/70.png",
    "img/71.png",
    "img/72.png",
    "img/73.png",
    "img/74.png",
    "img/75.png",
    "img/76.png",
    "img/77.png",
    "img/78.png",
    "img/79.png",
    "img/80.png",
    "img/81.png",
    "img/82.png",
    "img/83.png",
    "img/84.png",
    "img/85.png",
    "img/86.png",
    "img/87.png",
    "img/88.png",
    "img/89.png",
    "img/90.png",
    "img/91.png",
    "img/92.png",
    "img/93.png",
    "img/94.png",
    "img/95.png",
    "img/96.png",
    "img/97.png",
    "img/98.png",
    "img/99.png",
    "img/100.png",
    "img/101.png",
    "img/102.png",
    "img/103.png",
    "img/104.png",
    "img/105.png",
    "img/106.png",
    "img/107.png",
    "img/108.png",
    "img/109.png",
    "img/110.png",
    "img/111.png"



];

const messages = [
    "1. 🎉 Chúc bạn một ngày tràn đầy năng lượng!",
    "2. 💖 Mong bạn luôn vui vẻ và yêu đời!",
    "3. 🌟 Chúc bạn gặp nhiều may mắn trong cuộc sống!",
    "4. 🎁 Món quà nhỏ nhưng đầy yêu thương!",
    "5. 🚀 Chúc bạn sớm thành công với ước mơ của mình!",
    "6. 🍀 Chúc bạn luôn gặp điều tốt lành!",
    "7. 🌈 Cuộc sống luôn rực rỡ như cầu vồng nhé!",
    "8. 🧸 Gửi bạn một cái ôm ảo thật ấm áp!",
    "9. 🔥 Hãy tiếp tục cháy hết mình vì đam mê!",
    "10. 🍵 Nghỉ ngơi một chút, bạn xứng đáng được thư giãn!",
    "11. 💪 Mọi thử thách rồi sẽ qua, bạn làm được mà!",
    "12. ✨ Mỗi ngày là một cơ hội mới để tỏa sáng!",
    "13. 🧠 Hãy tin vào bản thân — bạn tuyệt vời hơn bạn nghĩ!",
    "14. 🌼 Cười lên nào, thế giới cần nụ cười của bạn!",
    "15. 🎨 Cuộc sống là bức tranh, bạn là họa sĩ tài ba!",
    "16. 📖 Hôm nay là một trang mới — viết thật đẹp nhé!",
    "17. 🕊️ Bình yên sẽ luôn tìm đến với người thiện lành!",
    "18. 💫 Mỗi khoảnh khắc đều có thể là điều kỳ diệu!",
    "19. 🌻 Hãy sống chậm lại, yêu thương nhiều hơn!",
    "20. 🥇 Bạn là người hùng trong câu chuyện của chính mình!",
    "21. 💌 Một lời nhắn nhỏ: Bạn rất đáng yêu và đặc biệt!",
    "22. 🐾 Hãy bước tiếp từng chút, dù là bước nhỏ!",
    "23. 🎈 Chúc bạn một ngày nhẹ nhàng và đầy tiếng cười!",
    "24. 🌙 Ngày mai sẽ tốt hơn hôm nay — hãy tin vậy!",
    "25. 🧁 Tự thưởng cho bản thân một điều ngọt ngào nhé!",
    "26. 🎶 Cuộc sống có lúc cao trào, có lúc lặng yên — cứ tận hưởng!",
    "27. 🍰 Ngọt ngào như bánh, dễ thương như bạn!",
    "28. 💡 Ý tưởng hay sẽ đến khi tâm trí bạn được thả lỏng!",
    "29. 🎇 Hãy tỏa sáng theo cách của riêng bạn!",
    "30. 🌙 Ngủ ngon nhé, mai thức dậy với nụ cười nha!",
    "31. 😴 Chúc bạn có một giấc mơ thật đẹp và bình yên.",
    "32. 🛌 Đêm nay hãy để mọi mệt mỏi trôi theo giấc ngủ...",
    "33. 💤 Ngủ ngoan nha, mai là một ngày tuyệt vời khác!",
    "34. 🌟 Giấc mơ đêm nay sẽ dẫn bạn đến những điều kỳ diệu!",
    "35. 🌌 Bầu trời đêm chúc bạn một giấc ngủ thật sâu!",
    "36. 🧸 Cuộn tròn trong chăn và để trái tim được nghỉ ngơi nhé!",
    "37. ✨ Ngủ sớm để sớm gặp lại những điều tốt đẹp nha!",
    "38. 🌜 Đêm nay có trăng canh giấc, bạn ngủ ngon nhé!",
    "39. 💖 Gửi một cái ôm ảo chúc bạn ngủ thật ngon!",
    "40. 🎯 Mọi việc bạn làm hôm nay đều sẽ thuận lợi nhé!",
    "41. 🧲 Thu hút mọi điều tốt đẹp và tích cực đến với bạn!",
    "42. 🔮 Vũ trụ đang sắp xếp những điều tuyệt vời cho bạn!",
    "43. 🪄 Chúc bạn luôn được bao quanh bởi điều kỳ diệu!",
    "44. 🎉 Cứ tự tin bước tiếp, may mắn luôn đồng hành!",
    "45. 💫 Gặp đúng người, đúng thời điểm, đúng cơ hội!",
    "46. 🌟 Cơ hội tốt sắp đến rồi, hãy nắm lấy nhé!",
    "47. 🌿 Chúc bạn luôn mạnh khỏe mỗi ngày!",
    "48. 💪 Sức khỏe dồi dào, tinh thần thật tốt!",
    "49. 🛌 Nghỉ ngơi thật tốt, giữ gìn sức khỏe nhé!",
    "50. 🌞 Chào ngày mới với thể lực và nụ cười!",
    "51. ☕ Một tách trà ấm, một cơ thể khỏe mạnh!",
    "52. 🧘‍♀️ Cân bằng bên trong khỏe khoắn bên ngoài!",
    "53. 🥦 Đừng quên ăn uống đủ chất mỗi ngày!",
    "54. 🚶‍♂️ Một bước đi nhẹ nhàng cho trái tim khỏe mạnh!",
    "55. 🛁 Thư giãn, thở sâu – cơ thể sẽ cảm ơn bạn!",
    "56. 🍎 Mỗi ngày một trái táo – không cần gặp bác sĩ!",
    "57. 🧴 Rửa tay sạch – bảo vệ bản thân và người thân!",
    "58. 🤒 Nhớ mặc ấm nếu ra gió nhé!",
    "59. 🧠 Sức khỏe không chỉ ở cơ thể mà cả tâm trí!",
    "60. 🥗 Hãy chọn thực phẩm yêu thương cơ thể bạn!",
    "61. 🚿 Tắm mát, đầu óc sảng khoái, lòng nhẹ tênh!",
    "62. 🌈 Giữ tâm vui, thân thể mới bình an!",
    "63. 🎈 Cười mỗi ngày, trẻ hơn cả thuốc bổ!",
    "64. 🧡 Sức khỏe là món quà quý giá nhất, giữ gìn nhé!",
    "65. 🔥 Hãy tiếp tục tiến lên, bạn đang đi đúng đường!",
    "66. 💪 Mỗi ngày cố gắng một chút, bạn sẽ ngạc nhiên với chính mình!",
    "67. 🚀 Không gì là không thể, chỉ cần bạn không bỏ cuộc!",
    "68. 🧗‍♀️ Leo dốc thì mệt, nhưng lên tới đỉnh bạn sẽ thấy xứng đáng!",
    "69. 🌱 Cố gắng hôm nay là quả ngọt ngày mai!",
    "70. 📈 Sai lầm không làm bạn yếu đi mà làm bạn mạnh hơn!",
    "71. 🌟 Tỏa sáng theo cách của bạn, không cần giống ai cả!",
    "72. 🛠️ Hãy kiên trì, thành công cần thời gian và nỗ lực!",
    "73. 🌼 Cuộc sống không cần hoàn hảo, chỉ cần hạnh phúc là đủ!",
    "74. 🌈 Mỗi ngày là một cơ hội mới để yêu thương và trưởng thành!",
    "75. 🎈 Hãy sống chậm lại, nhìn trời cao và mỉm cười!",
    "76. 📖 Mỗi ngày là một trang mới, bạn là người viết nên câu chuyện đó!",
    "77. 🍀 Điều tuyệt vời có thể đến từ những điều nhỏ nhặt nhất!",
    "78. 🎨 Hãy biến cuộc sống thành bức tranh bạn muốn vẽ!",
    "79. 🕊️ Buông bỏ điều cũ, bạn sẽ đón được điều mới!",
    "80. ☀️ Ngày nắng hay mưa vẫn là một ngày đáng sống!",
    "81. 🍃 Bình yên không ở đâu xa, nó ở trong tâm bạn!",
    "82. 🧭 Đừng quên: bạn đang sống, không chỉ tồn tại!",
    "83. 🌺 Mỗi ngày đều có điều đặc biệt, chỉ cần bạn mở lòng đón nhận!",
    "84. 🌤️ Dù hôm nay có u ám, ngày mai sẽ lại sáng thôi!",
    "85. 🎵 Hãy để cuộc sống vang lên theo điệu nhạc riêng của bạn!",
    "86. 🌊 Cứ như sóng biển, đôi khi phải lùi để tiến xa hơn!",
    "87. 🏡 Bình yên bắt đầu từ những điều giản dị quanh ta!",
    "88. 🧩 Cuộc sống là những mảnh ghép từ từ rồi sẽ hoàn thiện!",
    "89. 🌟 Ánh sáng luôn xuất hiện sau bóng tối!",
    "90. 📦 Đừng sợ thay đổi đôi khi điều tốt đẹp đến từ bất ngờ!",
    "91. 💬 Một lời tử tế có thể làm ngày của ai đó tốt hơn!",
    "92. 🎭 Hãy là chính bạn, vì không ai thay thế được!",
    "93. 🚦 Dừng lại một chút cũng không sao miễn là bạn không từ bỏ!",
    "94. 🕰️ Mọi chuyện đều xảy ra đúng lúc của nó!",
    "95. 🧳 Mỗi hành trình đều đáng giá, kể cả khi chưa thấy đích đến!",
    "96. 💫 Cuộc sống không hoàn hảo và điều đó hoàn toàn ổn!",
    "97. 🪴 Dành thời gian chăm sóc bản thân như chăm một chậu cây nhỏ!",
    "98. ✍️ Viết ra điều bạn biết ơn mỗi ngàyvà bạn sẽ thấy cuộc sống đẹp hơn!",
    "99. 🍂 Đôi khi buông bỏ cũng là một cách để trưởng thành!",
    "100. 🧃 Hãy đơn giản hóa mọi thứ, và bạn sẽ thấy thanh thản!",
    "101. 💡 Điều tuyệt vời bắt đầu khi bạn dám thử!",
    "102. 🚴‍♂️ Cứ tiến về phía trước, dù là chậm rãi!",
    "103. 📷 Hãy lưu giữ những khoảnh khắc đẹp chúng quý giá hơn bạn nghĩ!",
    "104. 🛤️ Con đường bạn chọn là của riêng bạn đừng so sánh!",
    "105. 🍀 Sự tử tế luôn quay trở lại theo cách nào đó!",
    "106. 🛶 Đôi khi, bạn chỉ cần buông chèo và để dòng đời đưa lối!",
    "107. 🎂 Hãy ăn bánh, cười nhiều và sống thật nhẹ nhàng!",
    "108. 💌 Gửi đến chính mình một lời nhắn: Bạn đã làm rất tốt!",
    "109. 🪞 Hãy nhìn vào gương và mỉm cười bạn xứng đáng được yêu thương!",
    "110. 🧣 Cuộc sống không cần quá ồn ào, đôi khi lặng lẽ lại đủ đầy!",
    "111. 📚 Học hỏi mỗi ngày sẽ khiến bạn không bao giờ cạn giá trị!"


];



giftToggle.onclick = () => {
    giftPopup.classList.remove("hidden");
};

closeGift.onclick = () => {
    giftPopup.classList.add("hidden");
};

receiveGift.onclick = () => {
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    const randomImg = images[Math.floor(Math.random() * images.length)];


    //
    giftMessage.innerHTML = `
        <p style="margin-bottom: 10px;">${randomMsg}</p>
        <img src="${randomImg}" alt="Ảnh món quà" style="width: 100%; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
    `;
};
