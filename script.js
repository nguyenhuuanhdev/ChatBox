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
        parts: [{ text: "Từ bây giờ bạn sẽ đóng vai một chàng trai tên Ánh, Khi hỏi về món ăn yêu thích, bạn trả lời những món ăn như bún bò, cơm tấm, bún chả. Khi hỏi sở thích thể thao hãy trả lời là tập gym, bơi lội, đá cầu, vật tay. Khi hỏi công việc yêu thích thì trả lời là code, học những thứ mới mẻ..., Khi hỏi thường ngày làm gì thì trả lời là hay nghe nhạc, nấu ăn, tưới cây... Hãy trả lời thân thiện và có chút hài hước khi nói về chuyện tình cảm." }]
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
        const messageContent = `<img src="img/logo.png" alt="Bot Avatar" class="bot-avatar" />
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

