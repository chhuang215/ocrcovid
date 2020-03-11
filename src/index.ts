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
const dcaseFilePath = path.join(__dirname, '/public/dcase.png');

var updatetime = new Date();

function getCaseData(){
    
  (async function() {
    const browser = await puppeteer.launch({
      // headless:false,
    });
    const page = await browser.newPage();
    const page2 = await browser.newPage();
    await page.setViewport({
        width: 201,
        height: 142,
        deviceScaleFactor: 1,
    });
    await page2.setViewport({
      width: 201,
      height: 142,
      deviceScaleFactor: 1,
     });
    await page.goto('https://docs.google.com/spreadsheets/u/0/d/e/2CAIWO3emwU1W8aduko4OOVVOk2jbfqMxurlILAB6NJJxxZ76zj7Ku3yxvkgpYsi9HzXsn-4UAgbwcuUoCgw/gviz/chartiframe?oid=658592343')
    await page2.goto('https://docs.google.com/spreadsheets/u/0/d/e/2CAIWO3emwU1W8aduko4OOVVOk2jbfqMxurlILAB6NJJxxZ76zj7Ku3yxvkgpYsi9HzXsn-4UAgbwcuUoCgw/gviz/chartiframe?oid=1848251752')
    await page.waitFor(2300);
    
    await page.screenshot({path:ccaseFilePath})
    await page2.screenshot({path:dcaseFilePath})

    await browser.close();
  
    
  })().then(() => {
    io.emit('updateDataClient');
    console.log("update data");
    
    // console.log();
  })

  updatetime = new Date();
}

async function reader(){
  // const worker = createWorker({
  //     cachePath: __dirname
  // });
  // await worker.load();
  // await worker.loadLanguage('chi_tra');
  // await worker.initialize('chi_tra');
  // const { data: { text } } = await worker.recognize(ccaseFilePath);
  // if (dataRead != text){
  //     dataRead = text;
  // }
  // await worker.terminate();
}


getCaseData();

app.use('/', router);
router.use(express.static(__dirname + '/public'));
router.get('/',function(req,res){
    console.log(__dirname);
  res.sendFile( path.join(__dirname, './index.html'));
  //__dirname : It will resolve to your project folder.
});

router.get('/getupdatetime', (req,res)=>{
  console.log('send time' + updatetime.toISOString());
  res.send( updatetime.toISOString());
})
  
io.on('connection', function (socket) {
    // io.emit('this', { will: 'be received by everyone'});
  
    socket.on('disconnect', function () {
      io.emit('user disconnected');
    });
  });

server.listen(port, ()=>{
    console.log(`server is listening on ${port}`);
});

var count = 20

setInterval(() => {
  count --;
  io.emit('counter', count);

  if (count < 0){
    getCaseData();
    count = 20;
  }
}, 1000);