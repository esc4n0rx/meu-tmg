import React, { useEffect, useState } from 'react';

const Pet = ({ command }) => {
  const [currentFrame, setCurrentFrame] = useState('');
  const [frameIndex, setFrameIndex] = useState(0);
  const [phrase, setPhrase] = useState('');
  const [scale, setScale] = useState(1);
  const [opacity, setOpacity] = useState(1);
  const [isAnimating, setIsAnimating] = useState(true);

  const frames = {
    idle: [
      `
        ╔══════════╗
        ║ ◑   ◑   ║
        ║   ─      ║
        ╚══════════╝
      `,
      `
        ╔══════════╗
        ║ ◉   ◉   ║
        ║   ~      ║
        ╚═╦═══════╦╝
      `,
      `
        ╔══════════╗
        ║ ◑   ◑   ║
        ║  ()      ║
        ╚══════════╝
      `,
    ],
    sleep: `
      ╔══════════╗
      ║   zZZ    ║
      ║ (-.-)    ║
      ╚══════════╝
    `,
    eat: `
      ╔══════════╗
      ║ ◑   ◑   ║
      ║  hmmm    ║
      ╚══════════╝
    `,
    play: [
      `
        ╔══════════╗
        ║ ◕   ◕   ║
        ║  \\o/    ║
        ╚══════════╝
      `,
      `
        ╔══════════╗
        ║ ◕   ◕   ║
        ║   |      ║
        ╚══════════╝
      `,
      `
        ╔══════════╗
        ║ ◕   ◕   ║
        ║  /o\\    ║
        ╚══════════╝
      `,
    ],
    sad: `
      ╔══════════╗
      ║ >.<      ║
      ║   ╥      ║
      ╚══════════╝
    `,
    happy: `
      ╔══════════╗
      ║ ^   ^    ║
      ║   ω      ║
      ╚══════════╝
    `,
  };

  const randomPhrases = [
    'Estou com fome...',
    'Que dia bonito!',
    'Preciso de carinho!',
    'Será que tem alguém aí?',
    'Eu gosto de brincar!',
    'Estou sonhando acordado...',
    'Olá humano!',
    'Zzz... Ouvi alguma coisa?',
    'Será que vamos passear?',
  ];

  const getRandomPhrase = () =>
    randomPhrases[Math.floor(Math.random() * randomPhrases.length)];

  const getRandomFrame = () =>
    frames.idle[Math.floor(Math.random() * frames.idle.length)];

  useEffect(() => {
    let interval;
    switch (command) {
      case 'sleep':
        setCurrentFrame(frames.sleep);
        setIsAnimating(false);
        break;
      case 'feed':
        setCurrentFrame(frames.eat);
        break;
      case 'play':
        interval = setInterval(() => {
          setFrameIndex((prev) => (prev + 1) % frames.play.length);
          setOpacity((prev) => (prev === 1 ? 0.6 : 1));
        }, 500);
        setCurrentFrame(frames.play[frameIndex]);
        break;
      default:
        setCurrentFrame(getRandomFrame());
        setIsAnimating(true);
        interval = setInterval(() => {
          setFrameIndex((prev) => (prev + 1) % frames.idle.length);
          setOpacity((prev) => (prev === 1 ? 0.6 : 1));
        }, 1500);
    }
    return () => clearInterval(interval);
  }, [command, frames]);

  useEffect(() => {
    const scaleInterval = setInterval(() => {
      setScale((prevScale) => (prevScale === 1 ? 1.1 : 1));
    }, 1000);
    return () => clearInterval(scaleInterval);
  }, []);

  useEffect(() => {
    const phraseInterval = setInterval(() => {
      const shouldThink = Math.random() < 0.5;
      setPhrase(shouldThink ? getRandomPhrase() : '');
    }, 5000);
    return () => clearInterval(phraseInterval);
  }, [getRandomPhrase]);

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-block',
        userSelect: 'none',
        width: '200px',
        height: '200px',
        fontFamily: 'monospace',
        whiteSpace: 'pre',
        fontSize: '20px',
        color: '#fff',
        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
      }}
    >
      {phrase && (
        <div
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(255,255,255,0.9)',
            border: '2px solid #333',
            borderRadius: '10px',
            padding: '5px 10px',
            marginBottom: '10px',
            whiteSpace: 'nowrap',
            fontSize: '12px',
            color: '#000',
            boxShadow: '3px 3px 5px rgba(0,0,0,0.3)',
            zIndex: 10,
          }}
        >
          {phrase}
        </div>
      )}
      <div
        style={{
          transform: `scale(${scale})`,
          opacity: opacity,
          transition: 'transform 0.5s ease-in-out, opacity 0.5s ease-in-out',
          lineHeight: 1.2,
        }}
      >
        {currentFrame}
      </div>
    </div>
  );
};

export default Pet;