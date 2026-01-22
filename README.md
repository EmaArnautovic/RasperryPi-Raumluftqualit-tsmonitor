# RasperryPi-Raumluftqualit-tsmonitor
Dieser Monitor soll verschiedene Parameter wie Temperatur, Luftfeuchte, Feinstaub (PM) und Kohlendioxid (CO2) überwachen und anzeigen. Die Daten werden auf einer Webseite dargestellt, die sowohl aktuelle Werte als auch ein Histogramm enthält.

Das technische Fundament dieses Projekts besteht aus mehreren Schlüsselelementen, die ermöglicht die Überwachung und Auswertung von Umweltparametern. Zentrales Element ist der Raspberry Pi, der als Kernkomponente des Systems dient.
2
Für die Datenerfassung wir benutzen den BME680 Sensor zur Messung von Temperatur und Luftfeuchtigkeit, der Feinstaubsensor PM2.5 für Echtzeit Feinstaubmessungen sowie den MH-Z19-Sensor zur genauen CO2-Erfassung.
Die visuelle Darstellung der Luftqualität erfolgt über eine Ampel, die auf dem Raspberry Pi integriert ist. Die Ampel zeigt grünes, gelbes oder rotes Licht basierend auf den gemessenen Werten, und bietet so eine direkte visuelle Rückmeldung zur Luftqualität.
Die Raspberry Programmierung erfolgt in Python und ermöglicht die Integration der Sensoren sowie die Steuerung der Ampel. Messdaten werden in einer SQL-Datenbank auf Basis des phpmyadmin Webservers gespeichert, die als Speicherlösung fungiert.
Für die Datenabfrage und Präsentation auf einer benutzerfreundlichen Webseite kommt ein NodeJS Server zum Einsatz. Die Gestaltung der Webseite erfolgt mittels HTML, CSS und Vanilla JavaScript, um eine Benutzeroberfläche zu schaffen.
