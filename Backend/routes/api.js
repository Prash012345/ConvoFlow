const { Router } = require("express");
const router = Router();
const authCheck = require("../middleware/authCheck");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../inc/config");
const { tokenBlacklist } = require("../inc/config");
const { User, Chat, Message } = require("../inc/db");
const bcrypt = require('bcrypt');



// LOGIN & REGISTRATION

router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    const avatar = "test.jpg";
    const saltRounds = 10;  // Adjust this for stronger hashing

    try {
        // 1. Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 2. Create the user with the hashed password
        const usrCreate = await User.create({
            name,
            email,
            password: hashedPassword,  // Save the hashed password
            avatar
        });

        // 3. Respond with success if user creation was successful
        if (usrCreate) {
            res.json({
                msg: "User created successfully!",
                Details: usrCreate
            });
        } else {
            res.status(404).json({
                msg: "User creation failed!"
            });
        }

    } catch (error) {
        // 4. Handle any errors (hashing error, database error, etc.)
        console.error(error);
        res.status(500).json({
            msg: "Server Error",
            error: error.message
        });
    }
});


router.post("/profileupdate", async (req, res) => {

    const { id, name, email, password } = req.body;
    const avatar = "test.jpg";


    const usrUpdate = await User.updateOne({
        _id: id
    }, {
        name,
        email,
        password,
        avatar
    });

    if (usrUpdate) {
        res.json({
            msg: "User Update !!",
            Details: {
                usrUpdate
            }
        })
    } else {
        res.status(404).json({
            msg: "Error"
        })
    }

})

// jwt : JsonWebTokenError
// sign , verify , decode

// sign => only in the time of logging in (name) with jwtSecret
// verify => in every page
// decode =>  


    router.post("/login", async (req, res) => {
        const email = req.body.email;
        const password = req.body.password;
    
        try {
            // 1. Find the user by email (ignore password here)
            const validUser = await User.findOne({ email });
    
            // 2. If user is not found, return an error
            if (!validUser) {
                return res.status(404).json({ msg: "User not found!" });
            }
    
            // 3. Compare the provided password with the hashed password stored in the database
            const isPasswordValid = await bcrypt.compare(password, validUser.password); // validUser.password is the hashed password
    
            if (!isPasswordValid) {
                return res.status(401).json({ msg: "Authentication Failed!" });
            }
    
            // 4. If password is valid, generate a JWT token
            const id = validUser._id.toString();
            const username = validUser.name;
            const token = jwt.sign({ id }, jwtSecret);
    
            // 5. Send response with token, id, and username
            res.json({
                token,
                id,
                username
            });
    
        } catch (error) {
            // 6. Handle any server errors
            console.error(error);
            res.status(500).json({ msg: "Server Error" });
        }
    });
    

router.post("/logout", authCheck, (req, res) => {
    const token = req.headers.authorization;

    tokenBlacklist.push(token);
    res.json({
        msg: "Logged Out!!"
    })
})


//PROFILE 

router.get("/profile", authCheck, async (req, res) => {
    const token = req.headers.authorization;
    const tokenDecode = jwt.decode(token);
    const userDetails = await User.findOne({
        _id: tokenDecode.id
    })

    res.json({
        Profile: userDetails
    })

})
router.get("/users", async (req, res) => {

    const userDetails = await User.find({
    })

    res.json({
        userDetails
    })

})


// CHATS LIST (One to One)

router.get("/chats", authCheck, async (req, res) => {
    const token = req.headers.authorization;
    const tokenDecode = jwt.decode(token);
    const ChatList = await Chat.find({
        participants: { $in: [tokenDecode.id] }  // sender and receiver both will have the same chat list, only if there are common chat room
    })
        .populate('participants', 'name');

    res.json({
        ChatList
    })

})

router.post("/chats", authCheck, async (req, res) => {
    const token = req.headers.authorization;
    const tokenDecode = jwt.decode(token);
    const id = tokenDecode.id; //sender's id

    const receiverid = req.body.receiverid;

    const chatCreate = await Chat.create({
        participants: [id, receiverid]
    })

    res.json({
        msg: "Chat Created !!",
        chatID: chatCreate._id
    })
})

//CHAT ROOM (One to One)

router.get("/chats/messages", authCheck, async (req, res) => { //Inprocess
    const token = req.headers.authorization;
    const tokenDecode = jwt.decode(token);
    const chatId = req.body.chatId; // Which specific chat history you want to see

    //check for the user wether it is a participants is in chat participants array or not,if not then don't proceed

    const chatValidate = await Chat.findOne({
        _id: chatId,
        participants: { $in: [tokenDecode.id] }
    })

    if (chatValidate) {
        const chatRoom = await Message.find({
            chatId
        })

        res.json({
            chatRoom
        })
    } else {
        res.json({
            msg: null
        })
    }



})

router.post("/chats/messages", authCheck, async (req, res) => { //Working
    const token = req.headers.authorization;
    const tokenDecode = jwt.decode(token);
    const id = tokenDecode.id;
    const chatId = req.body.chatId; //where do you want to send your message
    const content = req.body.content; //what is the content of your message

    const message = await Message.create({
        chatId,
        sender: id,
        content
    })

    const chatUpdate = await Chat.updateOne({
        _id: chatId
    }, {
        lastMessage: content,
        lastMessageTime: message.timestamp,
    })

    res.json({
        chat_details: chatUpdate,
        msg: "Message sent successfully !!"
    })

})

// router.get('/chats/:chatId/messages', async (req, res) => {
//     const { chatId } = req.params;
//     try {
//       const messages = await Message.find({ chatId }).sort({ timestamp: 1 });
//       res.json(messages);
//     } catch (error) {
//       res.status(500).json({ error: 'Failed to fetch messages' });
//     }
//   });

router.get('/chats/:chatId/messages', async (req, res) => {
    const { chatId } = req.params;
    try {
        const messages = await Message.find({ chatId })
            .sort({ timestamp: 1 })
            .populate('sender', 'name'); // Populate the sender field to include the username
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});


module.exports = router, tokenBlacklist;