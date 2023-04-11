import React from "react";
import ParticlesComponent from "./ParticlesComponent";
import './Aboutus.css';
import logo from './logo.png';
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
function Aboutus()
{

    const navigation = useNavigate();
    return(

        <motion.div
        initial = {{opacity : 0}}
        animate = {{opacity : 1 , transition : {duration : 0.5}}}
        exit = {{opacity:0}}
        >
        <ParticlesComponent/>
        <div  id="aboutLogo">
            <img onClick={()=>{navigation('/')}} src={logo} alt = "chattyfai logo"/>
            <div onClick={()=>{navigation('/nav')}} id="menuButton">
                <div id="bar1"></div>
                <div id="bar2"></div>
                <div id="bar3"></div>
            </div>
        </div>
        
        <div id="aboutContainer">
            <h1>About Us</h1>
            <p>The goal of chatyfai.com is to democratize access to cutting-edge natural language processing technology, enabling individuals, small businesses, and non-profit organizations to harness the power of ChatGPT to enhance their communication, productivity, and innovation.
                We envision a world where everyone has access to ChatGPT, regardless of their technical expertise or financial resources. Through our platform, users will be able to easily and affordably integrate ChatGPT into their existing applications, websites, and communication channels, empowering them to better understand and serve their customers, users, and stakeholders.
                We believe that by making ChatGPT more accessible, we can unlock new possibilities for innovation and collaboration, enabling people from all walks of life to communicate and share knowledge more effectively than ever before.
                Our vision is not just to offer access to ChatGPT, but to offer enhanced functionalities like sharing chat gpt answers, translate edit and archive the. All of this at an affordable price
                Ultimately, our vision is to create a world where everyone can communicate and collaborate seamlessly and effortlessly, breaking down barriers of language, culture, and geography
            </p>

            <h1>Fair Use Policy</h1>
            <p>Wir bei chattyfai.com möchten sicherstellen, dass unsere Website für alle Benutzer ein positives Erlebnis bietet. Um dies zu erreichen, haben wir eine Fair Use Policy erstellt, die die Nutzung unserer Website und die Datenverwendung regelt.
               <p> 1.	Nutzung der Website: Die Nutzung unserer Website ist  für alle offen. Jeder Benutzer kann unsere Website für einen angemessenen und legitimen Zweck nutzen, wie zum Beispiel für Unterhaltung, Bildung oder Information.</p>
                <p>2.	Datenverwendung: Unsere Chatbot-Website verwendet Daten, um personalisierte Antworten bereitzustellen. Wir behalten uns das Recht vor, die Datenmenge zu regulieren, um sicherzustellen, dass unsere Server stabil bleiben und ein positives Erlebnis für alle Benutzer gewährleistet ist.</p>
                <p>3.	Spamming: Es ist nicht erlaubt, die Chatbot-Website für unerwünschte Werbung oder Spamming zu nutzen. Wir behalten uns das Recht vor, Benutzerkonten zu sperren oder zu löschen, die gegen diese Regel verstoßen.</p>
               <p> 4.	Datensicherheit: Wir legen großen Wert auf den Schutz der Daten unserer Benutzer. Jeder Benutzer ist für die Sicherheit seines Kontos und seiner Daten verantwortlich. Es ist nicht erlaubt, die Konten oder Daten anderer Benutzer zu hacken oder zu stehlen. Es ist ebenfalls nicht erlaubt, ohne unsere Zustimmung übergrosse Datenmengen zu produzieren</p>
               <p> 5.	Geistiges Eigentum: Die auf unserer Website angezeigten Inhalte sind urheberrechtlich geschützt. Es ist nicht erlaubt, Inhalte unserer Website zu kopieren, zu ändern, zu verkaufen oder anderweitig zu nutzen, ohne unsere ausdrückliche Zustimmung.</p>
                <p>6.	Änderungen: Wir behalten uns das Recht vor, diese Fair Use Policy jederzeit und ohne Vorankündigung zu ändern. Die Nutzung unserer Website nach Änderungen dieser Policy gilt als Zustimmung zu den aktualisierten Bedingungen.</p>
               <p> Wir behalten uns das Recht vor, Benutzerkonten zu sperren oder zu löschen, die gegen diese Fair Use Policy verstoßen. Wir möchten sicherstellen, dass unsere Chatbot-Website ein sicherer und angenehmer Ort für alle Benutzer ist, und dass die Verwendung der Datenmenge fair und gerecht ist.</p>
                Dieser Text wurde automatisch über chattyfai.com erstellt und, wo nötig, manuell angepasst. © März 2023 chattyfai.com
            </p>

            <h1>Frequently Asked Questions</h1>
            <p id="faqs">
            <p>1.	Psychologie und mentale Gesundheit</p>
                <p>2.	Beziehungen und Dating-Tipps</p>
               <p> 3.	Technologie und IT</p>
               <p> 4.	Persönliche Finanzen und Investitionen</p>
               <p> 5.	Gesundheit und Fitness </p>
                <p>6.	Bildung und Lernmethoden </p>
               <p> 7.	Kunst und Kreativität </p>
               <p> 8.	Reisen und Tourismus </p>
               <p> 9.	Klimawandel und Umweltfragen </p>
               <p> 10.	Wie sollte eine gute Fragestellung an chat GPT formuliert sein?	</p>
            </p>
       
        </div>
        </motion.div>



    );
}

export default Aboutus;