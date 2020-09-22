/* eslint-disable no-alert */
/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
export function createResizing2dCanvas(canvas, parent, init, redraw, resize, animate = false) {
  const ctx = canvas.getContext('2d');
  let mousex = 0.0;
  let mousey = 0.0;
  let leftbutton = false;
  let rightbutton = false;

  const startMs = performance.now();

  const objects = [];

  let scale = 1.0;

  const gfxtools = {

    setScale(newScale) {
      scale = newScale;
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
    },
    getWidth() {
      return canvas.width / scale;
    },

    getHeight() {
      return canvas.height / scale;
    },

    defineObject(points) {
      const id = objects.length;
      objects.push(points);
      return id;
    },

    getContext() {
      return ctx;
    },


    drawInstances(objectId, items) {
      items.foreach((item) => {
        ctx.setTransform(scale, 0, 0, scale, item.posX * scale, item.posY * scale);
        this.drawLineStrip(objects[objectId]);
      });
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
    },

    setPen(colour, width, alpha = 1) {
      ctx.strokeStyle = colour;
      ctx.fillStyle = colour;
      ctx.lineWidth = width / scale;
      ctx.globalAlpha = alpha;
    },

    drawLines(points) {
      ctx.beginPath();
      for (let i = 3; i < points.length; i += 4) {
        ctx.moveTo(points[i - 3], points[i - 2]);
        ctx.lineTo(points[i - 1], points[i]);
      }
      ctx.stroke();
    },
    drawLineStrip(points) {
      if (points.length < 2) {
        return;
      }
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i += 1) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.stroke();
    },
    drawDot(pos, size) {
      ctx.fillRect(pos.x - size / 2, pos.y - size / 2, size, size);
    },
    drawCircle(pos, r) {
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, r, 0, 2 * Math.PI);
      ctx.stroke();
    },
    fillCircle(pos, r) {
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, r, 0, 2 * Math.PI);
      ctx.fill();
    },
    screenHeight() {
      return canvas.height;
    },
    screenWidth() {
      return canvas.width;
    },

    clear() {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
    },

  };

  function draw() {
    const msSinceStart = performance.now() - startMs;
    redraw(msSinceStart, gfxtools);
  }

  // this function gets called by the browser when the window is resized
  // it also makes sure that our canvas fills the window
  function resizeCanvas() {
    if (parent) {
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    } else {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  }

  canvas.addEventListener('mousedown', (e) => {
    if (e.button === 0) {
      leftbutton = true;
    }
    if (e.button === 2) {
      rightbutton = true;
    }
  });

  canvas.addEventListener('mouseup', (e) => {
    if (e.button === 0) {
      leftbutton = false;
    }
    if (e.button === 2) {
      rightbutton = false;
    }
  });

  canvas.addEventListener('mousemove', (e) => {
    mousex = e.clientX;
    mousey = e.clientY;
  });

  // call it once to make sure all sizes are in sync
  resizeCanvas();

  init(gfxtools);

  if (animate) {
    const doFrame = () => {
      if (canvas.isConnected) {
        requestAnimationFrame(doFrame);
        draw();
      }
    };
    requestAnimationFrame(doFrame);
  } else {
    draw();
  }

  // register the resizeCanvas callback function with the browser
  window.addEventListener('resize', () => { resizeCanvas(); resize(gfxtools); }, true);
}
export function createFullscreen2dCanvas(canvas, init, redraw, resize, animate = false) {
  createResizing2dCanvas(canvas, null, init, redraw, resize, animate);
}