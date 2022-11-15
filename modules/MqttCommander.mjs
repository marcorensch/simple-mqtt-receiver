import mqtt from 'mqtt';

class MqttCommander {

    host = 'localhost';
    port = 1883;
    connectUrl = "";
    clientId = null;
    client = null;
    topics = [];
    saveToDatabase = false;
    dbConnection = null;

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

    setDatabaseConnection(dbConnection){
        this.dbConnection = dbConnection;
        this.saveToDatabase = !!dbConnection;
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

    async onMessage(topic, payload){
        const date = new Date().toLocaleDateString();
        console.log(date, 'Received MQTT Message:', topic, payload.toString())
        if(this.saveToDatabase){
            const data = this.createDatabaseObject(topic, payload);
            await this.dbConnection.storeSensorData(data);
        }
    }

    createDatabaseObject(topic, payload){
        payload = JSON.parse(payload.toString());
        const data = {
            topic: topic,
            sensorId: payload.sensorId,
            temperature: payload.temperature,
            humidity: payload.humidity,
            created : new Date().toISOString().slice(0, 19).replace('T', ' ')
        }
        /** Modify this function to fit your needs **/
        return data;
    }

    async saveMessage(topic, data){

    }

}

export default MqttCommander;