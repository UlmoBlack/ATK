import { useEffect, useRef } from 'react';

export default function SpaceBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Yıldızlar
    const stars = [];
    for (let i = 0; i < 150; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.2,
        opacity: Math.random() * 0.5 + 0.3,
        twinkleSpeed: Math.random() * 0.015 + 0.005
      });
    }

    // Parlayan parçacıklar (daha az, daha subtle)
    const particles = [];
    for (let i = 0; i < 15; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        opacity: Math.random() * 0.3 + 0.2
      });
    }

    function draw() {
      // Derin uzay gradient (koyu lacivert/siyah)
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#05070d');
      gradient.addColorStop(0.5, '#0a0e1a');
      gradient.addColorStop(1, '#0d1117');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Yıldızları çiz
      stars.forEach(star => {
        star.opacity += star.twinkleSpeed;
        if (star.opacity > 0.8 || star.opacity < 0.2) {
          star.twinkleSpeed *= -1;
        }
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();
      });

      // Subtle parçacıklar
      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        
        const particleGradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.radius * 4
        );
        particleGradient.addColorStop(0, `rgba(134, 239, 247, ${particle.opacity})`);
        particleGradient.addColorStop(0.5, `rgba(96, 165, 250, ${particle.opacity * 0.4})`);
        particleGradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
        
        ctx.fillStyle = particleGradient;
        ctx.fill();
      });

      requestAnimationFrame(draw);
    }

    draw();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="canvas-container" />;
}

