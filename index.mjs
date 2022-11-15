import MqttCommander from "./modules/MqttCommander.mjs";

const mqttCommander = new MqttCommander();
mqttCommander.subscribe('/voyager/sensors/#');
mqttCommander.subscribe('/voyager/another/#');
console.log("Subscribed:", mqttCommander.getSuscribedTopics());