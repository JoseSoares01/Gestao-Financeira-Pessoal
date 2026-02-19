import { useEffect, useRef } from 'react';

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      color: string;
      pulseSpeed: number;
      pulsePhase: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * 150 + 80;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.15 + 0.05;
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        this.pulsePhase = Math.random() * Math.PI * 2;
        
        const colors = [
          '124, 179, 66',   // primary green
          '85, 139, 47',    // primary dark
          '174, 213, 129',  // primary light
          '76, 175, 80',    // success
          '66, 165, 245',   // info blue
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.pulsePhase += this.pulseSpeed;

        // Wrap around screen
        if (this.x < -this.size) this.x = canvas!.width + this.size;
        if (this.x > canvas!.width + this.size) this.x = -this.size;
        if (this.y < -this.size) this.y = canvas!.height + this.size;
        if (this.y > canvas!.height + this.size) this.y = -this.size;
      }

      draw() {
        if (!ctx) return;
        
        const pulseOpacity = this.opacity + Math.sin(this.pulsePhase) * 0.03;
        const currentOpacity = Math.max(0.02, Math.min(0.2, pulseOpacity));
        
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size
        );
        
        gradient.addColorStop(0, `rgba(${this.color}, ${currentOpacity})`);
        gradient.addColorStop(0.4, `rgba(${this.color}, ${currentOpacity * 0.5})`);
        gradient.addColorStop(0.7, `rgba(${this.color}, ${currentOpacity * 0.2})`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      resize();
      particles = [];
      const particleCount = Math.min(15, Math.floor((canvas.width * canvas.height) / 80000));
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.fillStyle = 'rgba(13, 31, 13, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      animationId = requestAnimationFrame(animate);
    };

    init();
    animate();

    window.addEventListener('resize', init);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', init);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        background: 'linear-gradient(135deg, #0a1a0a 0%, #0d1f0d 50%, #0a180a 100%)',
      }}
    />
  );
}
