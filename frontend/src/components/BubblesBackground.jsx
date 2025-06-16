import React, { useEffect, useRef } from 'react';

const BubblesBackground = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const bubblesRef = useRef([]);
  const gradientPositionRef = useRef(0);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const liquidPointsRef = useRef([]);
  const neuralPointsRef = useRef([]);
  const quantumParticlesRef = useRef([]);
  const hologramPointsRef = useRef([]);
  const aiDataPointsRef = useRef([]);
  const timeVortexRef = useRef([]);
  const dnaStrandsRef = useRef([]);
  const soundWavesRef = useRef([]);
  const lasersRef = useRef([]);
  const isHoveringLaserRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false });
    let isActive = true;
    let time = 0;
    let audioContext = null;
    let analyser = null;
    let microphone = null;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };

    // Liquid Morphing Effect
    class LiquidPoint {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.originalX = x;
        this.originalY = y;
        this.vx = 0;
        this.vy = 0;
      }

      update() {
        const dx = this.x - mousePositionRef.current.x;
        const dy = this.y - mousePositionRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 200;
        const force = 0.2;

        if (distance < maxDistance) {
          const angle = Math.atan2(dy, dx);
          const strength = (maxDistance - distance) / maxDistance;
          this.vx += Math.cos(angle) * force * strength;
          this.vy += Math.sin(angle) * force * strength;
        }

        // Return to original position
        const dx2 = this.originalX - this.x;
        const dy2 = this.originalY - this.y;
        this.vx += dx2 * 0.01;
        this.vy += dy2 * 0.01;

        // Apply friction
        this.vx *= 0.95;
        this.vy *= 0.95;

        this.x += this.vx;
        this.y += this.vy;
      }
    }

    // Neural Network Effect
    class NeuralPoint {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.connections = [];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        // Connect with nearby points
        this.connections = [];
        neuralPointsRef.current.forEach(point => {
          if (point !== this) {
            const dx = this.x - point.x;
            const dy = this.y - point.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 100) {
              this.connections.push({ point, distance });
            }
          }
        });
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fill();

        this.connections.forEach(({ point, distance }) => {
          ctx.beginPath();
          ctx.moveTo(this.x, this.y);
          ctx.lineTo(point.x, point.y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 * (1 - distance / 100)})`;
          ctx.stroke();
        });
      }
    }

    // Laser Effect - Hiệu ứng laser tương tác
    class Laser {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.angle = Math.random() * Math.PI * 2;
        this.length = Math.random() * 100 + 50;
        this.width = Math.random() * 2 + 1;
        this.speed = Math.random() * 0.02 + 0.01;
        this.phase = Math.random() * Math.PI * 2;
        this.targetAngle = this.angle;
        this.isHovered = false;
      }

      update() {
        this.phase += this.speed;
        
        // Tính toán khoảng cách đến chuột
        const dx = mousePositionRef.current.x - this.x;
        const dy = mousePositionRef.current.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Nếu chuột ở gần, laser sẽ hướng về phía chuột
        if (distance < 200) {
          this.targetAngle = Math.atan2(dy, dx);
          this.isHovered = true;
        } else {
          this.isHovered = false;
        }

        // Mượt mà chuyển động đến góc mục tiêu
        const angleDiff = this.targetAngle - this.angle;
        this.angle += angleDiff * 0.1;

        // Thêm hiệu ứng rung
        this.angle += Math.sin(this.phase) * 0.01;
      }

      draw() {
        const endX = this.x + Math.cos(this.angle) * this.length;
        const endY = this.y + Math.sin(this.angle) * this.length;

        // Vẽ tia laser chính
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = this.isHovered ? 
          `rgba(255, 50, 50, ${0.8 + Math.sin(this.phase) * 0.2})` : 
          `rgba(255, 50, 50, ${0.3 + Math.sin(this.phase) * 0.2})`;
        ctx.lineWidth = this.isHovered ? this.width * 2 : this.width;
        ctx.stroke();

        // Thêm hiệu ứng glow
        if (this.isHovered) {
          ctx.shadowBlur = 20;
          ctx.shadowColor = 'rgba(255, 50, 50, 0.5)';
          ctx.stroke();
          ctx.shadowBlur = 0;
        }

        // Vẽ điểm phát laser
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = this.isHovered ? 'rgba(255, 50, 50, 0.8)' : 'rgba(255, 50, 50, 0.4)';
        ctx.fill();
      }
    }

    // Quantum Particles Effect
    class QuantumParticle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speed = Math.random() * 2 + 1;
        this.angle = Math.random() * Math.PI * 2;
        this.quantumState = Math.random() * Math.PI * 2;
        this.entangled = null;
      }

      update() {
        // Quantum tunneling effect
        if (Math.random() < 0.01) {
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
        }

        // Wave function collapse
        this.quantumState += 0.02;
        const wave = Math.sin(this.quantumState) * 0.5 + 0.5;

        this.x += Math.cos(this.angle) * this.speed * wave;
        this.y += Math.sin(this.angle) * this.speed * wave;

        if (this.x < 0 || this.x > canvas.width) this.angle = Math.PI - this.angle;
        if (this.y < 0 || this.y > canvas.height) this.angle = -this.angle;

        // Quantum entanglement
        if (!this.entangled && Math.random() < 0.001) {
          const partner = quantumParticlesRef.current.find(p => !p.entangled && p !== this);
          if (partner) {
            this.entangled = partner;
            partner.entangled = this;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(127, 95, 255, ${0.5 + Math.sin(this.quantumState) * 0.3})`;
        ctx.fill();

        if (this.entangled) {
          ctx.beginPath();
          ctx.moveTo(this.x, this.y);
          ctx.lineTo(this.entangled.x, this.entangled.y);
          ctx.strokeStyle = `rgba(72, 198, 239, ${0.2})`;
          ctx.stroke();
        }
      }
    }

    // Hologram Effect
    class HologramPoint {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.z = Math.random() * 100;
        this.size = Math.random() * 4 + 2;
        this.phase = Math.random() * Math.PI * 2;
      }

      update() {
        this.phase += 0.05;
        this.z = 50 + Math.sin(this.phase) * 30;
        
        // Hologram interference
        const interference = Math.sin(this.phase) * Math.cos(time * 0.001);
        this.size = (Math.random() * 4 + 2) * (1 + interference * 0.3);
      }

      draw() {
        const alpha = 0.3 + Math.sin(this.phase) * 0.2;
        const hue = (this.phase * 180 / Math.PI) % 360;
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue}, 100%, 70%, ${alpha})`;
        ctx.fill();

        // Hologram scan lines
        ctx.beginPath();
        ctx.moveTo(this.x - this.size, this.y);
        ctx.lineTo(this.x + this.size, this.y);
        ctx.strokeStyle = `hsla(${hue}, 100%, 70%, ${alpha * 0.5})`;
        ctx.stroke();
      }
    }

    // AI Data Visualization
    class AIDataPoint {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.value = Math.random();
        this.targetValue = Math.random();
        this.connections = [];
      }

      update() {
        // AI learning simulation
        this.value += (this.targetValue - this.value) * 0.1;
        
        // Update connections based on similarity
        this.connections = aiDataPointsRef.current
          .filter(p => p !== this)
          .map(p => ({
            point: p,
            similarity: 1 - Math.abs(this.value - p.value)
          }))
          .filter(c => c.similarity > 0.7);
      }

      draw() {
        const size = 3 + this.value * 5;
        ctx.beginPath();
        ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(224, 195, 252, ${0.3 + this.value * 0.5})`;
        ctx.fill();

        // Draw connections
        this.connections.forEach(({ point, similarity }) => {
          ctx.beginPath();
          ctx.moveTo(this.x, this.y);
          ctx.lineTo(point.x, point.y);
          ctx.strokeStyle = `rgba(224, 195, 252, ${similarity * 0.3})`;
          ctx.stroke();
        });
      }
    }

    // Time Vortex Effect - Hiệu ứng xoáy thời gian
    class TimeVortex {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = Math.random() * 50 + 20;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 0.02 + 0.01;
        this.timeDistortion = 0;
      }

      update() {
        this.angle += this.speed;
        this.timeDistortion = Math.sin(time * 0.001) * 0.5 + 0.5;
        
        // Tạo hiệu ứng xoáy thời gian
        const distortion = Math.sin(this.angle * 5) * this.timeDistortion;
        this.radius += Math.sin(time * 0.002) * 0.5;
        
        // Tạo hiệu ứng "time dilation"
        this.speed *= 0.999 + Math.sin(time * 0.001) * 0.001;
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
        // Vẽ xoáy thời gian
        for (let i = 0; i < 10; i++) {
          const progress = i / 10;
          const radius = this.radius * (1 - progress);
          const alpha = 0.3 * (1 - progress);
          
          ctx.beginPath();
          ctx.arc(0, 0, radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(127, 95, 255, ${alpha})`;
          ctx.lineWidth = 2;
          ctx.stroke();
          
          // Thêm hiệu ứng "time particles"
          const particleAngle = this.angle + progress * Math.PI * 2;
          const x = Math.cos(particleAngle) * radius;
          const y = Math.sin(particleAngle) * radius;
          
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(72, 198, 239, ${alpha})`;
          ctx.fill();
        }
        
        ctx.restore();
      }
    }

    // DNA Strand Effect - Hiệu ứng chuỗi DNA tương tác
    class DNAStrand {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.length = Math.random() * 100 + 50;
        this.angle = Math.random() * Math.PI * 2;
        this.twist = 0;
        this.basePairs = [];
        this.generateBasePairs();
      }

      generateBasePairs() {
        this.basePairs = [];
        const numPairs = 20;
        for (let i = 0; i < numPairs; i++) {
          this.basePairs.push({
            offset: i / numPairs,
            type: Math.random() < 0.5 ? 'A-T' : 'G-C',
            phase: Math.random() * Math.PI * 2
          });
        }
      }

      update() {
        this.twist += 0.02;
        this.basePairs.forEach(pair => {
          pair.phase += 0.05;
        });
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        // Vẽ chuỗi DNA
        for (let i = 0; i < this.basePairs.length; i++) {
          const pair = this.basePairs[i];
          const y = (pair.offset - 0.5) * this.length;
          const x = Math.sin(this.twist + pair.phase) * 20;

          // Vẽ base pair
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(-x, y);
          ctx.strokeStyle = `rgba(127, 95, 255, ${0.5 + Math.sin(pair.phase) * 0.3})`;
          ctx.lineWidth = 2;
          ctx.stroke();

          // Vẽ kết nối
          if (i < this.basePairs.length - 1) {
            const nextPair = this.basePairs[i + 1];
            const nextY = (nextPair.offset - 0.5) * this.length;
            const nextX = Math.sin(this.twist + nextPair.phase) * 20;

            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(nextX, nextY);
            ctx.strokeStyle = `rgba(72, 198, 239, ${0.3})`;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(-x, y);
            ctx.lineTo(-nextX, nextY);
            ctx.strokeStyle = `rgba(224, 195, 252, ${0.3})`;
            ctx.stroke();
          }
        }

        ctx.restore();
      }
    }

    // Sound Wave Effect - Hiệu ứng sóng âm tương tác
    class SoundWave {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = 0;
        this.maxRadius = Math.random() * 100 + 50;
        this.speed = Math.random() * 2 + 1;
        this.frequency = Math.random() * 1000 + 500;
        this.amplitude = Math.random() * 20 + 10;
        this.phase = 0;
      }

      update() {
        this.radius += this.speed;
        this.phase += 0.1;

        if (this.radius > this.maxRadius) {
          this.reset();
        }

        // Tạo hiệu ứng sóng âm
        const distortion = Math.sin(this.phase) * this.amplitude;
        this.radius += distortion * 0.1;
      }

      draw() {
        const alpha = 1 - (this.radius / this.maxRadius);
        
        // Vẽ sóng âm
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(127, 95, 255, ${alpha * 0.5})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Thêm hiệu ứng "sound particles"
        const numParticles = 8;
        for (let i = 0; i < numParticles; i++) {
          const angle = (i / numParticles) * Math.PI * 2;
          const x = this.x + Math.cos(angle) * this.radius;
          const y = this.y + Math.sin(angle) * this.radius;
          
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(72, 198, 239, ${alpha})`;
          ctx.fill();
        }
      }
    }

    // Cải thiện Bubble class với tương tác tốt hơn
    class Bubble {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 100;
        this.size = Math.random() * 15 + 8;
        this.speed = Math.random() * 1.5 + 0.5;
        this.opacity = Math.random() * 0.3 + 0.1;
        this.originalSize = this.size;
        this.originalOpacity = this.opacity;
        this.angle = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
      }

      update() {
        this.y -= this.speed;
        this.angle += this.rotationSpeed;

        // Tính toán khoảng cách đến chuột
        const dx = mousePositionRef.current.x - this.x;
        const dy = mousePositionRef.current.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 150;

        if (distance < maxDistance) {
          // Tương tác với chuột
          const force = (maxDistance - distance) / maxDistance;
          this.x += dx * force * 0.1;
          this.y += dy * force * 0.1;
          this.size = this.originalSize * (1 + force * 0.5);
          this.opacity = this.originalOpacity * (1 + force * 0.5);
        } else {
          // Trở về trạng thái ban đầu
          this.size = this.originalSize;
          this.opacity = this.originalOpacity;
        }

        // Kiểm tra va chạm với laser
        lasersRef.current.forEach(laser => {
          if (laser.isHovered) {
            const laserEndX = laser.x + Math.cos(laser.angle) * laser.length;
            const laserEndY = laser.y + Math.sin(laser.angle) * laser.length;
            
            // Tính toán khoảng cách từ bong bóng đến tia laser
            const distToLaser = this.distanceToLine(
              this.x, this.y,
              laser.x, laser.y,
              laserEndX, laserEndY
            );

            if (distToLaser < this.size) {
              // Hiệu ứng khi bong bóng bị laser chiếu
              this.size *= 0.95;
              this.opacity *= 0.95;
              this.speed *= 1.05;
            }
          }
        });

        if (this.y < -this.size) {
          this.reset();
        }
      }

      distanceToLine(x, y, x1, y1, x2, y2) {
        const A = x - x1;
        const B = y - y1;
        const C = x2 - x1;
        const D = y2 - y1;

        const dot = A * C + B * D;
        const len_sq = C * C + D * D;
        let param = -1;

        if (len_sq !== 0) {
          param = dot / len_sq;
        }

        let xx, yy;

        if (param < 0) {
          xx = x1;
          yy = y1;
        } else if (param > 1) {
          xx = x2;
          yy = y2;
        } else {
          xx = x1 + param * C;
          yy = y1 + param * D;
        }

        const dx = x - xx;
        const dy = y - yy;

        return Math.sqrt(dx * dx + dy * dy);
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        // Vẽ bong bóng với hiệu ứng 3D
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity * 0.8})`);
        gradient.addColorStop(0.5, `rgba(255, 255, 255, ${this.opacity * 0.3})`);
        gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);

        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Thêm highlight
        ctx.beginPath();
        ctx.arc(-this.size * 0.3, -this.size * 0.3, this.size * 0.1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * 0.8})`;
        ctx.fill();

        ctx.restore();
      }
    }

    // Khởi tạo Audio Context cho hiệu ứng âm thanh
    const initAudio = async () => {
      try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
      } catch (error) {
        console.log('Audio initialization failed:', error);
      }
    };

    const init = () => {
      resizeCanvas();
      bubblesRef.current = Array.from({ length: 30 }, () => new Bubble());
      liquidPointsRef.current = Array.from({ length: 100 }, () => new LiquidPoint(
        Math.random() * canvas.width,
        Math.random() * canvas.height
      ));
      neuralPointsRef.current = Array.from({ length: 50 }, () => new NeuralPoint());
      quantumParticlesRef.current = Array.from({ length: 100 }, () => new QuantumParticle());
      hologramPointsRef.current = Array.from({ length: 50 }, () => new HologramPoint());
      aiDataPointsRef.current = Array.from({ length: 30 }, () => new AIDataPoint());
      timeVortexRef.current = Array.from({ length: 5 }, () => new TimeVortex());
      dnaStrandsRef.current = Array.from({ length: 10 }, () => new DNAStrand());
      soundWavesRef.current = Array.from({ length: 3 }, () => new SoundWave());
      lasersRef.current = Array.from({ length: 15 }, () => new Laser());
      
      initAudio();
    };

    const drawBackground = () => {
      // Base gradient with futuristic colors
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#7F5FFF');
      gradient.addColorStop(0.5, '#48C6EF');
      gradient.addColorStop(1, '#E0C3FC');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add cyber grid with perspective
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      const gridSize = 50;
      const perspective = 0.5;
      
      for (let x = 0; x < canvas.width; x += gridSize) {
        const depth = (x / canvas.width) * perspective;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - depth)})`;
        ctx.stroke();
      }
      
      for (let y = 0; y < canvas.height; y += gridSize) {
        const depth = (y / canvas.height) * perspective;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - depth)})`;
        ctx.stroke();
      }

      // Add moving gradient with time distortion
      gradientPositionRef.current = (gradientPositionRef.current + 0.001) % 1;
      const x1 = Math.cos(gradientPositionRef.current * Math.PI * 2) * canvas.width * 0.5 + canvas.width * 0.5;
      const y1 = Math.sin(gradientPositionRef.current * Math.PI * 2) * canvas.height * 0.5 + canvas.height * 0.5;
      const x2 = Math.cos((gradientPositionRef.current + 0.5) * Math.PI * 2) * canvas.width * 0.5 + canvas.width * 0.5;
      const y2 = Math.sin((gradientPositionRef.current + 0.5) * Math.PI * 2) * canvas.height * 0.5 + canvas.height * 0.5;

      const movingGradient = ctx.createLinearGradient(x1, y1, x2, y2);
      movingGradient.addColorStop(0, 'rgba(127, 95, 255, 0.3)');
      movingGradient.addColorStop(0.5, 'rgba(72, 198, 239, 0.3)');
      movingGradient.addColorStop(1, 'rgba(224, 195, 252, 0.3)');
      ctx.fillStyle = movingGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const animate = () => {
      if (!isActive) return;
      time++;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background
      drawBackground();
      
      // Update and draw all effects
      liquidPointsRef.current.forEach(point => point.update());
      neuralPointsRef.current.forEach(point => {
        point.update();
        point.draw();
      });
      quantumParticlesRef.current.forEach(particle => {
        particle.update();
        particle.draw();
      });
      hologramPointsRef.current.forEach(point => {
        point.update();
        point.draw();
      });
      aiDataPointsRef.current.forEach(point => {
        point.update();
        point.draw();
      });
      timeVortexRef.current.forEach(vortex => {
        vortex.update();
        vortex.draw();
      });
      dnaStrandsRef.current.forEach(strand => {
        strand.update();
        strand.draw();
      });
      soundWavesRef.current.forEach(wave => {
        wave.update();
        wave.draw();
      });
      lasersRef.current.forEach(laser => {
        laser.update();
        laser.draw();
      });
      bubblesRef.current.forEach(bubble => {
        bubble.update();
        bubble.draw();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mousePositionRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    init();
    animate();

    const handleResize = () => {
      resizeCanvas();
      init();
    };

    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      isActive = false;
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioContext) {
        audioContext.close();
      }
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full liquid-gradient">
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{ zIndex: -1 }}
      />
    </div>
  );
};

export default BubblesBackground; 