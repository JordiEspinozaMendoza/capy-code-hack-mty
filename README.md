# CapyCode

## Asistente de entrevistas de codigo

El asistente de entrevistas de código es una potente aplicación web diseñada para mejorar el proceso de reclutamiento de una empresa dediacada al desarrollo de software. Utiliza la API de OpenAI para proporcionar soporte en tiempo real tanto a entrevistadores como a entrevistados durante el proceso. Esta herramienta ayuda a agilizar el proceso de entrevista ofreciendo retroalimentación dinámica sobre la calidad del código, la lógica y la sintaxis sin revelar respuestas.

## Características Clave

- _Entrevistas Técnicas en Vivo_: Realice entrevistas técnicas de forma remota con facilidad, utilizando el Asistente de Entrevistas de Código como su entrevistador virtual.

- _Evaluación de Código_: Reciba retroalimentación continua sobre las entregas de código de los candidatos, incluyendo la detección de errores, sugerencias de mejora y evaluación de la calidad del código.

- _Desafíos Personalizables_: Cree y personalice desafíos de codificación adaptados a sus requisitos específicos de trabajo y evalúe las habilidades de resolución de problemas de los candidatos de manera efectiva.

- _Eficiencia y Transparencia_: Agilice el proceso de entrevista, ahorre tiempo y garantice la transparencia en la evaluación de las habilidades de codificación de los candidatos.

- _Integración con Streamlit_: Envia datos de entrevistas a Streamlit, una interfaz de usuario en Python para visualización de paneles. Los reclutadores pueden analizar y tomar decisiones basadas en los datos mostrados en Streamlit.

- _Escalabilidad y Seguridad_: Diseñada para ser escalable y segura, la aplicación garantiza una experiencia de entrevista fluida.

## Cómo Funciona

1. _Configuración_: Como entrevistador, inicie sesión y personalice sus desafíos de codificación o seleccione los predefinidos.

2. _Invitar Candidatos_: Comparta un enlace único de entrevista con los candidatos, permitiéndoles acceder a la sesión de entrevista.

3. _Sesión de Entrevista_: Durante la entrevista, los candidatos escriben código en un entorno de codificación real. El Asistente de Entrevistas de Código proporciona retroalimentación en tiempo real sobre errores lógicos y de sintaxis, ayudando a los candidatos a mejorar la calidad de su código.

4. _Evaluación Final_: Después de la parte de codificación, el asistente proporciona retroalimentación final, indicando si el código es correcto. Si no lo es, resalta las áreas que necesitan mejorar.

5. _Visualización de Datos en Streamlit_: Los datos de la entrevista se envían a Streamlit, donde los reclutadores pueden analizar el desempeño de los candidatos y tomar decisiones informadas.

## Archivos adjuntos/vinculos

1. _capycode.co_

   Lobby:
   <img width="1249" alt="image" src="https://raw.githubusercontent.com/HectorLN/CapyCode/main/public/gifs/intro.gif">

   Guia: <br>
   <img width="355" alt="image" src="https://github.com/JordiEspinozaMendoza/CapyCode-Socket/assets/81432796/fbd21ecc-717e-477e-a5c2-10280617bc54">

   Pantalla de codificacion: <br>
   <img width="1225" alt="image" src="https://raw.githubusercontent.com/HectorLN/CapyCode/main/public/gifs/messages.gif">

   Pantalla terminada: <br>
   <img width="1234" alt="image" src="https://github.com/JordiEspinozaMendoza/CapyCode-Socket/assets/81432796/dfb3f569-c691-4038-a8d9-4ed804b72744">

2. *https://capycode-metrics.streamlit.app/?user_id=29*
   <br>
   Dashboards de entrevistado:
   <br>
   <img width="1251" alt="image" src="https://github.com/JordiEspinozaMendoza/CapyCode-Socket/assets/81432796/580b699e-8473-4f7f-bb71-1544105af0b9">

## Tech Stack

- **Frontend**: Next JS, Socket.io, Material UI
  <img width="30" src="https://user-images.githubusercontent.com/25181517/187070862-03888f18-2e63-4332-95fb-3ba4f2708e59.png" alt="websocket" title="websocket"/>
  <img width="30" src="https://user-images.githubusercontent.com/25181517/189716630-fe6c084c-6c66-43af-aa49-64c8aea4a5c2.png" alt="Material UI" title="Material UI"/>
  <img width="30" src="https://github.com/marwin1991/profile-technology-icons/assets/136815194/5f8c622c-c217-4649-b0a9-7e0ee24bd704" alt="Next.js" title="Next.js"/>
- **Backend**: Node.js, Express, Socket.io, OpenAI SDK, Streamlit
  <img width="30" src="https://user-images.githubusercontent.com/25181517/183568594-85e280a7-0d7e-4d1a-9028-c8c2209e073c.png" alt="Node.js" title="Node.js"/>
  <img width="30" src="https://user-images.githubusercontent.com/25181517/183859966-a3462d8d-1bc7-4880-b353-e2cbed900ed6.png" alt="Express" title="Express"/>

- **Storages**: Redis
  <img width="30" src="https://user-images.githubusercontent.com/25181517/182884894-d3fa6ee0-f2b4-4960-9961-64740f533f2a.png" alt="redis" title="redis"/>
- **Deployment**: Heroku, Netlify
- **CI/CD**: Github Actions
