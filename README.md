# Simulación 3D con Three.js y Boids Algorithm

Esta aplicación web muestra una simulación 3D con tres vistas diferentes y un algoritmo de Boids para simulación de comportamiento de enjambre.

## Características

- Vista principal 3D con controles orbitales
- Vista superior ortográfica
- Vista frontal ortográfica
- Objeto base fijo (esfera roja)
- Vehículo controlable (esfera verde)
- Boids autónomos (esferas azules)
- Panel de control para configurar posiciones y número de boids

## Requisitos

- threejs
- browser 
## Instalación

1. Clonar el repositorio
2. run a live server 

## Ejecución

abrir en el navegador la direccion del live server 

## Controles

- **Vehículo**:
  - Flechas direccionales: Mover en el plano XZ
  - W: Subir en Y
  - S: Bajar en Y

- **Vista principal**:
  - Click izquierdo + arrastrar: Rotar cámara
  - Click derecho + arrastrar: Pan
  - Rueda del ratón: Zoom

## Panel de Control

- **Base**: Configurar la posición del punto base (esfera roja)
- **Vehículo**: Configurar la posición inicial del vehículo (esfera verde)
- **Boids**: Configurar el número de boids en la simulación

## Tecnologías utilizadas

- Three.js para renderizado 3D
- Algoritmo de Boids para la simulación de comportamiento de enjambre 