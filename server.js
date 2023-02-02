import ws from "ws"
import {v4 as uuid} from "uuid"

const {Server} = ws //забираем сервер из ws

const wss = new Server({port: 8000}) //создаём сервер на 8000 порту
const messages=[] // хранилище всех сообщений
const clients = {} // хранилище индетификаторов клинтов
wss.on("connection",(ws)=>{ //создаём событие подключения
    const id =uuid(); //генерируем id пользователя(подключения)
    clients[id]=ws; //помещаем сокет клиента (не до конца понимаю это)
    console.log(`New client ${id}`);
    clients[id].send(JSON.stringify(messages)) //для только что подключившихся пользователй посылаем историю сообщений
    ws.on('message',(rawMessage)=>{ //создвём метод message но не понятно, как обращаться к другим методам, наверное никак
        const content=JSON.parse(rawMessage) //данные с клиента преобразуем в объект
        messages.push(content); //добавляем сообщение в хранилище сообщений
        for(const id in clients){ //отсылаем всем пользоавтелям сообшение
            clients[id].send(JSON.stringify([content]))
        }
    })
    ws.on("close", ()=>{ //событие выхода из чата
        delete clients[id];
        console.log(`Client is closed ${id}`)
    })
})

