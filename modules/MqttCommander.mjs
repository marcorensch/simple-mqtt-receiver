import mqtt from 'mqtt';
class MqttCommander {

    host = 'localhost';
    port = 1883;
    connectUrl = "";
    clientId = null;
    client = null;
    topics = [];
    saveToDatabase = false;

    constructor() {
        this.connectUrl = `mqtt://${this.host}:${this.port}`;
        this.clientId = `mqttjs_${Math.random().toString(16).substr(2, 8)}`;
        this.client = mqtt.connect(this.connectUrl, {
            clientId: this.clientId,
            clean: true,
            connectTimeout: 4000,
            reconnectPeriod: 1000,
        })
        this.client.on('message', this.onMessage.bind(this));
        this.client.on('connect', this.onConnect.bind(this));
    }

    onConnect(){
        this.client.on('connect', () => {
            this.subscribe()
        })
    }

    subscribe(topic){
        this.client.subscribe([topic], () => {
            this.topics.push(topic);
            console.log(`Subscribe to topic '${topic}'`)
            console.log(`Suscribed topics: ${this.getSuscribedTopics()}`)
        })
    }

    getSuscribedTopics(){
        let string = this.topics.map((topic) => "'"+topic+"'").join(', ');
        return string;
    }

    onMessage(topic, payload){
        console.log('Received MQTT Message:', topic, payload.toString())
        if(this.saveToDatabase){
            const data = this.createDatabaseObject(payload);
            /** Database Connection can be placed here may need to change as async function **/
        }
    }

    createDatabaseObject(payload){
        /** Modify this function to fit your needs **/
        return payload;
    }

}

export default MqttCommander;