(function(window) {
  window.AnimatedDistributionBuilder = {
    init: function({ targetId, labels, values, dropSpeed = 700, autoAdvance = false, maxCount = 10 }) {  // Added maxCount
      const container = document.getElementById(targetId);
      if (!container) return;

      let dropSequence = [];
      let bucketCounts = Array(labels.length).fill(0);

      function setupBuckets() {
        container.innerHTML = "";
        bucketCounts = Array(labels.length).fill(0);
        dropSequence = [];

        container.style.position = "relative";
        container.style.width = "640px";
        container.style.height = "320px";
        container.style.border = "1px solid #ccc";
        container.style.borderRadius = "10px";
        container.style.background = "white";
        container.style.display = "flex";
        container.style.justifyContent = "space-between";
        container.style.boxShadow = "0 0 8px rgba(0, 0, 0, 0.1)";
        container.style.paddingLeft = "50px";

        // Y-axis container
        const yAxis = document.createElement("div");
        yAxis.style.position = "absolute";
        yAxis.style.left = "0";
        yAxis.style.top = "10px";  // padding top
        yAxis.style.bottom = "40px"; // padding bottom
        yAxis.style.width = "50px";
        yAxis.style.display = "flex";
        yAxis.style.flexDirection = "column-reverse"; // bottom-up numbering
        yAxis.style.justifyContent = "space-between";
        yAxis.style.fontSize = "12px";
        yAxis.style.paddingRight = "8px";
        yAxis.style.borderRight = "1px solid #ccc";
        yAxis.style.color = "#333";
        yAxis.style.userSelect = "none";

        for (let i = 1; i <= maxCount; i++) {
          const tick = document.createElement("div");
          tick.textContent = i;
          tick.style.height = `${(container.clientHeight - 50) / maxCount}px`;
          tick.style.lineHeight = tick.style.height;
          tick.style.textAlign = "right";
          yAxis.appendChild(tick);
        }

        container.appendChild(yAxis);

        labels.forEach(labelText => {
          const bucket = document.createElement("div");
          bucket.className = "bucket";
          bucket.style.flex = "1";
          bucket.style.height = "100%";
          bucket.style.borderLeft = "1px solid #ccc";
          bucket.style.position = "relative";

          const label = document.createElement("div");
          label.className = "bucket-label";
          label.textContent = labelText;
          label.style.position = "absolute";
          label.style.bottom = "0";
          label.style.width = "100%";
          label.style.textAlign = "center";
          label.style.fontSize = "12px";
          label.style.backgroundColor = "#e9ecef";
          label.style.borderTop = "1px solid #ccc";
          label.style.padding = "2px 0";

          bucket.appendChild(label);
          container.appendChild(bucket);
        });
      }

      function dropBall(bucketIndex, speed) {
        const bucket = container.children[bucketIndex + 1]; // +1 for Y-axis div
        const count = bucketCounts[bucketIndex];
        bucketCounts[bucketIndex] += 1;
        dropSequence.push(bucketIndex);

        const ball = document.createElement("div");
        ball.className = "ball";
        ball.style.width = "20px";
        ball.style.height = "20px";
        ball.style.borderRadius = "50%";
        ball.style.background = "steelblue";
        ball.style.position = "absolute";
        ball.style.top = "0";
        ball.style.left = "50%";
        ball.style.transform = "translateX(-50%)";
        ball.style.transition = `top ${speed}ms ease`;

        bucket.appendChild(ball);

        requestAnimationFrame(() => {
          ball.style.top = (bucket.clientHeight - 45 - count * 22) + "px";
        });
      }

      async function animateBalls(values, speed) {
        const shuffled = [...values].sort(() => Math.random() - 0.5);
        for (let val of shuffled) {
          dropBall(val, speed);
          await new Promise(r => setTimeout(r, speed + 100));
        }

        if (typeof Qualtrics !== 'undefined' && Qualtrics.SurveyEngine) {
          Qualtrics.SurveyEngine.setEmbeddedData("DropSequence", JSON.stringify(dropSequence));
          if (autoAdvance) document.getElementById("NextButton")?.click();
        }
      }

      // Start sequence
      setupBuckets();
      animateBalls(values, dropSpeed);
    }
  };
})(window);
