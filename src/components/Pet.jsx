import React, { useEffect, useState } from "react";

const idleFrames = [
  String.raw`
    /\_____/\  
   /  o   o  \ 
  (     -     )
   \_________/
  `,
  String.raw`
    /\_____/\  
   /  -   -  \ 
  (     -     )
   \___ ~ ___/
  `,
  String.raw`
    /\_____/\  
   /  o   o  \ 
  (     .     )
   \_________/
  `,
];

const sleepFrame = String.raw`
           zZZ  
    /\_____/\  
   /         \ 
  (    -.-    )
   \_________/
`;

const eatFrame = String.raw`
    /\_____/\  
   /   o o   \ 
  (   hmmmm   )
   \_________/
`;

const randomPhrases = [
  "Estou com fome...",
  "Que dia bonito!",
  "Preciso de carinho!",
  "Será que tem alguém aí?",
  "Eu gosto de brincar!",
  "Estou sonhando acordado...",
  "Olá humano!",
  "Zzz... Ouvi alguma coisa?",
  "Será que vamos passear?",
];

function getRandomPhrase() {
  return randomPhrases[Math.floor(Math.random() * randomPhrases.length)];
}

const Pet = ({ command }) => {
  const [currentFrame, setCurrentFrame] = useState(idleFrames[0]);
  const [frameIndex, setFrameIndex] = useState(0);
  const [phrase, setPhrase] = useState("");
  const [scale, setScale] = useState(1);

  // Alterna frames em modo ocioso
  useEffect(() => {
    if (command === "sleep" || command === "feed") return;

    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % idleFrames.length);
    }, 1500);

    return () => clearInterval(interval);
  }, [command]);

  // Atualiza o frame com base no comando
  useEffect(() => {
    if (command === "sleep") {
      setCurrentFrame(sleepFrame);
    } else if (command === "feed") {
      setCurrentFrame(eatFrame);
    } else {
      setCurrentFrame(idleFrames[frameIndex]);
    }
  }, [command, frameIndex]);

  // Animação de respiração
  useEffect(() => {
    const animInterval = setInterval(() => {
      setScale((prevScale) => (prevScale === 1 ? 1.03 : 1));
    }, 1000);
    return () => clearInterval(animInterval);
  }, []);

  // Pensamentos aleatórios
  useEffect(() => {
    const phraseInterval = setInterval(() => {
      const shouldThink = Math.random() < 0.5;
      if (shouldThink) {
        setPhrase(getRandomPhrase());
      } else {
        setPhrase("");
      }
    }, 5000);

    return () => clearInterval(phraseInterval);
  }, []);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {phrase && (
        <div
          style={{
            position: "absolute",
            bottom: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#fff",
            border: "1px solid #999",
            borderRadius: "8px",
            padding: "3px 8px",
            marginBottom: "5px",
            whiteSpace: "nowrap",
            fontSize: "9px",
            color: "#333",
            boxShadow: "2px 2px 4px rgba(0,0,0,0.2)",
            zIndex: 10,
          }}
        >
          {phrase}
        </div>
      )}

      <div
        style={{
          transform: `scale(${scale})`,
          transition: "transform 0.5s ease-in-out",
          fontFamily: "Courier, monospace",
          whiteSpace: "pre",
          fontSize: "25px",
          color: "#000",
        }}
      >
        {currentFrame}
      </div>
    </div>
  );
};

export default Pet;
