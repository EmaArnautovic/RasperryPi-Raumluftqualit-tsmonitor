import bme680
import mh_z19
import time
import statistics
import json
import mysql.connector
import datetime
from   bme680IAQ import *
import serial
import busio
import board
from adafruit_pm25.uart import PM25_UART
from gpiozero import LED

#Datenbank verbindungsinfos festlegen
host = "localhost"
database = "roomairquality"
user = "root"
password = "password"

#Arrays für Messwerte
meanAQ = 0.0

humidity    = []
temperature = []
iaq         = []
co2         = []
dust        = []

#Sensoren initialisieren
iaq_tracker = IAQTracker()

reset_pin = None
uart = serial.Serial("/dev/ttyUSB0", baudrate=9600, timeout=0.25)
pm25 = PM25_UART(uart, reset_pin)


sensor = bme680.BME680(bme680.constants.I2C_ADDR_SECONDARY)

sensor.set_humidity_oversample(bme680.OS_2X)
sensor.set_temperature_oversample(bme680.OS_8X)
sensor.set_filter(bme680.FILTER_SIZE_3)
sensor.set_gas_status(bme680.ENABLE_GAS_MEAS)

#Ampel-LEDs initialisieren
red = LED(13)
yellow = LED(19)
green = LED(26)

#Messen
while True:
    if len(humidity) == 6: 
    
        meanAQ = None

        #Ampel-LED ein/ausschalten auf Basis des IAQ-Wertes
        if len(iaq) > 0:
            meanAQ = round(statistics.mean(iaq), 2)
    
            if meanAQ>=80:
                green.on()
                red.off()
                yellow.off()
            elif meanAQ <80 and meanAQ >=60:
                green.off()
                red.off()
                yellow.on()
            else:
                green.off()
                red.on()
                yellow.off()

        #Verbindung mit DB aufabauen & Daten senden
        try:
            connection = mysql.connector.connect(
            host=host,
            user=user,
            password=password,
            database=database
            )
            cursor = connection.cursor()
        
            timeDate = datetime.datetime.today()
        
            data = {
                "datetime": timeDate,
                "temperature": round(statistics.mean(temperature), 2),
                "humidity": round(statistics.mean(humidity), 3),
                "CO2": round(statistics.mean(co2), 2),
                "IAQ": meanAQ,
                "particles": round(statistics.mean(dust),2)   
            }
            
            insert_query = "INSERT INTO measurments (datetime, temperature, humidity, CO2, IAQ, particles) VALUES (%s, %s, %s, %s, %s, %s)"
            cursor.execute(insert_query, (data["datetime"], data["temperature"], data["humidity"], data["CO2"], data["IAQ"], data["particles"]))
            
            connection.commit()
            
        except mysql.connector.Error as err:
            print(f"Error: {err}")
            
        finally:
            cursor.close()
            connection.close()
        
        humidity.clear()
        temperature.clear()
        iaq.clear()
        co2.clear()
        dust.clear()   
    
    co2.append(int(mh_z19.read().get("co2")))
    
    try:
        dust.append(pm25.read().get("pm25 standard"))
    except Exception as exception:
        print("Unable to read PM2.5", exception)
        continue
    
    if sensor.get_sensor_data():
    
        humidity.append(sensor.data.humidity)
        temperature.append(sensor.data.temperature)
        
        aq = iaq_tracker.getIAQ(sensor.data)
        
        if aq is not None:
            aq = int(aq)
            iaq.append(aq)
    time.sleep(10)