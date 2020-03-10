import express , {Router}from 'express';
import path from 'path';
// import Tesseract, {createWorker}  from 'tesseract.js';
import puppeteer from 'puppeteer';
import http from 'http';
import socketIO from 'socket.io';
const app = express();

const router = Router();
const port = 3000;

const server = http.createServer(app);

var io = socketIO(server);

const ccaseFilePath = path.join(__dirname, '/public/ccase.png');

function getCaseData(){
    // const worker = createWorker({
    //     cachePath: __dirname
    // });
  (async function() {
    const browser = await puppeteer.launch({
      // headless:false,
    });
    const page = await browser.newPage();
    await page.setViewport({
        width: 201,
        height: 142,
        deviceScaleFactor: 1,
    });
    await page.goto('https://docs.google.com/spreadsheets/u/0/d/e/2CAIWO3emwU1W8aduko4OOVVOk2jbfqMxurlILAB6NJJxxZ76zj7Ku3yxvkgpYsi9HzXsn-4UAgbwcuUoCgw/gviz/chartiframe?oid=658592343').then(

    );
    await page.waitFor(2300);
    await page.screenshot({path:ccaseFilePath})
    await browser.close();
  
    // await worker.load();
    // await worker.loadLanguage('chi_tra');
    // await worker.initialize('chi_tra');
    // const { data: { text } } = await worker.recognize(ccaseFilePath);
    // if (dataRead != text){
    //     dataRead = text;
    // }
    // await worker.terminate();
  })().then(() => {
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    io.emit('updateDataClient', time);
    console.log("should update ");
    
    // console.log();
  })
}


getCaseData();

app.use('/', router);
router.use(express.static(__dirname + '/public'));
router.get('/',function(req,res){
    console.log(__dirname);
  res.sendFile( path.join(__dirname, './index.html'));
  //__dirname : It will resolve to your project folder.
});
  
io.on('connection', function (socket) {
    // io.emit('this', { will: 'be received by everyone'});
  
    socket.on('disconnect', function () {
      io.emit('user disconnected');
    });
  });

// app.listen(port, err => {
//   if (err) {
//     return console.error(err);
//   }
//   return console.log(`server is listening on ${port}`);
// });

server.listen(port, ()=>{
    console.log(`server is listening on ${port}`);
});

setInterval(function(){
  getCaseData();
}, 15000);