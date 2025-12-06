import { useEffect, useRef } from 'react';

export default function MatrixBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Canvas boyutunu ayarla
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Matrix karakterleri (Japonca + Latin + sayılar + semboller)
    const matrixChars = 'ｦｱｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ+-*/=<>[]{}()';
    const chars = matrixChars.split('');

    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);
    
    // Her sütun için düşen karakterlerin konumları
    const drops = Array(columns).fill(1);
    
    // Her sütun için farklı hız
    const speeds = Array(columns).fill(0).map(() => 0.3 + Math.random() * 0.7);
    
    // Rastgele parlaklık değişimleri için
    const brightness = Array(columns).fill(0).map(() => Math.random());

    function draw() {
      // Hafif siyah overlay ile iz efekti
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Yeşil metin
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        // Rastgele karakter seç
        const char = chars[Math.floor(Math.random() * chars.length)];
        
        // Parlaklık efekti
        const alpha = brightness[i];
        const greenValue = Math.floor(200 + 55 * alpha);
        
        // İlk karakter (en parlak)
        if (drops[i] * fontSize < fontSize * 2) {
          ctx.fillStyle = `rgba(255, 255, 255, ${0.9 + alpha * 0.1})`;
        } else {
          ctx.fillStyle = `rgba(0, ${greenValue}, 0, 0.8)`;
        }
        
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        // Ekranın altına gelirse veya rastgele reset
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
          speeds[i] = 0.3 + Math.random() * 0.7;
          brightness[i] = Math.random();
        }

        drops[i] += speeds[i];
      }
    }

    const interval = setInterval(draw, 33); // ~30 FPS

    // Window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const newColumns = Math.floor(canvas.width / fontSize);
      drops.length = newColumns;
      speeds.length = newColumns;
      brightness.length = newColumns;
      for (let i = 0; i < newColumns; i++) {
        if (drops[i] === undefined) {
          drops[i] = Math.random() * -100;
          speeds[i] = 0.3 + Math.random() * 0.7;
          brightness[i] = Math.random();
        }
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="canvas-container" />;
}

