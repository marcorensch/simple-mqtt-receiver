import mariadb from "mariadb";

class MariadbConnector {
    constructor(){
        this.pool = mariadb.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            database: process.env.DB_NAME,
            password: process.env.DB_PASS,
            connectionLimit: 5
        });
    }

    async createSensorsTable() {
        let conn;
        const sql = "CREATE TABLE IF NOT EXISTS tbl_sensors (id INT NOT NULL AUTO_INCREMENT, topic VARCHAR(255) NOT NULL, temperature VARCHAR(10), humidity VARCHAR(10), created DATETIME, sensor_id VARCHAR(100), PRIMARY KEY (id))";
        try {
            conn = await this.pool.getConnection();
            return await conn.query(sql);
        } catch (err) {
            console.log(err);
            throw err;
        } finally {
            if (conn) return conn.end();
        }
    }

    async storeSensorData(sensorData) {
        let conn;
        let created = new Date().toISOString().slice(0, 19).replace('T', ' ');
        try{
            conn = await this.pool.getConnection();
            const sql = "INSERT INTO tbl_sensors(topic, temperature, humidity, created, sensor_id) VALUES (?, ?, ?, ?, ?)";
            const params = [sensorData.topic, sensorData.temperature, sensorData.humidity, created, sensorData.sensorId];
            const res = conn.query(sql, params);
            return res;
        }catch (err) {
            throw err;
        } finally {
            if (conn) return conn.end();
        }
    }
}

export default MariadbConnector;