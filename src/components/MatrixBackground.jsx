import { useEffect, useRef } from 'react';

export default function SpaceBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Yıldızlar ve parçacıklar
    const stars = [];
    const particles = [];
    
    // Yıldız oluştur
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5,
        opacity: Math.random(),
        twinkleSpeed: Math.random() * 0.02 + 0.01
      });
    }

    // Parlayan parçacıklar
    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.3
      });
    }

    function draw() {
      // Gradient arka plan (uzay mavisi/mor)
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0a0e27');
      gradient.addColorStop(0.5, '#1a1f3a');
      gradient.addColorStop(1, '#0f1729');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Yıldızları çiz
      stars.forEach(star => {
        star.opacity += star.twinkleSpeed;
        if (star.opacity > 1 || star.opacity < 0.3) {
          star.twinkleSpeed *= -1;
        }
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();
      });

      // Parlayan parçacıkları çiz
      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Ekran dışına çıkarsa tekrar içeri al
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Parçacık
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        
        const particleGradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.radius * 3
        );
        particleGradient.addColorStop(0, `rgba(147, 197, 253, ${particle.opacity})`);
        particleGradient.addColorStop(0.5, `rgba(96, 165, 250, ${particle.opacity * 0.5})`);
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

