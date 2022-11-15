import * as dotenv from 'dotenv';
dotenv.config();
import MqttCommander from "./modules/MqttCommander.mjs";
import MariadbConnector from "./modules/MariadbConnector.mjs";
const mariadbConnector = new MariadbConnector();

mariadbConnector.createSensorsTable().then(() =>{
    console.log("Database Setup done");
}).catch((err) => {
    console.log(err);
});

const mqttCommander = new MqttCommander();
mqttCommander.setDatabaseConnection(mariadbConnector);
mqttCommander.subscribe('/voyager/sensors/#');
mqttCommander.subscribe('/voyager/another/#');
console.log("Subscribed:", mqttCommander.getSuscribedTopics());

