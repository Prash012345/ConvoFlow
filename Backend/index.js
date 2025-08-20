const express = require("express");
const port = 8000;
const app = express();
const cors = require('cors');
const bodyParser = require("body-parser");

app.use(cors());
app.use(cors({
    origin: "http://localhost:3000", // Your frontend URL
    methods: ["GET", "POST"],
    credentials: true // Enable credentials if you need to send cookies or authentication headers
  }));

//for socket (testing in process)
const http = require('http');
const server = http.createServer(app);
const { initializeSocket } = require('./socket');
initializeSocket(server);


const apiRouter = require("./routes/api");


app.use(bodyParser.json());


app.use("/api",apiRouter);

app.get("/",function(req,res){
    res.json({
        msg : "Work In Progress!!"
    })
})

// app.get('/', (req, res) => {
//     res.sendFile(join(__dirname, 'index.html'));
//   });

//   io.on('connection', (socket) => {
//     console.log('a user connected');
//     socket.on('disconnect', () => {
//         console.log('user disconnected');
//       });
//   });

server.listen(port,(req,res)=>{
    console.log("Server is running on http://localhost:"+port);
})